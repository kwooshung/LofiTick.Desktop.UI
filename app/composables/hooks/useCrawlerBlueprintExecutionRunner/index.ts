/**
 * 类型：爬虫蓝图执行终态。
 */
type TCrawlerBlueprintExecutionFinishStatus = 'success' | 'failed' | 'stopped';

/**
 * 接口：爬虫蓝图执行入参。
 */
interface ICrawlerBlueprintExecutionRunnerInput {
  /**
   * 蓝图 ID。
   */
  blueprintId: number;

  /**
   * 站点 ID。
   */
  targetId: number;

  /**
   * 站点名称。
   */
  siteName: string;

  /**
   * 基础 URL。
   */
  baseUrl: string;

  /**
   * 完整节点图数据。
   */
  nodes: unknown;

  /**
   * 执行入口参数覆盖值。
   */
  parameters?: Record<string, unknown>;
}

/**
 * 接口：爬虫蓝图执行结果。
 */
interface ICrawlerBlueprintExecutionRunnerResult {
  /**
   * 执行记录 ID。
   */
  executionId: number;

  /**
   * Tauri 会话 ID。
   */
  sessionId: string;

  /**
   * Tauri 任务 ID。
   */
  taskId: string;
}

/**
 * Hook：爬虫蓝图执行记录闭环。
 * @returns {Promise<object>} 执行器方法。
 */
export const useCrawlerBlueprintExecutionRunner = async () => {
  /**
   * Hook：Tauri 爬虫蓝图能力。
   */
  const { execute, unlockCrawlerBlueprintAudio } = useTauriCrawlerBlueprint();

  /**
   * API：创建执行记录。
   */
  const {
    datas: stateExecutionAddDatas,
    error: stateExecutionAddError,
    refresh: refreshExecutionAdd
  } = await useApi<{ affected: number; executionId: number }>('crawlers/executions/add', {
    method: 'POST',
    immediate: false
  });

  /**
   * API：完成执行记录。
   */
  const { error: stateExecutionFinishError, refresh: refreshExecutionFinish } = await useApi<{ affected: number }>('crawlers/executions/finish', {
    method: 'POST',
    immediate: false
  });

  /**
   * 函数：完成执行记录。
   * @param {number} blueprintId 蓝图 ID。
   * @param {number} executionId 执行记录 ID。
   * @param {TCrawlerBlueprintExecutionFinishStatus} status 执行终态。
   * @param {Record<string, unknown>} resultSummary 执行结果摘要。
   * @param {string} errorMessage 错误信息。
   * @returns {Promise<void>} Promise。
   */
  const finish = async (blueprintId: number, executionId: number, status: TCrawlerBlueprintExecutionFinishStatus, resultSummary: Record<string, unknown>, errorMessage: string): Promise<void> => {
    if (executionId <= 0) {
      return;
    }

    await refreshExecutionFinish({
      datas: {
        blueprintId,
        executionId,
        status,
        recordsCount: 0,
        resultSummary,
        errorMessage
      },
      replace: true
    });

    if (stateExecutionFinishError.value) {
      throw stateExecutionFinishError.value;
    }
  };

  /**
   * 函数：执行爬虫蓝图并回写执行记录。
   * @param {ICrawlerBlueprintExecutionRunnerInput} input 执行入参。
   * @returns {Promise<ICrawlerBlueprintExecutionRunnerResult>} 执行结果。
   */
  const run = async (input: ICrawlerBlueprintExecutionRunnerInput): Promise<ICrawlerBlueprintExecutionRunnerResult> => {
    await refreshExecutionAdd({
      datas: {
        id: input.blueprintId
      },
      replace: true
    });

    if (stateExecutionAddError.value) {
      throw stateExecutionAddError.value;
    }

    const executionId = Number(stateExecutionAddDatas.value?.executionId ?? 0);
    if (!Number.isFinite(executionId) || executionId <= 0) {
      throw new Error('execution id missing');
    }

    try {
      await unlockCrawlerBlueprintAudio();

      const response = await execute({
        blueprintId: input.blueprintId,
        targetId: input.targetId,
        siteName: input.siteName,
        baseUrl: input.baseUrl,
        nodes: input.nodes,
        parameters: input.parameters
      });

      const sessionId = String(response.sessionId ?? '');
      const taskId = String(response.taskId ?? '');

      await finish(input.blueprintId, executionId, 'success', { sessionId, taskId }, '');

      return {
        executionId,
        sessionId,
        taskId
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message.trim() : String(error ?? '').trim();

      await finish(input.blueprintId, executionId, 'failed', { message: errorMessage }, errorMessage);

      throw error;
    }
  };

  return { run };
};

import type { ICrawlerBlueprintExecutionParameterItem, ICrawlerBlueprintFlowLike } from '@/components/crawlers/execution/parameters/index.types';
import { variableDefinitionsParse } from '@/components/crawlers/nodes/variable/shared/index';

/**
 * 函数：解析蓝图图数据。
 * @param {unknown} flowData 蓝图图数据。
 * @returns {ICrawlerBlueprintFlowLike | null} 解析后的图结构。
 */
export const crawlerBlueprintExecutionFlowParse = (flowData: unknown): ICrawlerBlueprintFlowLike | null => {
  const normalizedFlowData = (() => {
    if (typeof flowData !== 'string') {
      return flowData;
    }

    try {
      return JSON.parse(flowData) as unknown;
    } catch {
      return null;
    }
  })();

  if (normalizedFlowData === null || typeof normalizedFlowData !== 'object') {
    return null;
  }

  return normalizedFlowData as ICrawlerBlueprintFlowLike;
};

/**
 * 函数：提取开始节点执行参数。
 * @param {unknown} flowData 蓝图图数据。
 * @returns {ICrawlerBlueprintExecutionParameterItem[]} 执行参数列表。
 */
export const crawlerBlueprintExecutionParametersExtract = (flowData: unknown): ICrawlerBlueprintExecutionParameterItem[] => {
  const parsedFlow = crawlerBlueprintExecutionFlowParse(flowData);

  if (!parsedFlow || !Array.isArray(parsedFlow.nodes)) {
    return [];
  }

  const startNode = parsedFlow.nodes.find((node) => String(node.type ?? '').trim() === 'start');

  if (!startNode) {
    return [];
  }

  return variableDefinitionsParse(startNode.data?.crawlerParameters).filter((item) => item.id.trim() !== '');
};

/**
 * 函数：将本次执行值写回开始节点参数默认值。
 * @param {unknown} flowData 蓝图图数据。
 * @param {Record<string, unknown>} parameters 执行参数覆盖值。
 * @returns {unknown} 已写回默认值的蓝图图数据。
 */
export const crawlerBlueprintExecutionDefaultsApply = (flowData: unknown, parameters: Record<string, unknown>): unknown => {
  const parsedFlow = crawlerBlueprintExecutionFlowParse(flowData);

  if (!parsedFlow || !Array.isArray(parsedFlow.nodes)) {
    return flowData;
  }

  const nextFlow = structuredClone(parsedFlow);
  const startNode = nextFlow.nodes?.find((node) => String(node.type ?? '').trim() === 'start');

  if (!startNode) {
    return nextFlow;
  }

  const currentData = startNode.data ?? {};
  const nextParameters = variableDefinitionsParse(currentData.crawlerParameters).map((item) => {
    if (!Object.hasOwn(parameters, item.id)) {
      return item;
    }

    return {
      ...item,
      defaultValue: parameters[item.id]
    };
  });

  startNode.data = {
    ...currentData,
    crawlerParameters: nextParameters
  };

  return nextFlow;
};
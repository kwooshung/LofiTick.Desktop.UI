import type { TVariableValueDataType } from '@/components/crawlers/nodes/variable/shared/index';

/**
 * 接口：爬虫蓝图执行参数弹窗属性。
 */
export interface ICrawlersExecutionParametersProps {
  /**
   * 属性：站点名称。
   */
  siteName?: string;

  /**
   * 属性：站点基础 URL。
   */
  baseUrl?: string;

  /**
   * 属性：蓝图图数据。
   */
  flowData: unknown;

  /**
   * 属性：提交按钮加载状态。
   */
  busy?: boolean;
}

/**
 * 接口：爬虫蓝图执行参数定义项。
 */
export interface ICrawlerBlueprintExecutionParameterItem {
  /**
   * 属性：参数唯一标识。
   */
  id: string;

  /**
   * 属性：参数名称。
   */
  name: string;

  /**
   * 属性：参数数据类型。
   */
  dataType: TVariableValueDataType;

  /**
   * 属性：参数默认值。
   */
  defaultValue: unknown;
}

/**
 * 接口：爬虫蓝图执行参数编辑项。
 */
export interface ICrawlerBlueprintExecutionParameterEditorItem extends ICrawlerBlueprintExecutionParameterItem {
  /**
   * 属性：本次执行值。
   */
  value: unknown;

  /**
   * 属性：数组或对象参数的 JSON 文本。
   */
  jsonText: string;

  /**
   * 属性：本地校验错误。
   */
  error: string;
}

/**
 * 接口：爬虫蓝图执行参数确认载荷。
 */
export interface ICrawlerBlueprintExecutionParametersSubmitPayload {
  /**
   * 属性：执行入口参数覆盖值。
   */
  parameters: Record<string, unknown>;

  /**
   * 属性：用于本次执行的蓝图图数据。
   */
  flowData: unknown;
}

/**
 * 接口：爬虫蓝图执行参数弹窗事件。
 */
export interface ICrawlersExecutionParametersEmits {
  /**
   * 事件：使用当前值执行。
   */
  execute: [payload: ICrawlerBlueprintExecutionParametersSubmitPayload];

  /**
   * 事件：保存当前值为默认值并执行。
   */
  saveDefaultAndExecute: [payload: ICrawlerBlueprintExecutionParametersSubmitPayload];
}

/**
 * 接口：最小蓝图图结构。
 */
export interface ICrawlerBlueprintFlowLike {
  /**
   * 属性：蓝图节点列表。
   */
  nodes?: ICrawlerBlueprintNodeLike[];

  /**
   * 属性：其它蓝图字段。
   */
  [key: string]: unknown;
}

/**
 * 接口：最小蓝图节点结构。
 */
export interface ICrawlerBlueprintNodeLike {
  /**
   * 属性：节点 ID。
   */
  id?: string;

  /**
   * 属性：节点类型。
   */
  type?: string;

  /**
   * 属性：节点数据。
   */
  data?: ICrawlerBlueprintStartNodeDataLike;

  /**
   * 属性：其它节点字段。
   */
  [key: string]: unknown;
}

/**
 * 接口：最小开始节点数据结构。
 */
export interface ICrawlerBlueprintStartNodeDataLike {
  /**
   * 属性：爬虫入口参数定义列表。
   */
  crawlerParameters?: unknown;

  /**
   * 属性：其它节点数据字段。
   */
  [key: string]: unknown;
}

/**
 * 类型：settings / unattended 展示模型契约。
 *
 * 该文件承载只服务于组件展示层的派生结构，
 * 例如日志拆片、结构化日志面板等视图模型。
 */

/**
 * 类型：无人值守-日志消息切片
 */
export type TPageSettingsUnattendedLogMessageSegment = {
  type: 'text' | 'datetime';
  value: string;
};

/**
 * 接口：无人值守-结构化日志字段
 */
export interface IPageSettingsUnattendedStructuredLogEntry {
  /**
   * 原始字段键名
   */
  key: string;

  /**
   * 展示标签
   */
  label: string;

  /**
   * 展示值
   */
  value: string;
}

/**
 * 接口：无人值守-结构化日志消息
 */
export interface IPageSettingsUnattendedStructuredLogMessage {
  /**
   * 顶部摘要
   */
  summary: string;

  /**
   * 顶层字段列表
   */
  topLevelEntries: IPageSettingsUnattendedStructuredLogEntry[];

  /**
   * 恢复动作字段列表
   */
  recoveryEntries: IPageSettingsUnattendedStructuredLogEntry[];
}
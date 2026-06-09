/**
 * 接口：爬虫蓝图节点壳数据。
 */
export interface ICrawlerBlueprintNodeShellData {
  /**
   * 属性：节点标题。
   */
  title: string;

  /**
   * 属性：节点副标题。
   */
  subtitle?: string;

  /**
   * 属性：节点角标。
   */
  badge?: string;

  /**
   * 属性：节点视觉风格。
   */
  tone: 'start' | 'end' | 'branch' | 'action';

  /**
   * 属性：执行输入口数量。
   */
  execInputs?: number;

  /**
   * 属性：执行输出口数量。
   */
  execOutputs?: number;

  /**
   * 属性：输出口标签。
   */
  outputLabels?: string[];
}
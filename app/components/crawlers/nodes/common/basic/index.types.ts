/**
 * 接口：基础节点属性。
 */
export interface ICrawlersNodesCommonBasicProps {
  /**
   * 属性：节点标题。
   */
  title: string;

  /**
   * 属性：标题文本类名（Tailwind class，可选）。
   */
  titleClass?: string;

  /**
   * 属性：标题栏图标名（Iconify）。
   */
  iconName?: string;

  /**
   * 属性：标题栏图标类名（Tailwind class，可选）。
   */
  iconClass?: string;

  /**
   * 属性：节点描述（可选）。
   */
  description?: string;

  /**
   * 属性：描述文本类名（Tailwind class，可选）。
   */
  descriptionClass?: string;

  /**
   * 属性：标题栏背景类名（Tailwind class，可选）。
   */
  headerBg?: string;

  /**
   * 属性：标题栏文字颜色类名（Tailwind class，可选）。
   */
  headerColor?: string;

  /**
   * 属性：是否显示执行输入引脚。
   */
  showExecIn?: boolean;

  /**
   * 属性：是否显示执行输出引脚。
   */
  showExecOut?: boolean;
}

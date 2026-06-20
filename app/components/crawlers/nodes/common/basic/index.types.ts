/**
 * 类型：侧边引脚方向。
 */
export type TBasicSidePinDirection = 'in' | 'out';

/**
 * 类型：侧边引脚数据类型。
 */
export type TBasicSidePinDataType = 'exec' | 'string' | 'number' | 'boolean' | 'array' | 'object' | 'any';

/**
 * 接口：侧边引脚配置。
 */
export interface IBasicSidePin {
  /**
   * 属性：引脚唯一标识。
   */
  id: string;

  /**
   * 属性：引脚标题。
   */
  label: string;

  /**
   * 属性：引脚方向。
   */
  direction: TBasicSidePinDirection;

  /**
   * 属性：引脚数据类型。
   */
  dataType: TBasicSidePinDataType;

  /**
   * 属性：垂直位置百分比。
   */
  topPercent?: number;

  /**
   * 属性：引脚补充描述。
   */
  description?: string;
}

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

  /**
   * 属性：左侧引脚列表。
   */
  leftPins?: IBasicSidePin[];

  /**
   * 属性：右侧引脚列表。
   */
  rightPins?: IBasicSidePin[];
}

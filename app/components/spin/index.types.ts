/**
 * 类型：Spinner 尺寸预设
 */
export type TSpinSizePreset = 'small' | 'default' | 'large';

/**
 * 接口：Spin 组件 Props
 */
export interface ISpinProps {
  /**
   * 属性：是否展示加载
   */
  loading?: boolean;

  /**
   * 属性：图标名称
   */
  icon?: string;

  /**
   * 属性：文案提示
   */
  tip?: string;

  /**
   * 属性：尺寸
   * 描述：预设或像素值
   */
  size?: TSpinSizePreset | number;

  /**
   * 属性：延迟显示
   * 描述：单位毫秒，用于避免闪烁
   */
  delay?: number;

  /**
   * 属性：指示器颜色
   */
  iconClass?: string;

  /**
   * 属性：遮罩背景色
   */
  maskClass?: string;
}

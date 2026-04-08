/**
 * 接口：SettingColors 按钮组件 Props
 */
export interface IButtonSettingColorsProps {
  /**
   * 属性：尺寸
   * 描述：按钮尺寸
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * 属性：图标
   * 描述：按钮图标名称
   */
  icon?: string;

  /**
   * 属性：按钮文字
   * 描述：按钮展示文本
   */
  label: string;

  /**
   * 属性：颜色
   * 描述：作为左侧小圆点的背景色（Tailwind 颜色名称，如 'red'、'blue'、'green'）
   */
  chip?: string;

  /**
   * 属性：是否选中
   * 描述：选中时展示不同样式
   */
  selected?: boolean;
}

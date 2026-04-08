/**
 * 接口：FolderIcon 组件 Props
 */
export interface IFolderIconProps {
  /**
   * 属性：文件夹背景色
   * 描述：Tailwind class，如 'bg-primary-500'
   */
  bgColor?: string;

  /**
   * 属性：文件夹前景色
   * 描述：Tailwind class，如 'bg-primary-400'
   */
  fgColor?: string;

  /**
   * 属性：图标名称
   * 描述：Iconify 图标名称
   */
  iconName?: string;
}

import type { ContextMenuItem, ContextMenuProps } from '@nuxt/ui';
import type { RouteLocationRaw } from 'vue-router';

/**
 * 类型：Folder 跳转目标
 * 描述：对标 `NuxtLink` 的 `to`
 */
export type TFolderTo = RouteLocationRaw;

/**
 * 接口：Folder 组件 Props
 */
export interface IFolderProps {
  /**
   * 属性：文件夹名称
   */
  label?: string;

  /**
   * 属性：跳转目标
   * 描述：存在时，左键单击将触发路由跳转
   */
  to?: TFolderTo;

  /**
   * 属性：默认名称
   * 描述：当未提供 name 时使用。若未提供，则从语言包读取。
   */
  defaultLabel?: string;

  /**
   * 属性：文件夹背景颜色
   * 描述：Tailwind 类，如 'bg-primary-500'
   */
  bgColor?: string;

  /**
   * 属性：文件夹前景颜色
   * 描述：Tailwind 类，如 'bg-primary-400'
   */
  fgColor?: string;

  /**
   * 属性：图标名称
   */
  iconName?: string;

  /**
   * 属性：是否选中
   * 描述：受控值，未传则内部维护
   */
  selected?: boolean;

  /**
   * 属性：是否可选中
   */
  selectable?: boolean;

  /**
   * 属性：点击外部取消选中
   */
  unselectOnOutside?: boolean;

  /**
   * 属性：双击间隔
   * 描述：单位毫秒
   */
  dblclickDelay?: number;

  /**
   * 属性：点击移动容差像素
   * 描述：用于拖拽判定
   */
  clickMoveTolerance?: number;

  /**
   * 属性：是否允许重命名
   * 描述：F2 也依赖此开关
   */
  relabel?: boolean;

  /**
   * 属性：第二次点击进入重命名
   * 描述：Windows 风格
   */
  relabelOnSecondClick?: boolean;

  /**
   * 属性：重命名触发延迟
   * 描述：单位毫秒
   */
  relabelDelay?: number;

  /**
   * 属性：仅点击名称触发重命名
   * 描述：避免点图标也进入重命名
   */
  relabelOnly?: boolean;

  /**
   * 属性：右键菜单属性
   * 描述：透传给 UContextMenu
   */
  contextMenuProps?: ContextMenuProps;

  /**
   * 属性：是否禁用
   */
  disabled?: boolean;

  /**
   * 属性：是否强制显示指针光标
   * 描述：用于非跳转场景也保留可点击语义
   */
  cursorPointer?: boolean;
}

/**
 * 接口：Folder 组件事件
 */
export interface IFolderEmits {
  /**
   * 事件：双击
   * @param {MouseEvent} ev 鼠标事件
   */
  dblclick: [ev: MouseEvent];

  /**
   * 事件：右键菜单选中事件
   * @param {ContextMenuItem} item 选中的菜单项
   */
  'menu-select': [item: ContextMenuItem];

  /**
   * 事件：重命名开始
   */
  'relabel-start': [];

  /**
   * 事件：重命名取消
   */
  'relabel-cancel': [];

  /**
   * 事件：选中状态更新（受控模式时需监听）
   * @param {boolean} v 新选中状态
   */
  'update:selected': [v: boolean];

  /**
   * 事件：重命名完成或名称更新（受控模式时需监听）
   * @param {string} label 新名称
   */
  'relabel-done': [label: string];

  /**
   * 事件：名称更新（受控模式时需监听）
   * @param {string} label 新名称
   */
  'update:label': [label: string];
}

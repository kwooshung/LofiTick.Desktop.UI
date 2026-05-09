/**
 * 类型：DashboardPage 排列方向
 * - horizontal 水平
 * - vertical 垂直
 */
export type TDashboardPageDirection = 'horizontal' | 'vertical';

/**
 * 接口：DashboardPage 组件 Props
 */
export interface IDashboardPageProps {
  /**
   * 属性：排列方向
   */
  direction?: TDashboardPageDirection;

  /**
   * 属性：是否有内边距
   */
  padded?: boolean;
}

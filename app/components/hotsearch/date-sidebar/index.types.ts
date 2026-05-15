import type { IHotsearchArchiveDateSummary } from '@@/shared/types/index.types';

/**
 * 接口：热搜日期侧栏属性。
 */
export interface IHotsearchDateSidebarProps {
  /** 日期摘要列表 */
  summaries: IHotsearchArchiveDateSummary[];

  /** 当前选中日期 */
  selectedDate: string;
}

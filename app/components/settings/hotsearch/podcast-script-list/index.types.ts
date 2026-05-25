import type { ISettingsHotsearchPodcastTemplateItem } from '@@/shared/types/index.types';

/**
 * 类型：热搜播客文案列表属性。
 */
export interface ISettingsHotsearchPodcastScriptListProps {
  /**
   * 是否禁用交互。
   */
  disabled?: boolean;

  /**
   * 播客模板片段列表。
   */
  templateItems: ISettingsHotsearchPodcastTemplateItem[];
}

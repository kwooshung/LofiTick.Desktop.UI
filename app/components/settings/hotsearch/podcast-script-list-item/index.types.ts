import type { THotsearchPodcastSegmentType, THotsearchPodcastVoiceKey } from '@@/shared/types/index.types';

/**
 * 类型：播客脚本编辑器模式。
 */
export type TPodcastScriptEditorMode = 'body' | 'template' | 'advertisement';

/**
 * 接口：播客脚本列表可编辑片段。
 */
export interface ISettingsHotsearchPodcastScriptListEditableItem {
  /**
   * 播报角色。
   */
  voiceKey: THotsearchPodcastVoiceKey;

  /**
   * 文本内容。
   */
  content: string;

  /**
   * 片段类型。
   */
  segmentType: THotsearchPodcastSegmentType;
}

/**
 * 接口：播客脚本列表选项。
 */
export interface ISettingsHotsearchPodcastScriptListOption<TValue extends string> {
  /**
   * 选项值。
   */
  value: TValue;

  /**
   * 选项标签。
   */
  label: string;
}

/**
 * 接口：播客脚本列表行属性。
 */
export interface ISettingsHotsearchPodcastScriptListItemProps {
  /**
   * 当前片段。
   */
  item: ISettingsHotsearchPodcastScriptListEditableItem;

  /**
   * 是否禁用交互。
   */
  disabled?: boolean;

  /**
   * 是否显示拖拽手柄。
   */
  showHandle?: boolean;

  /**
   * 是否显示删除按钮。
   */
  showRemove?: boolean;

  /**
   * 文本占位。
   */
  placeholder: string;

  /**
   * 广告正文占位。
   */
  adContentPlaceholder?: string;

  /**
   * 开发者指定的编辑器模式。
   */
  editorMode: TPodcastScriptEditorMode;

  /**
   * 角色选项。
   */
  voiceOptions: Array<ISettingsHotsearchPodcastScriptListOption<THotsearchPodcastVoiceKey>>;

  /**
   * 片段类型选项。
   */
  segmentOptions: Array<ISettingsHotsearchPodcastScriptListOption<THotsearchPodcastSegmentType>>;
}

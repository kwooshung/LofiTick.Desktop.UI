import type { THotsearchPodcastHeadMusicKind } from '@@/shared/types/index.types';

/**
 * 接口：热搜开头音乐条目。
 */
export interface ISettingsHotsearchHeadMusicItem {
  /**
   * 音乐类型。
   */
  kind: THotsearchPodcastHeadMusicKind;

  /**
   * 标题。
   */
  title: string;

  /**
   * 描述。
   */
  description: string;

  /**
   * 固定落盘路径。
   */
  path: string;

  /**
   * 本地是否存在。
   */
  localExists: boolean;

  /**
   * 云端是否存在。
   */
  remoteExists: boolean;

  /**
   * 预览地址。
   */
  previewUrl?: string;

  /**
   * 当前是否正在上传。
   */
  uploadLoading: boolean;

  /**
   * 当前上传进度。
   */
  uploadProgress: number;
}

/**
 * 接口：热搜开头音乐组件属性。
 */
export interface ISettingsHotsearchHeadMusicProps {
  /**
   * 是否禁用。
   */
  disabled?: boolean;

  /**
   * 是否已配置附件目录。
   */
  attachmentsDirConfigured: boolean;

  /**
   * 本机播客生成是否启用。
   */
  generateEnabled: boolean;

  /**
   * 本机播客生成开关是否处理中。
   */
  generateLoading: boolean;

  /**
   * 本机播客生成开关是否禁用。
   */
  generateDisabled?: boolean;

  /**
   * 当前是否已有占用机器。
   */
  generateOwnerExists: boolean;

  /**
   * 当前占用是否为本机。
   */
  generateOwnedByCurrentMachine: boolean;

  /**
   * 占用描述。
   */
  generateOwnerDescription: string;

  /**
   * 开头音乐条目。
   */
  items: ISettingsHotsearchHeadMusicItem[];

  /**
   * 上传请求。
   */
  uploadRequest: (kind: THotsearchPodcastHeadMusicKind, file: File) => Promise<void>;
}

/**
 * 接口：热搜开头音乐组件事件。
 */
export interface ISettingsHotsearchHeadMusicEmits {
  /**
   * 事件：本机播客生成开关更新。
   */
  'update:generate-enabled': [value: boolean];
}

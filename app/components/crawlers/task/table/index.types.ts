import type { BadgeProps } from '@nuxt/ui';

/**
 * 类型：爬虫任务媒体类型。
 */
export type TCrawlerTaskMediaKind = 'image' | 'audio' | 'video' | 'document' | 'archive' | 'model' | 'folder' | 'unknown';

/**
 * 类型：爬虫任务预览形态。
 */
export type TCrawlerTaskPreviewKind = 'thumbnail' | 'icon' | 'placeholder';

/**
 * 类型：爬虫任务运行状态。
 */
export type TCrawlerTaskStatus = 'pending' | 'resolving' | 'crawling' | 'downloading' | 'paused' | 'completed' | 'failed' | 'stopped';

/**
 * 类型：爬虫任务状态颜色。
 */
export type TCrawlerTaskStatusColor = BadgeProps['color'];

/**
 * 接口：爬虫任务预览信息。
 */
export interface ICrawlerTaskPreview {
  /**
   * 属性：媒体类型。
   */
  mediaKind: TCrawlerTaskMediaKind;

  /**
   * 属性：预览形态。
   */
  kind: TCrawlerTaskPreviewKind;

  /**
   * 属性：缩略图或封面地址。
   */
  imageUrl?: string;

  /**
   * 属性：图标名称。
   */
  iconName?: string;

  /**
   * 属性：替代文案。
   */
  alt: string;
}

/**
 * 接口：爬虫任务进度信息。
 */
export interface ICrawlerTaskProgress {
  /**
   * 属性：进度百分比；无法确定时为空。
   */
  value: number | null;

  /**
   * 属性：是否为不确定进度。
   */
  indeterminate: boolean;
}

/**
 * 接口：爬虫任务行。
 */
export interface ICrawlerTaskRow {
  /**
   * 属性：任务编号。
   */
  id: string;

  /**
   * 属性：任务标题。
   */
  title: string;

  /**
   * 属性：来源站点或任务类型。
   */
  source: string;

  /**
   * 属性：任务目标地址或关键词。
   */
  target: string;

  /**
   * 属性：任务状态。
   */
  status: TCrawlerTaskStatus;

  /**
   * 属性：任务进度。
   */
  progress: ICrawlerTaskProgress;

  /**
   * 属性：媒体预览。
   */
  preview: ICrawlerTaskPreview;

  /**
   * 属性：当前速率。
   */
  speed: string;

  /**
   * 属性：文件总大小。
   */
  size: string;

  /**
   * 属性：已下载大小。
   */
  downloaded: string;

  /**
   * 属性：已用时间。
   */
  elapsed: string;

  /**
   * 属性：剩余时间。
   */
  remaining: string;

  /**
   * 属性：条目进度。
   */
  items: string;

  /**
   * 属性：最近更新时间。
   */
  updatedAt: string;
}

/**
 * 接口：爬虫任务表属性。
 */
export interface ICrawlerTaskTableProps {
  /**
   * 属性：任务列表数据。
   */
  rows: ICrawlerTaskRow[];
}

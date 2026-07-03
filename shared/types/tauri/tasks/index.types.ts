/**
 * 接口：热搜窗口计划条目
 */
export interface ITauriHotsearchScheduleWindow {
  /**
   * 窗口标识
   */
  key: string;

  /**
   * 开始时间
   */
  startAt: string;

  /**
   * 最早开始时间
   */
  earliestStartAt: string;

  /**
   * 最晚开始时间
   */
  latestStartAt: string;

  /**
   * 结束时间
   */
  endAt: string;

  /**
   * 建议播客时间
   */
  suggestedPodcastAt: string;

  /**
   * 最早建议播客时间
   */
  earliestSuggestedPodcastAt: string;

  /**
   * 最晚建议播客时间
   */
  latestSuggestedPodcastAt: string;

  /**
   * 平台数量
   */
  platformCount: number;

  /**
   * 窗口耗时（分钟）
   */
  windowDurationMinutes: number;

  /**
   * 预计积分
   */
  estimatedPoints: number;
}

/**
 * 接口：热搜计划快照
 */
export interface ITauriHotsearchScheduleSnapshot {
  /**
   * 是否启用自动抓取
   */
  enabled: boolean;

  /**
   * 是否启用自动播客
   */
  podcastEnabled: boolean;

  /**
   * 月度预算积分
   */
  monthlyBudget: number;

  /**
   * 已选平台数量
   */
  selectedPlatformCount: number;

  /**
   * 平台抓取间隔（秒）
   */
  platformIntervalSeconds: number;

  /**
   * 计划随机偏移范围（秒）
   */
  scheduleJitterSeconds: number;

  /**
   * 播客缓冲时间（秒）
   */
  podcastBufferSeconds: number;

  /**
   * 最大重试次数
   */
  retryMaxAttempts: number;

  /**
   * 重试间隔（秒）
   */
  retryDelaySeconds: number;

  /**
   * 早晚窗口计划
   */
  windows: ITauriHotsearchScheduleWindow[];
}

/**
 * 接口：爬虫浏览器候选。
 */
export interface ICrawlerBrowserCandidate {
  /**
   * 浏览器稳定标识。
   */
  id: string;

  /**
   * 浏览器展示名称。
   */
  name: string;

  /**
   * 图标类名。
   */
  icon: string;

  /**
   * Playwright channel 名称。
   */
  channel: string;

  /**
   * 可执行文件路径。
   */
  executablePath?: string | null;

  /**
   * 当前系统是否支持。
   */
  supported: boolean;

  /**
   * 当前系统是否已安装。
   */
  installed: boolean;

  /**
   * 是否为推荐默认项。
   */
  recommended: boolean;

  /**
   * 安装入口 URL。
   */
  installUrl: string;

  /**
   * 检测来源。
   */
  source: string;

  /**
   * 状态说明。
   */
  reason: string;
}

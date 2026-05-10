/**
 * 接口：1Panel 设置。
 */
export interface IPageSettingsOnepanelSettings {
  /**
   * 1Panel 基础域名。
   */
  apiBase: string;

  /**
   * 1Panel API Key。
   */
  apiKey: string;
}

/**
 * 接口：cron 任务。
 */
export interface IPageSettingsCronjobInfo {
  /**
   * 任务 ID。
   */
  id: number;

  /**
   * 任务名称。
   */
  name: string;

  /**
   * 任务类型。
   */
  cronType: string;

  /**
   * 任务状态。
   */
  status: string;

  /**
   * 调度表达式。
   */
  spec: string;

  /**
   * URL 目标。
   */
  url: string;

  /**
   * 执行器。
   */
  executor: string;

  /**
   * 脚本内容。
   */
  script: string;

  /**
   * 是否正在执行。
   */
  isExecuting: boolean;

  /**
   * 创建时间。
   */
  createdAt?: string | null;
}

/**
 * 接口：cron 分页结果。
 */
export interface IPageSettingsCronjobPage {
  /**
   * 列表项。
   */
  items: IPageSettingsCronjobInfo[];

  /**
   * 总数。
   */
  total: number;
}

/**
 * 接口：cron 执行记录。
 */
export interface IPageSettingsCronjobRecord {
  /**
   * 记录 ID。
   */
  id: number;

  /**
   * 执行任务 ID。
   */
  taskId: string;

  /**
   * 开始时间。
   */
  startTime: string;

  /**
   * 状态。
   */
  status: string;

  /**
   * 摘要消息。
   */
  message: string;

  /**
   * 日志文件。
   */
  file: string;

  /**
   * 耗时（毫秒）。
   */
  interval: number;
}

/**
 * 接口：cron 执行记录分页结果。
 */
export interface IPageSettingsCronjobRecordPage {
  /**
   * 列表项。
   */
  items: IPageSettingsCronjobRecord[];

  /**
   * 总数。
   */
  total: number;
}

/**
 * 接口：cron 记录日志。
 */
export interface IPageSettingsCronjobRecordLog {
  /**
   * 日志内容。
   */
  content: string;
}

/**
 * 接口：热搜 cron 同步状态。
 */
export interface IPageSettingsHotsearchCronStatus {
  /**
   * 是否已完成 1Panel 配置。
   */
  configured: boolean;

  /**
   * 热搜是否启用。
   */
  hotsearchEnabled: boolean;

  /**
   * 预期任务名称。
   */
  expectedName: string;

  /**
   * 回调地址。
   */
  callbackUrl?: string | null;

  /**
   * 当前任务。
   */
  cronjob?: IPageSettingsCronjobInfo | null;

  /**
   * 是否已同步。
   */
  synchronized: boolean;

  /**
   * 附加消息。
   */
  message?: string | null;
}

/**
 * 类型：本地任务徽标颜色。
 */
export type TPageSettingsLocalCronBadgeColor = 'primary' | 'success' | 'neutral' | 'warning' | 'error';

/**
 * 接口：本地任务徽标。
 */
export interface IPageSettingsLocalCronBadge {
  /**
   * 徽标颜色。
   */
  color: TPageSettingsLocalCronBadgeColor;

  /**
   * 徽标文案。
   */
  label: string;
}

/**
 * 接口：本地任务表格行。
 */
export interface IPageSettingsLocalCronRow {
  /**
   * 行标识。
   */
  key: string;

  /**
   * 任务标题。
   */
  title: string;

  /**
   * 任务描述。
   */
  description: string;

  /**
   * 计划主文案。
   */
  schedulePrimary: string;

  /**
   * 计划补充文案。
   */
  scheduleSecondary?: string | null;

  /**
   * 主状态文案。
   */
  statusLabel: string;

  /**
   * 主状态颜色。
   */
  statusColor: TPageSettingsLocalCronBadgeColor;

  /**
   * 附加徽标。
   */
  badges: IPageSettingsLocalCronBadge[];
}

/**
 * 接口：系统任务表格行。
 */
export interface IPageSettingsSystemCronRow {
  /**
   * 行标识。
   */
  key: string;

  /**
   * 任务标题。
   */
  title: string;

  /**
   * 任务描述。
   */
  description: string;

  /**
   * 计划主文案。
   */
  schedulePrimary: string;

  /**
   * 计划补充文案。
   */
  scheduleSecondary?: string | null;

  /**
   * 分组文案。
   */
  groupLabel: string;
}

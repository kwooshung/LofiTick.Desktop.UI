/**
 * 接口：服务连接设置。
 */
export interface IPageSettingsConnectionsSettings {
  /**
   * Rust API 根地址。
   */
  apiBase: string;

  /**
   * 1Panel 面板根域名。
   */
  panelBase: string;
}

/**
 * 接口：1Panel 设置。
 */
export interface IPageSettingsOnepanelSettings {
  /**
   * 1Panel 面板根域名。
   */
  panelBase: string;
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

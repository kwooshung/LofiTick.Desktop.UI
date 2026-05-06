/**
 * 类型：邮件主题类型
 */
export type TEmailType = 'primary' | 'info' | 'success' | 'warning' | 'error';

/**
 * 接口：邮件布局组件属性
 */
export interface IEmailLayoutProps {
  /**
   * 属性：主题类型
   */
  type: TEmailType;

  /**
   * 属性：官网地址
   */
  officialSite: string;

  /**
   * 属性：预览文本
   */
  previewText: string;

  /**
   * 属性：英文名称
   */
  nameEn: string;

  /**
   * 属性：中文名称
   */
  nameCn: string;

  /**
   * 属性：标题
   */
  title: string;
}

/**
 * 接口：欢迎邮件 QQ 群信息
 */
export interface IEmailWelcomeQqGroup {
  /**
   * 属性：群号
   */
  number: string;

  /**
   * 属性：链接
   */
  url: string;

  /**
   * 属性：人数上限
   */
  size: number;

  /**
   * 属性：是否满员
   */
  full: boolean;
}

/**
 * 接口：欢迎邮件 QQ 社交信息
 */
export interface IEmailWelcomeSocialsQq {
  /**
   * 属性：群列表
   */
  groups: IEmailWelcomeQqGroup[];
}

/**
 * 接口：欢迎邮件社交信息
 */
export interface IEmailWelcomeSocials {
  /**
   * 属性：QQ
   */
  qq: IEmailWelcomeSocialsQq;
}

/**
 * 接口：欢迎邮件组件属性
 */
export interface IEmailWelcomeProps {
  /**
   * 属性：主题类型
   */
  type?: TEmailType;

  /**
   * 属性：官网地址
   */
  officialSite: string;

  /**
   * 属性：预览文本
   */
  previewText?: string;

  /**
   * 属性：英文名称
   */
  nameEn: string;

  /**
   * 属性：中文名称
   */
  nameCn: string;

  /**
   * 属性：标题
   */
  title: string;

  /**
   * 属性：用户名
   */
  username: string;

  /**
   * 属性：社交信息
   */
  socials: IEmailWelcomeSocials;
}
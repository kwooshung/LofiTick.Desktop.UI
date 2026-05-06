import { emails as enEmails } from '@@/i18n/locales/en/emails';
import { emails as jaEmails } from '@@/i18n/locales/ja/emails';
import { emails as zhCnEmails } from '@@/i18n/locales/zh-cn/emails';
import { emails as zhTwEmails } from '@@/i18n/locales/zh-tw/emails';

import type { IEmailWelcomeSocials, IEmailWelcomeQqGroup } from '@@/app/emails/index.types';

/**
 * 常量：英文站点名
 */
const SITE_NAME_EN = 'LofiTick';

/**
 * 常量：中文站点名
 */
const SITE_NAME_CN = '韶光洛菲';

/**
 * 常量：站点地址
 */
const SITE_URL = 'https://desktop.ui.lofitick.com/';

/**
 * 常量：默认收件人
 */
const DEFAULT_TO = ['kwooshung@qq.com'];

/**
 * 常量：欢迎邮件中的测试 QQ 群
 */
const WELCOME_QQ_GROUPS: IEmailWelcomeQqGroup[] = [
  {
    number: '123456789',
    url: 'https://qm.qq.com/',
    size: 500,
    full: false
  }
];

/**
 * 接口：欢迎邮件生成结果
 */
export interface IWelcomeEmailBuildResult {
  /**
   * 属性：主题
   */
  subject: string;

  /**
   * 属性：纯文本内容
   */
  text: string;

  /**
   * 属性：HTML 内容
   */
  html: string;

  /**
   * 属性：收件人列表
   */
  to: string[];
}

/**
 * 类型：邮件文案集合
 */
type TEmailsMessages = typeof zhCnEmails;

/**
 * 函数：格式化文案占位符
 * @param {string} template 模板字符串
 * @param {Record<string, string>} params 占位符参数
 * @returns {string} 格式化后的字符串
 */
const formatEmailString = (template: string, params: Record<string, string>): string => template.replace(/\{(\w+)\}/g, (_, key) => params[key] ?? '');

/**
 * 函数：扁平化邮件文案
 * @param {TEmailsMessages} messages 文案集合
 * @returns {Record<string, string>} 扁平化结果
 */
const flattenEmailsMessages = (messages: TEmailsMessages): Record<string, string> => {
  const result: Record<string, string> = {};

  const walk = (value: unknown, path: string[]) => {
    if (typeof value === 'string') {
      result[path.join('.')] = value;
      return;
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      for (const [childKey, childValue] of Object.entries(value)) {
        walk(childValue, [...path, childKey]);
      }
    }
  };

  walk(messages, ['emails']);

  return result;
};

/**
 * 函数：把邮件 HTML 中的文案键替换为当前语言内容
 * @param {string} html 原始 HTML
 * @param {TEmailsMessages} messages 文案集合
 * @param {Record<string, string>} params 占位符参数
 * @returns {string} 替换后的 HTML
 */
const applyEmailsLocaleToHtml = (html: string, messages: TEmailsMessages, params: Record<string, string>): string => {
  const flat = flattenEmailsMessages(messages);
  let output = html;

  const entries = Object.entries(flat).sort((a, b) => b[0].length - a[0].length);

  for (const [key, template] of entries) {
    const value = formatEmailString(template, params);
    if (!value) {
      continue;
    }

    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    output = output.replace(new RegExp(escapedKey, 'g'), value);
  }

  return output;
};

/**
 * 函数：获取当前语言对应的邮件文案
 * @param {string} locale 语言代码
 * @returns {TEmailsMessages} 邮件文案
 */
const getEmailsLocale = (locale: string): TEmailsMessages => {
  switch (String(locale).trim().toLowerCase()) {
    case 'zh_tw':
    case 'zh-tw':
      return zhTwEmails;
    case 'ja':
      return jaEmails;
    case 'en':
      return enEmails;
    case 'zh_cn':
    case 'zh-cn':
    default:
      return zhCnEmails;
  }
};

/**
 * 函数：构建欢迎邮件社交信息
 * @returns {IEmailWelcomeSocials} 社交信息
 */
const buildWelcomeSocials = (): IEmailWelcomeSocials => ({
  qq: {
    groups: WELCOME_QQ_GROUPS
  }
});

/**
 * 函数：生成欢迎邮件
 * @param {string} locale 语言代码
 * @returns {Promise<IWelcomeEmailBuildResult>} 生成结果
 */
export const welcomeEmailBuild = async (locale: string): Promise<IWelcomeEmailBuildResult> => {
  const messages = getEmailsLocale(locale);
  const socials = buildWelcomeSocials();
  const params = {
    nameEn: SITE_NAME_EN,
    nameCn: SITE_NAME_CN,
    username: 'KwooShung'
  };

  const subject = formatEmailString(messages.welcome.title, params);
  const text = formatEmailString(messages.welcome.text, params);
  const rawHtml = await renderEmailComponent(
    'welcome',
    {
      type: 'primary',
      officialSite: SITE_URL,
      nameEn: SITE_NAME_EN,
      nameCn: SITE_NAME_CN,
      title: subject,
      username: params.username,
      socials
    },
    {
      pretty: true
    }
  );

  return {
    subject,
    text,
    html: applyEmailsLocaleToHtml(rawHtml, messages, params),
    to: DEFAULT_TO
  };
};
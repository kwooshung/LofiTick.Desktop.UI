import { actions } from '@@/i18n/locales/zh-tw/common/actions';
import { content } from '@@/i18n/locales/zh-tw/common/content';
import { dialogs } from '@@/i18n/locales/zh-tw/common/dialogs';
import { labels } from '@@/i18n/locales/zh-tw/common/labels';
import { site } from '@@/i18n/locales/zh-tw/common/site';

export const common = {
  actions,
  content,
  dialogs,
  datetimes: {
    updatedAt: '更新時間',
    createdAt: '建立時間'
  },
  labels,
  site,
  toasts: {
    startupSyncFailed: {
      title: '開機自啟同步失敗',
      description: '設定已保存，但同步系統開機自啟失敗：{message}'
    }
  }
};

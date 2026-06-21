import { actions } from '@@/i18n/locales/zh-cn/common/actions';
import { content } from '@@/i18n/locales/zh-cn/common/content';
import { dialogs } from '@@/i18n/locales/zh-cn/common/dialogs';
import { labels } from '@@/i18n/locales/zh-cn/common/labels';
import { site } from '@@/i18n/locales/zh-cn/common/site';

export const common = {
  actions,
  content,
  dialogs,
  datetimes: {
    updatedAt: '更新时间',
    createdAt: '创建时间'
  },
  labels,
  site,
  toasts: {
    startupSyncFailed: {
      title: '开机自启同步失败',
      description: '设置已保存，但同步系统开机自启失败：{message}'
    }
  }
};

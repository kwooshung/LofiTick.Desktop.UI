import { actions } from '@@/i18n/locales/ja/common/actions';
import { content } from '@@/i18n/locales/ja/common/content';
import { dialogs } from '@@/i18n/locales/ja/common/dialogs';
import { labels } from '@@/i18n/locales/ja/common/labels';
import { site } from '@@/i18n/locales/ja/common/site';

export const common = {
  actions,
  content,
  dialogs,
  datetimes: {
    updatedAt: '更新日時',
    createdAt: '作成日時'
  },
  labels,
  site,
  toasts: {
    startupSyncFailed: {
      title: '自動起動の同期に失敗しました',
      description: '設定は保存されましたが、システムの自動起動設定の同期に失敗しました：{message}'
    }
  }
};

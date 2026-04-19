import { actions } from './actions';
import { content } from './content';
import { dialogs } from './dialogs';
import { labels } from './labels';
import { site } from './site';

export const common = {
  actions,
  content,
  dialogs,
  labels,
  site,
  toasts: {
    startupSyncFailed: {
      title: '自動起動の同期に失敗しました',
      description: '設定は保存されましたが、システムの自動起動設定の同期に失敗しました：{message}'
    }
  }
};

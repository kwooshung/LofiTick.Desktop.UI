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
      title: '開機自啟同步失敗',
      description: '設定已保存，但同步系統開機自啟失敗：{message}'
    }
  }
};

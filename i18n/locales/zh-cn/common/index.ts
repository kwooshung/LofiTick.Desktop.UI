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
      title: '开机自启同步失败',
      description: '设置已保存，但同步系统开机自启失败：{message}'
    }
  }
};

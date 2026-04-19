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
      title: 'Autostart sync failed',
      description: 'Settings saved, but failed to sync autostart with the system: {message}'
    }
  }
};

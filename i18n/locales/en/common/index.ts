import { actions } from '@@/i18n/locales/en/common/actions';
import { content } from '@@/i18n/locales/en/common/content';
import { dialogs } from '@@/i18n/locales/en/common/dialogs';
import { labels } from '@@/i18n/locales/en/common/labels';
import { site } from '@@/i18n/locales/en/common/site';

export const common = {
  actions,
  content,
  dialogs,
  datetimes: {
    updatedAt: 'Updated at',
    createdAt: 'Created at'
  },
  labels,
  site,
  toasts: {
    startupSyncFailed: {
      title: 'Autostart sync failed',
      description: 'Settings saved, but failed to sync autostart with the system: {message}'
    }
  }
};

import type { ContextMenuItem } from '@nuxt/ui';

import type { IBuildCrawlerTargetContextMenuItemsOptions } from '@/composables/hooks/useCrawlerTargetActions/index.types';

/**
 * Hook：爬虫站点动作。
 *
 * 统一承载站点卡片与详情页共用的右键菜单动作与复制逻辑。
 *
 * # Returns
 *
 * 返回站点动作构建器与通用辅助函数。
 */
export const useCrawlerTargetMenuActions = () => {
  /**
   * Hook：国际化。
   */
  const { t } = useI18n();

  /**
   * 函数：复制文本到剪贴板。
   *
   * # Arguments
   *
   * * `text` - 待复制文本。
   *
   * # Returns
   *
   * 成功返回 `true`，失败返回 `false`。
   */
  const copyToClipboard = async (text: string): Promise<boolean> => {
    if (!import.meta.client) {
      return false;
    }

    /**
     * 函数：normalized。
     */
    const normalized = String(text ?? '').trim();
    if (normalized === '') {
      return false;
    }

    if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
      return false;
    }

    try {
      await navigator.clipboard.writeText(normalized);
      return true;
    } catch {
      return false;
    }
  };

  /**
   * 函数：构建站点右键菜单。
   *
   * # Arguments
   *
   * * `row` - 站点行数据。
   * * `options` - 菜单动作回调。
   *
   * # Returns
   *
   * 右键菜单分组。
   */
  const buildCrawlerTargetContextMenuItems = (row: IQueryResultCrawlerTargetRow, options: IBuildCrawlerTargetContextMenuItemsOptions = {}): ContextMenuItem[][] => {
    /**
     * 常量：domain。
     */
    const domain = String(row.domain ?? '').trim();
    /**
     * 常量：baseUrl。
     */
    const baseUrl = String(row.baseUrl ?? '').trim();

    const groups: ContextMenuItem[][] = [];

    if (options.showOpen !== false && options.onOpen) {
      groups.push([
        {
          label: t('pages.crawlers.targets.menu.open'),
          icon: 'i-lucide:globe',
          onSelect: () => options.onOpen?.()
        }
      ]);
    }

    groups.push([
      {
        label: t('pages.crawlers.targets.edit'),
        icon: 'i-lucide:edit',
        onSelect: () => options.onEdit?.()
      },
      {
        label: t('pages.crawlers.targets.addTask'),
        icon: 'i-lucide:plus',
        onSelect: () => options.onAddTask?.()
      }
    ]);

    groups.push([
      {
        label: t('pages.crawlers.targets.menu.copyDomain'),
        icon: 'i-lucide:copy',
        onSelect: () => void copyToClipboard(domain)
      },
      {
        label: t('pages.crawlers.targets.menu.copyBaseUrl'),
        icon: 'i-lucide:copy',
        disabled: baseUrl === '',
        onSelect: () => void copyToClipboard(baseUrl)
      }
    ]);

    return groups;
  };

  return {
    copyToClipboard,
    buildCrawlerTargetContextMenuItems
  };
};

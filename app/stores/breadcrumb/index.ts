import type { BreadcrumbItem } from '@nuxt/ui';

/**
 * Store：面包屑导航
 */
export const useStoreBreadcrumb = defineStore('breadcrumb', () => {
  /**
   * 状态：面包屑 items（直接透传给 `UBreadcrumb` 的 items）
   */
  const states = ref<BreadcrumbItem[]>([]);

  return { states };
});

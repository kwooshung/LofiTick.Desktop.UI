<template>
  <USelect v-model="computedFull" :items="computedItems" :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }" :placeholder="t('components.selects.full.placeholder')" class="min-w-28" />
</template>

<script setup lang="ts">
/**
 * Hook：国际化
 */
const { t } = useI18n();

/**
 * Hook：路由
 */
const route = useRoute();

/**
 * 计算属性：下拉项：使用语言包
 */
const computedItems = computed(() => [
  { label: t('components.selects.full.items.all'), value: 'all' },
  { label: t('components.selects.full.items.full'), value: 'full' },
  { label: t('components.selects.full.items.not_full'), value: 'not_full' }
]);

/**
 * 计算属性：满员筛选（与路由同步）
 */
const computedFull = computed({
  /**
   * Getter：从路由查询参数映射到选择值
   */
  get: () => {
    if (route.query.full === '1') {
      return 'full';
    }
    if (route.query.full === '0') {
      return 'not_full';
    }
    return 'all';
  },
  /**
   * Setter：从选择值回写到路由查询参数
   * @param {string} value 选择值
   */
  set: (value: string) => {
    /**
     * 常量：query。
     */
    const query = { ...route.query };

    if (value === 'full') {
      query.full = '1';
    } else if (value === 'not_full') {
      query.full = '0';
    } else {
      delete query.full;
    }

    navigateTo({ path: route.path, query });
  }
});
</script>

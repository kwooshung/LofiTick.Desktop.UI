<template>
  <USelect v-model="computedEnabled" :items="computedItems" :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }" :placeholder="t('components.selects.enabled.placeholder')" class="min-w-28" />
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
  { label: t('components.selects.enabled.items.all'), value: 'all' },
  { label: t('components.selects.enabled.items.enabled'), value: 'enabled' },
  { label: t('components.selects.enabled.items.disabled'), value: 'disabled' }
]);

/**
 * 计算属性：启用状态（与路由同步）
 */
const computedEnabled = computed({
  /**
   * Getter：从路由查询参数映射到选择值
   */
  get: () => {
    if (route.query.enabled === '1') {
      return 'enabled';
    }
    if (route.query.enabled === '0') {
      return 'disabled';
    }
    return 'all';
  },
  /**
   * Setter：从选择值回写到路由查询参数
   * @param {string} value 选择值
   */
  set: (value: string) => {
    const query = { ...route.query };

    if (value === 'enabled') {
      query.enabled = '1';
    } else if (value === 'disabled') {
      query.enabled = '0';
    } else {
      delete query.enabled;
    }

    navigateTo({ path: route.path, query });
  }
});
</script>

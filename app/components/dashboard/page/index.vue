<template>
  <div ref="refDashboardPanelScroll" class="scrollbar flex flex-1 overflow-x-hidden" :class="[direction === 'horizontal' ? 'flex-row flex-wrap content-start justify-start' : 'flex-col', padded ? 'p-4 sm:gap-6 sm:p-6' : '']">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { IDashboardPageProps } from '@/components/dashboard/page/index.types';

/**
 * 属性
 */
/**
 * Props：组件入参。
 */
const { direction = 'vertical', padded = true } = defineProps<IDashboardPageProps>();

/**
 * Hook：路由
 */
const route = useRoute();

/**
 * 引用：仪表板面板组件
 */
const stateRefDashboardPanelScroll = ref<HTMLElement | null>(null);

/**
 * 监听：路由查询参数变化，滚动到顶部
 */
watch(
  () => route.query,
  () => {
    stateRefDashboardPanelScroll.value?.scrollTo({ top: 0 });
  }
);
</script>

<template>
  <USelect v-model="pagesize" :items="computedItems" :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }" :placeholder="t('components.selects.pagesizes.placeholder')" class="min-w-28" />
</template>

<script setup lang="ts">
import type { ISelectPagesizesProps } from './index.types';

/**
 * Hook：国际化
 */
const { t } = useI18n();

/**
 * Hook：路由
 */
const route = useRoute();

/**
 * 属性：缓存键（命名空间），默认 'common'
 */
const props = withDefaults(defineProps<ISelectPagesizesProps>(), {
  sizes: () => [5, 10, 20, 30, 50, 100],
  cacheKey: 'common'
});

/**
 * 计算属性：下拉项（使用变量插值）
 */
const computedItems = computed(() => {
  return props.sizes.map((n) => ({ label: t('components.selects.pagesizes.item', { count: n }), value: n }));
});

/**
 * 常量：使用 useCookie 存储 JSON 对象
 */
const pagesizesCookie = useCookie<Record<string, number>>(COOKIE_KEY_PAGESIZES, {
  default: () => ({}),
  watch: 'shallow',
  maxAge: 60 * 60 * 24 * 365 // 1 年，可根据需要调整
  // secure: true,          // 生产环境建议开启（需 HTTPS）
  // sameSite: 'lax',       // 可选，根据安全需求调整
});

/**
 * 计算属性：每页数量（优先级：路由 > 本模块 > common > 20）
 */
const pagesize = computed<number>({
  /**
   * Getter：SSR 和客户端均一致，避免 hydration mismatch
   */
  get: (): number => {
    /**
     * 常量：路由的 pagesize 值
     */
    const routeVal = route.query.pagesize;

    // 尝试解析路由值
    if (routeVal) {
      // 解析为整数
      const num = parseInt(String(routeVal), 10);

      // 有效且大于 0 则返回
      if (Number.isFinite(num) && num > 0) {
        return num;
      }
    }

    // 2. 当前模块的 cookie 值（使用抽离的通用函数）
    return getPageSizeByCookieParsed(pagesizesCookie.value, props.cacheKey);
  },

  /**
   * Setter：更新路由 query（保持可分享）并同步写入 cookie
   */
  set: (value: number) => {
    const query = { ...route.query };

    // 修改每页数量后统一回到第一页，避免当前页越界导致看起来像“没生效”。
    delete query.page;

    // 写入路由。查询接口以路由中的 pagesize 为准，因此这里必须始终显式带上。
    query.pagesize = String(value);

    navigateTo({ path: route.path, query }, { replace: true });

    // 同时写入当前模块的 cookie 值
    pagesizesCookie.value = {
      ...pagesizesCookie.value,
      [props.cacheKey]: value
    };
  }
});

/**
 * 监听：当路由变化（外部链接带 pagesize）时，自动同步到 cookie
 */
watch(
  () => route.query.pagesize,
  (val) => {
    const num = parseInt(String(val ?? ''), 10);
    if (Number.isFinite(num) && num > 0) {
      pagesizesCookie.value = {
        ...pagesizesCookie.value,
        [props.cacheKey]: num
      };
    }
  },
  { immediate: true }
);
</script>

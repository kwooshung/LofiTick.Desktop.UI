import { useIntervalFn } from '@vueuse/core';

export default defineNuxtPlugin(() => {
  // 可选保险1：页面卸载/刷新时彻底清空（大多数情况都会触发）
  window.addEventListener('beforeunload', () => {
    useApiDerivedKeyCache.clear();
  });

  // 保险2：每 10 分钟检查一次，防止极端长会话积累过多
  const { pause, resume } = useIntervalFn(
    () => {
      if (useApiDerivedKeyCache.size > 100) {
        // 约 100 分钟数据，远超正常使用场景
        useApiDerivedKeyCache.clear();
      }
    },
    60 * 1000 * 10,
    { immediate: true }
  );

  window.addEventListener('beforeunload', () => {
    pause();
  });

  resume();
});

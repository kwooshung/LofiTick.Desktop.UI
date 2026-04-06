<template>
  <div class="flex h-full flex-col items-center justify-center gap-4 px-4">
    <h1 class="text-2xl font-bold">LofiTick Desktop UI</h1>
    <p class="text-muted">Nuxt 5 nightly · TailwindCSS v4 · Nuxt UI v4</p>

    <pre class="w-full max-w-3xl overflow-auto rounded-lg border p-3 text-xs">{{ healthDebugText }}</pre>
  </div>
</template>

<script setup lang="ts">
/**
 * 状态：健康检查请求
 */
const {
  datas: healthDatas,
  status: healthStatus,
  loading: healthLoading,
  error: healthError,
  refresh: healthRefresh
} = await useApi('/health', {
  method: 'GET'
});

/**
 * 状态：健康检查输出（调试用）
 */
const healthDebugText = computed(() => {
  const payload = {
    loading: healthLoading.value,
    datas: healthDatas.value ?? null,
    status: healthStatus.value ?? null,
    error: healthError.value
      ? {
          message: healthError.value.message,
          statusCode: (healthError.value as unknown as { statusCode?: number }).statusCode
        }
      : null
  };

  return JSON.stringify(payload, null, 2);
});

// SSR：首屏直出
if (import.meta.server) {
  await healthRefresh();
}

// Client：兜底刷新
onMounted(() => {
  void healthRefresh();
});
</script>

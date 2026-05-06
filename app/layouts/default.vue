<template>
  <div class="flex h-screen w-screen flex-col overflow-hidden">
    <ClientOnly>
      <FrameAskCloseMode />
    </ClientOnly>
    <main class="relative flex h-dvh w-screen overflow-hidden">
      <DashboardSidebar />
      <div class="relative flex size-full flex-col overflow-hidden">
        <header class="drag bg-default border-default flex h-16 items-center overflow-hidden border-b">
          <div class="flex flex-1 items-center px-4">
            <ClientOnly>
              <UBreadcrumb :items="storeBreadcrumb.states" class="no-drag inline-flex">
                <template #separator>
                  <span class="text-muted mx-2">/</span>
                </template>
              </UBreadcrumb>
            </ClientOnly>
          </div>
          <ButtonWindows class="self-start" />
        </header>
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { UnlistenFn } from '@tauri-apps/api/event';
import { listen } from '@tauri-apps/api/event';

/**
 * Store：Toast Api 信息
 */
const storeToastApi = useStoreToastApi();

/**
 * Store：面包屑
 */
const storeBreadcrumb = useStoreBreadcrumb();

/**
 * Hook：i18n
 */
const { t } = useI18n();

/**
 * Toast：消息提示
 */
const toast = useToast();

/**
 * Hook：Tauri 环境
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * 常量：Tauri 开机自启同步失败事件名
 */
const EVENT_STARTUP_SYNC_FAILED = 'startup_sync_failed';

/**
 * 变量：取消订阅开机自启同步失败事件句柄
 */
let unsubscribeStartupSyncFailed: UnlistenFn | null = null;

/**
 * 函数：构建 toast 标题
 * @param {string} code 错误码（HHH-BBB-AAA）
 * @returns {string} 标题
 */
const toastTitleBuild = (code: string): string => {
  const key = `errorcodes.${code}`;
  const translated = t(key);

  if (translated === key) {
    return t('errorcodes.defaultTitle');
  }

  return translated;
};

/**
 * 监听：Toast Api 信息变化
 */
watch(
  () => storeToastApi.states.key,
  (val, oldVal) => {
    if (val === oldVal) {
      return;
    }

    if (storeToastApi.states.enable !== true) {
      return;
    }

    const code = String(storeToastApi.states.code || '').trim();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conf: any = {
      title: toastTitleBuild(code),
      description: t('errorcodes.title', { code }),
      type: 'background'
    };

    if (storeToastApi.states.color) {
      conf.color = storeToastApi.states.color;
    }

    if (storeToastApi.states.icon) {
      conf.icon = storeToastApi.states.icon;
    }

    if (storeToastApi.states.duration) {
      conf.duration = storeToastApi.states.duration;
    }

    if (storeToastApi.states.progress) {
      conf.progress = storeToastApi.states.progress;
    }

    if (storeToastApi.states.close) {
      conf.close = storeToastApi.states.close;
    }

    toast.add(conf);
  }
);

/**
 * 生命周期：组件挂载
 */
onMounted(async () => {
  if (!import.meta.client) {
    return;
  }

  if (!isTauriRuntime.value) {
    return;
  }

  unsubscribeStartupSyncFailed = await listen<unknown>(EVENT_STARTUP_SYNC_FAILED, (event) => {
    const payload = event.payload;
    const src = payload && typeof payload === 'object' && !Array.isArray(payload) ? (payload as Record<string, unknown>) : {};
    const message = String(src.message ?? '').trim();

    toast.add({
      title: t('common.toasts.startupSyncFailed.title'),
      description: t('common.toasts.startupSyncFailed.description', { message: message || '-' }),
      type: 'background'
    });
  });
});

/**
 * 生命周期：组件卸载前
 */
onBeforeUnmount(() => {
  if (!unsubscribeStartupSyncFailed) {
    return;
  }

  unsubscribeStartupSyncFailed();
  unsubscribeStartupSyncFailed = null;
});
</script>

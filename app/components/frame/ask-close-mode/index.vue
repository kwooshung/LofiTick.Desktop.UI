<template>
  <UModal :open="stateOpen" :title="t('components.askCloseMode.title')" :ui="{ overlay: 'no-drag select-none', content: 'max-w-3xl' }" @update:open="eventUpdateOpen">
    <template #body>
      <UPageCard variant="outline" :ui="{ container: 'sm:p-4' }">
        <UFormField :label="t('components.askCloseMode.tray.title')" :description="t('components.askCloseMode.tray.desc')" :ui="{ label: 'text-base text-highlighted', description: 'text-muted' }" class="flex items-start justify-between gap-4 max-sm:flex-col">
          <UButton :label="t('components.askCloseMode.tray.action')" color="primary" @click="eventMinimizeToTray" />
        </UFormField>
        <USeparator />
        <UFormField :label="t('components.askCloseMode.exit.title')" :description="t('components.askCloseMode.exit.desc')" :ui="{ label: 'text-base text-highlighted', description: 'text-muted' }" class="flex items-start justify-between gap-4 max-sm:flex-col">
          <UButton :label="t('components.askCloseMode.exit.action')" color="error" @click="eventExit" />
        </UFormField>
      </UPageCard>
    </template>
  </UModal>
</template>

<script setup lang="ts">
/**
 * Hook：Tauri preclose
 */
const tauriPreclose = useTauriPreclose();

/**
 * Hook：Tauri 环境
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * Hook：国际化
 */
const { t } = useI18n();

/**
 * 状态：弹窗开关
 */
const stateOpen = ref(false);

/**
 * 取消订阅函数
 */
let unsubscribePrecloseOnAppPreClose: null | TUnsubscribePrecloseOnAppPreClose = null;

/**
 * 监听关闭询问弹窗
 * @param {boolean} value 弹窗开关
 */
const eventUpdateOpen = (value: boolean) => {
  stateOpen.value = value;

  if (value === false) {
    void tauriPreclose.resolve('cancel', false).catch((err) => {
      console.error('[FrameAskCloseMode] preclose_resolve(cancel) failed', err);
    });
  }
};

/**
 * 最小化到托盘
 */
const eventMinimizeToTray = () => {
  void tauriPreclose.resolve('minimize-to-tray').catch((err) => {
    console.error('[FrameAskCloseMode] preclose_resolve(minimize-to-tray) failed', err);
  });
  stateOpen.value = false;
};

/**
 * 直接退出
 */
const eventExit = () => {
  void tauriPreclose.resolve('exit').catch((err) => {
    console.error('[FrameAskCloseMode] preclose_resolve(exit) failed', err);
  });
  stateOpen.value = false;
};

/**
 * 生命周期：组件挂载时监听主进程关闭询问事件
 */
onMounted(() => {
  if (!import.meta.client) {
    return;
  }

  if (!isTauriRuntime.value) {
    return;
  }

  console.info('[FrameAskCloseMode] mounted');

  void (async () => {
    try {
      unsubscribePrecloseOnAppPreClose = await tauriPreclose.onAppPreClose(() => {
        console.info('[FrameAskCloseMode] app_pre_close received');

        if (stateOpen.value) {
          return;
        }

        stateOpen.value = true;
      });

      console.info('[FrameAskCloseMode] preclose listener ready');
    } catch (err) {
      console.error('[FrameAskCloseMode] preclose listener init failed', err);
      unsubscribePrecloseOnAppPreClose = null;
    }
  })();
});

/**
 * 生命周期：组件卸载时取消监听，防止内存泄漏
 */
onUnmounted(() => {
  if (!import.meta.client || !isTauriRuntime.value) {
    return;
  }

  if (unsubscribePrecloseOnAppPreClose) {
    unsubscribePrecloseOnAppPreClose();
    unsubscribePrecloseOnAppPreClose = null;
  }

  void tauriPreclose.resolve('cancel', false).catch(() => {
    // ignore
  });
});
</script>

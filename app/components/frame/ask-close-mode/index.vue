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
 * Hook：Tauri 环境
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * Hook：Tauri preclose
 */
const tauriPreclose = useTauriPreclose();

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
let unsubscribePrecloseOnAppPreClose: TUnsubscribePrecloseOnAppPreClose;

/**
 * 监听关闭询问弹窗
 * @param {boolean} value 弹窗开关
 */
const eventUpdateOpen = (value: boolean) => {
  stateOpen.value = value;

  if (value === false) {
    if (!isTauriRuntime.value) {
      return;
    }

    void tauriPreclose.resolve('cancel', false);
  }
};

/**
 * 最小化到托盘
 */
const eventMinimizeToTray = () => {
  if (isTauriRuntime.value) {
    void tauriPreclose.resolve('minimize-to-tray');
  }
  stateOpen.value = false;
};

/**
 * 直接退出
 */
const eventExit = () => {
  if (isTauriRuntime.value) {
    void tauriPreclose.resolve('exit');
  }
  stateOpen.value = false;
};

/**
 * 生命周期：组件挂载时监听主进程关闭询问事件
 */
onMounted(() => {
  if (!isTauriRuntime.value) {
    return;
  }

  void (async () => {
    unsubscribePrecloseOnAppPreClose = await tauriPreclose.onAppPreClose(() => {
      stateOpen.value = true;
    });
  })();
});

/**
 * 生命周期：组件卸载时取消监听，防止内存泄漏
 */
onUnmounted(() => {
  if (unsubscribePrecloseOnAppPreClose) {
    unsubscribePrecloseOnAppPreClose();
  }

  if (isTauriRuntime.value) {
    void tauriPreclose.resolve('cancel', false);
  }
});
</script>

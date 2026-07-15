<template>
  <div class="no-drag flex">
    <ButtonThemePicker />
    <div v-show="!stateIsFullScreen" class="group dark:hover:bg-accented hover:bg-accented flex h-10 w-12 items-center justify-center transition-colors duration-300" @click="onToggleDevtools">
      <UIcon name="i-lucide-terminal" class="transition-transform duration-300" />
    </div>
    <div class="group dark:hover:bg-accented hover:bg-accented flex h-10 w-12 items-center justify-center transition-colors duration-300" @click="onLockScreen">
      <UIcon name="i-lucide-lock-open" />
    </div>
    <div v-show="!stateIsFullScreen" class="group dark:hover:bg-accented hover:bg-accented flex h-10 w-12 items-center justify-center transition-colors duration-300" @click="onToggleAlwaysOnTop">
      <UIcon name="i-codicon:pinned" :class="`transition-transform duration-300 ${stateIsTopmost ? '' : 'rotate-45'}`" />
    </div>
    <div v-if="computedShowWindowControls" v-show="!stateIsFullScreen" class="group dark:hover:bg-accented hover:bg-accented flex h-10 w-12 items-center justify-center transition-colors duration-300" @click="onMinimize">
      <UIcon name="i-codicon:chrome-minimize" />
    </div>
    <div v-if="computedShowWindowControls" v-show="!stateIsFullScreen" class="group dark:hover:bg-accented hover:bg-accented flex h-10 w-12 items-center justify-center transition-colors duration-300" @click="onToggleMaximize">
      <UIcon :key="stateIsMaximized ? 'restore' : 'maximize'" :name="stateIsMaximized ? 'i-codicon:chrome-restore' : 'i-codicon:chrome-maximize'" />
    </div>
    <div v-if="computedShowWindowControls" class="group dark:hover:bg-accented hover:bg-accented flex h-10 w-12 items-center justify-center transition-colors duration-300" @click="onToggleFullScreen">
      <UIcon :key="stateIsFullScreen ? 'fullscreen-exit' : 'fullscreen'" :name="stateIsFullScreen ? 'i-codicon:screen-normal' : 'i-codicon:screen-full'" />
    </div>
    <div v-if="computedShowWindowControls" v-show="!stateIsFullScreen" class="group flex h-10 w-12 items-center justify-center transition-colors duration-300 hover:bg-red-500" @click="onClose">
      <UIcon name="i-codicon:chrome-close" class="transition-colors group-hover:text-white" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UnlistenFn } from '@tauri-apps/api/event';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useTimeoutFn } from '@vueuse/core';

/**
 * Hook：Tauri 环境
 */
const { isTauriRuntime, isWindows } = useTauriEnv();

/**
 * Hook：Tauri 窗口能力
 */
const tauriWindow = useTauriWindow();

/**
 * Store：应用信息
 */
const storeAuth = useStoreAuth();

/**
 * 状态：是否最大化
 */
const stateIsMaximized = ref(false);

/**
 * 状态：是否置顶
 */
const stateIsTopmost = ref(false);

/**
 * 状态：是否全屏
 */
const stateIsFullScreen = ref(false);

/**
 * 变量：卸载监听器
 */
let unsubscribeWindowStateChange: null | (() => void) = null;

/**
 * 变量：卸载监听器（窗口移动）
 */
let unsubscribeWindowMoved: null | UnlistenFn = null;

/**
 * 变量：卸载监听器（窗口缩放）
 */
let unsubscribeWindowResized: null | UnlistenFn = null;

/**
 * 计算属性：是否展示窗口控制按钮
 */
const computedShowWindowControls = computed(() => Boolean(isTauriRuntime.value && isWindows.value));

/**
 * 事件：最小化窗口
 */
const onMinimize = () => {
  if (!isTauriRuntime.value) {
    return;
  }

  void tauriWindow.minimize();
};

/**
 * 函数：刷新窗口状态快照
 */
const refreshWindowState = async () => {
  if (!isTauriRuntime.value) {
    return;
  }

  try {
    syncWindowState(await tauriWindow.snapshotGet());
  } catch {
    // 忽略快照获取失败，状态仍可依赖壳侧事件更新。
  }
};

/**
 * 函数：防抖刷新窗口状态快照
 */
const refreshWindowStateDebounced = useDebounceFn(() => {
  void refreshWindowState();
}, 120);

/**
 * 计时器：全屏切换后的延迟刷新句柄。
 */
const { start: startRefreshWindowStateTimer, stop: stopRefreshWindowStateTimer } = useTimeoutFn(refreshWindowStateDebounced, 360, { immediate: false });

/**
 * 事件：切换最大化/恢复窗口
 */
const onToggleMaximize = async () => {
  if (!isTauriRuntime.value) {
    return;
  }

  await tauriWindow.toggleMaximize();
  refreshWindowStateDebounced();
};

/**
 * 事件：切换全屏（F11/系统快捷键同样会通过主进程事件同步到此处）
 */
const onToggleFullScreen = async () => {
  if (!isTauriRuntime.value) {
    return;
  }

  await tauriWindow.toggleFullscreen();

  // 全屏切换在 Windows 上存在“先最大化动画，后延时进入全屏”的过渡期。
  // 这里延时刷新一次，避免 snapshot 读到过渡态导致按钮状态锁死。
  // 同时保留壳侧事件推送作为主同步来源。
  refreshWindowStateDebounced();
  stopRefreshWindowStateTimer();
  startRefreshWindowStateTimer();
};

/**
 * 事件：锁定屏幕
 */
const onLockScreen = () => {
  storeAuth.update({
    ui: {
      show: true
    },
    member: {
      mfa: {
        verify: false
      }
    }
  });
};

/**
 * 事件：切换置顶
 */
const onToggleAlwaysOnTop = async () => {
  if (!isTauriRuntime.value) {
    return;
  }

  await tauriWindow.toggleAlwaysOnTop();
  refreshWindowStateDebounced();
};

/**
 * 事件：切换开发者工具
 */
const onToggleDevtools = () => {
  if (!isTauriRuntime.value) {
    return;
  }

  void tauriWindow.toggleDevtools();
};

/**
 * 事件：关闭窗口
 */
const onClose = () => {
  if (!isTauriRuntime.value) {
    return;
  }

  console.info('[ButtonWindows] requestClose called');

  void tauriWindow.requestClose().catch((err) => {
    console.error('[ButtonWindows] requestClose failed', err);
  });
};

/**
 * 同步状态自窗口状态
 * @param {IWindowSnapshot} state 窗口状态
 */
const syncWindowState = (state: IWindowSnapshot) => {
  stateIsTopmost.value = Boolean(state.isTopmost);
  stateIsMaximized.value = Boolean(state.isMaximized);
  stateIsFullScreen.value = Boolean(state.isFullScreen);
};

/**
 * 快捷键
 */
defineShortcuts({
  meta_l: onLockScreen
});

/**
 * 生命周期：挂载后 - 获取初始状态 & 监听状态变化
 */
onMounted(async () => {
  if (!isTauriRuntime.value) {
    return;
  }

  syncWindowState(await tauriWindow.snapshotGet());

  unsubscribeWindowStateChange = await tauriWindow.onWindowStateChange(syncWindowState);

  // 兜底：覆盖非 invoke 路径（双击拖拽区、系统菜单/快捷键等）触发的最大化/还原/全屏变化。
  // 这些变化在窗口层通常会体现为 moved/resized。
  const win = getCurrentWindow();
  unsubscribeWindowMoved = await win.onMoved(() => {
    refreshWindowStateDebounced();
  });
  unsubscribeWindowResized = await win.onResized(() => {
    refreshWindowStateDebounced();
  });
});

/**
 * 生命周期：卸载前 - 卸载监听器
 */
onBeforeUnmount(() => {
  if (unsubscribeWindowStateChange) {
    unsubscribeWindowStateChange();
    unsubscribeWindowStateChange = null;
  }

  if (unsubscribeWindowMoved) {
    unsubscribeWindowMoved();
    unsubscribeWindowMoved = null;
  }

  if (unsubscribeWindowResized) {
    unsubscribeWindowResized();
    unsubscribeWindowResized = null;
  }
});
</script>

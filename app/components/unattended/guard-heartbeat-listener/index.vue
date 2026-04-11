<template>
  <div class="hidden" />
</template>

<script setup lang="ts">
import type { UnlistenFn } from '@tauri-apps/api/event';
import { listen } from '@tauri-apps/api/event';

/**
 * 常量：任务 ID
 */
const TASK_ID = 'unattended:heartbeat:lofitick';

/**
 * 常量：Tauri tasks 事件名
 */
const EVENT_TASKS_EVENT = 'tasks_event';

/**
 * 状态：心跳请求是否进行中
 */
const stateHeartbeatSending = ref(false);

/**
 * Hook：Tauri 环境
 */
const { isTauriRuntime } = useTauriEnv();

/**
 * API：心跳上报
 */
const { refresh: refreshHeartbeatRemotePost } = await useApi('desktop/settings/unattended/guard/heartbeat', { method: 'POST' });

/**
 * 变量：取消订阅 tasks 事件句柄
 */
let unsubscribeTasks: UnlistenFn | null = null;

/**
 * 函数：上报一次心跳
 * 描述：前端不做任何“是否启用/间隔/机器码来源”等判断；只要 Desktop 壳触发了对应任务事件，就直接调用 API 更新 Redis。
 * @param {string} machineCode 机器码
 * @returns {Promise<void>} 无返回值
 */
const heartbeatSend = async (machineCode: string): Promise<void> => {
  if (stateHeartbeatSending.value) {
    return;
  }

  const code = String(machineCode || '').trim();
  if (!code) {
    return;
  }

  stateHeartbeatSending.value = true;

  try {
    await refreshHeartbeatRemotePost({
      datas: {
        machineCode: code
      }
    });
  } catch {
    // ignore
  } finally {
    stateHeartbeatSending.value = false;
  }
};

/**
 * 生命周期：组件挂载
 */
onMounted(async () => {
  if (!import.meta.client) {
    return;
  }

  if (!isTauriRuntime) {
    return;
  }

  unsubscribeTasks = await listen<unknown>(EVENT_TASKS_EVENT, (event) => {
    const payload = event.payload;
    const src = payload && typeof payload === 'object' && !Array.isArray(payload) ? (payload as Record<string, unknown>) : {};
    const type = String(src.type ?? '');

    if (type !== 'tasks:run:success') {
      return;
    }

    const task = src.task && typeof src.task === 'object' && !Array.isArray(src.task) ? (src.task as Record<string, unknown>) : {};
    const taskId = String(task.id ?? '');

    if (taskId !== TASK_ID) {
      return;
    }

    const attach = src.attach && typeof src.attach === 'object' && !Array.isArray(src.attach) ? (src.attach as Record<string, unknown>) : {};
    const machineCode = String(attach.machineCode ?? '').trim();
    void heartbeatSend(machineCode);
  });
});

/**
 * 生命周期：组件卸载前
 */
onBeforeUnmount(() => {
  if (!unsubscribeTasks) {
    return;
  }

  unsubscribeTasks();
  unsubscribeTasks = null;
});
</script>

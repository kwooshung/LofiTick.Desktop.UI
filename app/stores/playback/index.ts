/**
 * Store：播放设置
 */
export const useStorePlayback = defineStore('playback', () => {
  /**
   * 播放设置状态
   */
  const states = ref<IStoresPlayback>({
    fade: {
      start: 0,
      end: 0
    },
    lufs: -14
  });

  /**
   * 水合阶段标志：避免初次赋值触发持久化覆盖
   */
  let hydrating = true;

  /**
   * Hook：Tauri 设置
   */
  const tauriSettings = useTauriSettings();

  /**
   * 监听淡入淡出值变化
   */
  watch(
    () => states.value,
    (n) => {
      // 水合期间不写回，防止覆盖后端已持久化的值
      if (hydrating) {
        return;
      }

      const playback = { fade: { start: n.fade.start, end: n.fade.end }, lufs: n.lufs };
      void tauriSettings.update({ playback });
    },
    { deep: true }
  );

  /**
   * 生命周期钩子：挂载完成
   */
  onMounted(async () => {
    const settings = await tauriSettings.get();
    const playback = settings.playback;

    if (playback && typeof playback === 'object' && !Array.isArray(playback)) {
      const p = playback as Record<string, unknown>;
      const fade = p.fade && typeof p.fade === 'object' && !Array.isArray(p.fade) ? (p.fade as Record<string, unknown>) : null;

      const startRaw = fade?.start ?? fade?.in;
      const endRaw = fade?.end ?? fade?.out;

      const start = typeof startRaw === 'number' && Number.isFinite(startRaw) ? startRaw : states.value.fade.start;
      const end = typeof endRaw === 'number' && Number.isFinite(endRaw) ? endRaw : states.value.fade.end;
      const lufs = typeof p.lufs === 'number' && Number.isFinite(p.lufs) ? p.lufs : states.value.lufs;

      states.value = { fade: { start, end }, lufs };
    }

    // 完成水合，后续用户修改才写回
    hydrating = false;
  });

  return { states };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStorePlayback, import.meta.hot));
}

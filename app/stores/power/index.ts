/**
 * Store：电源策略
 */
export const useStorePower = defineStore('power', () => {
  /**
   * 状态：策略与激活态
   */
  const states = ref<IPowerStatus>({
    policy: {
      system: 'always',
      display: 'never'
    },
    active: {
      system: false,
      display: false
    }
  });

  /**
   * 水合阶段标志：避免初次赋值触发持久化覆盖
   */
  let hydrating = true;

  /**
   * Hook：Tauri 电源能力
   */
  const tauriPower = useTauriPower();

  /**
   * 临时阻止休眠（系统/显示器）
   * @param {boolean} on 是否阻止（默认 true），关闭时恢复为策略状态
   */
  const setRuntimeBlocker = (on: boolean = true) => {
    // 仅运行态阻止，不写入持久化策略
    void tauriPower.blockSystem(on);
    void tauriPower.blockDisplay(on);
  };

  /**
   * 监听淡入淡出值变化
   */
  watch(
    () => states.value,
    (n) => {
      if (hydrating) {
        return;
      }
      const power = { system: n.policy.system, display: n.policy.display };
      void tauriPower.setPolicy(power);
    },
    { deep: true }
  );

  /**
   * 生命周期钩子：挂载完成
   */
  onMounted(async () => {
    states.value = await tauriPower.get();
    // 完成水合
    hydrating = false;
  });

  return { states, setRuntimeBlocker };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStorePower, import.meta.hot));
}

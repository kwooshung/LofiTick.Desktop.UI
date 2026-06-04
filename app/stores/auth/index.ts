import { merge } from 'es-toolkit';

/**
 * Store：认证（最小实现，仅用于 UI 状态）
 */
export const useStoreAuth = defineStore('auth', () => {
  /**
   * 状态：认证相关状态
   */
  const states = ref<IStoresAuth>({
    ui: {
      show: false,
      lock: false
    },
    member: {
      mfa: {
        verify: true
      }
    }
  });

  /**
   * 函数：更新认证状态（深合并）
   * @param {IStoresAuthUpdate} patch 增量状态
   */
  const update = (patch: IStoresAuthUpdate): void => {
    states.value = merge(states.value, patch);
  };

  return { states, update };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreAuth, import.meta.hot));
}

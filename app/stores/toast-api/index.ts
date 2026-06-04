/**
 * Store：Toast Api 信息
 */
export const useStoreToastApi = defineStore('toast-api', () => {
  /**
   * 锁定设置状态
   */
  const states = ref<IStoresToastApi>({
    key: '',
    enable: false,
    code: '',
    icon: '',
    color: 'warning',
    duration: 3000,
    progress: false,
    close: false
  });

  /**
   * 函数：设置 Toast Api 信息
   * @param {IStoresToastApi} newStates 状态
   */
  const set = (newStates: IStoresToastApi) => {
    states.value.enable = newStates.enable;
    states.value.code = newStates.code;
    states.value.icon = newStates.icon;
    states.value.color = newStates.color;
    states.value.duration = newStates.duration;
    states.value.progress = newStates.progress;
    states.value.close = newStates.close;
    states.value.key = newStates.key;
  };

  return { states, set };
});

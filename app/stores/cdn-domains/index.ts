/**
 * Store：CDN 域名配置
 *
 * 说明：用于在应用启动时初始化可用的 CDN 域名列表。
 */
export const useStoreCdnDomains = defineStore('cdn-domains', () => {
  /**
   * 状态：CDN 域名列表
   */
  const states = ref({
    domains: [] as string[],
    isReady: false
  });

  /**
   * 函数：初始化 CDN 域名配置
   *
   * 说明：当前实现为幂等初始化占位，保证启动流程不因缺失 store 而中断。
   */
  const setup = () => {
    // 已初始化则直接返回
    if (states.value.isReady) {
      return;
    }

    states.value.isReady = true;
  };

  return { states, setup };
});

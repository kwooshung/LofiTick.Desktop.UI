export default defineNuxtPlugin(() => {
  /**
   * 常量：store。
   */
  const store = useStoreCdnDomains();
  store.setup();
});

export default defineNuxtPlugin(() => {
  const store = useStoreCdnDomains();
  store.setup();
});

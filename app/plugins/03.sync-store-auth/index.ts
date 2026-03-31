export default defineNuxtPlugin(() => {
  const store = useStoreAuth();
  store.setup();
});

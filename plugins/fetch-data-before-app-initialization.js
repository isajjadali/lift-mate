import store from '@/stores';

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.hook('app:created', () => {
    const $store = store();
    $store.getPages();
    $store.getConfig();
    $store.fetchCars();
  });
});

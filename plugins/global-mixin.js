import globalMixin from '~/mixins/main-mixin.js';

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.mixin(globalMixin);
});

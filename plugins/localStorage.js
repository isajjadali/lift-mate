import { APP_NAME } from '~/common';

export const localStorage = {
  setItem(key, value) {
    if (process.client) {
      window.localStorage.setItem(`${APP_NAME}::${key}`, value);
    }
  },
  getItem(key) {
    if (process.client) {
      return (
        window.localStorage.getItem(`${APP_NAME}::${key}`) || null
      );
    }
    return null;
  },
  removeItem(key) {
    if (process.client) {
      return window.localStorage.removeItem(`${APP_NAME}::${key}`);
    }
  },
  clearData() {
    if (process.client) {
      const local = window.localStorage;
      const object = {};
      for (const key in local) {
        if (key.includes('Headers-For')) {
          object[key] = local[key];
        }
      }
      local.clear();
      Object.entries(object).forEach((entry) => {
        window.localStorage.setItem(entry[0], entry[1]);
      });
    }
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('localStorage', localStorage);
  return localStorage;
});

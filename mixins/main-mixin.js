import dompurify from 'dompurify';
import { marked } from 'marked';
import store from '@/stores';
import { localStorage } from '~/plugins/localStorage';

export const hasPermission = function (permission = '') {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user?.permissions?.includes(permission);
};

export const cleanHtml = function (value = '') {
  value = `${value}`;

  if (!hasHtmlTags(value)) {
    return value;
  }

  dompurify.sanitize(marked(value));
};

function hasHtmlTags(str) {
  const htmlTagsRegex = /<[a-z][\s\S]*>/i;
  return htmlTagsRegex.test(str);
}

export default {
  methods: {
    cleanHtml,
    hasPermission,
  },
  computed: {
    $store: () => store(),
    $$window() {
      if (process.client) {
        const { $window } = useNuxtApp();
        return $window;
      }
      return {};
    },
    isDarkMode() {
      return this.$vuetify.theme.global.name === 'dark';
    },
  },
};

// import this after install `@mdi/font` package
import { createVuetify } from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { VTreeview } from 'vuetify/labs/VTreeview';

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    icons: {
      iconfont: 'mdi', // default - only for display purposes
    },
    components: {
      VTreeview,
    },
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#00897B',
            secondary: '#BDBDBD',
            accent: '#1976D2',
            error: '#D32F2F',
            info: '#0288D1',
            success: '#388E3C',
            warning: '#F57C00',
          },
        },
        dark: {
          dark: true,
          colors: {
            primary: '#00897B',
            secondary: '#BDBDBD',
            accent: '#1976D2',
            error: '#D32F2F',
            info: '#0288D1',
            success: '#388E3C',
            warning: '#F57C00',
          },
        },
      },
    },
  });
  app.vueApp.use(vuetify);
});

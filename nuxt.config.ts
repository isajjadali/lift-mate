// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import path from 'path';
const s3Url = 'https://the-95-star.s3.amazonaws.com';

export default defineNuxtConfig({
  // ssr:false,
  app: {
    head: {
      script: [{
        src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyD1g3TCNsJhS8OdxSg09QdDa-wyR96UJ7I&loading=async&libraries=places',
        async: true,
        defer: true,
      }],
      meta: [{
        name: 'google-site-verification',
        content: 'PHoIVx3sQkkhyWsa_aiA8qyPkeShry2OD9Rl9VmrF0g',
      }],
    },
  },
  compatibilityDate: '2024-08-19',
  devtools: { enabled: true },
  serverHandlers: [
    // Register express server middleware
    { route: '/apis', handler: './server/server.js' },
  ],
  runtimeConfig: {
    // The private keys which are only available within server-side
    s3Url: `${s3Url}`,
    logoUrl: `${s3Url}/logo.png`,
    compressedLogoUrl: `${s3Url}/logo-lazy-src.png`,
    // Keys within public, will be also exposed to the client-side
    public: {
      s3Url: `${s3Url}`,
      logoUrl: `${s3Url}/logo.png`,
      compressedLogoUrl: `${s3Url}/logo-lazy-src.png`,
    }
  },
  routeRules: {
    '/static-pages': { ssr: false }
  },
  // alias: {
  //   pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs"
  // },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    "@pinia/nuxt",
    'nuxt-paypal',
    'nuxt-vue3-google-signin',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  paypal: {
    // PayPal options
    env: 'sandbox',
    client: {
      sandbox: 'ARwS3i8Yy3Fy3vvyPjUh0GXmLumOvUesGs9xk9Ed7G3Z3BQVIjMgfWlb9vHRVXQYW5wJQvmm4hiCfQvl',
      production: 'ARwS3i8Yy3Fy3vvyPjUh0GXmLumOvUesGs9xk9Ed7G3Z3BQVIjMgfWlb9vHRVXQYW5wJQvmm4hiCfQvl'
    },
    clientId: 'ARwS3i8Yy3Fy3vvyPjUh0GXmLumOvUesGs9xk9Ed7G3Z3BQVIjMgfWlb9vHRVXQYW5wJQvmm4hiCfQvl',
  },
  imports: {
    dirs: ['stores/**'], 
  },
  nitro: {
    esbuild: {
      options: { target: 'es2022' },
    },
  },
  vite: {
    ssr: {
      noExternal: ['vue-the-mask']
    },
    vue: {
      template: {
        compilerOptions: {
          isCustomElement: (tag) => {
            return tag.startsWith('ion-') // (return true)
          }
        },
        transformAssetUrls,
      },
    },
  },

  runtimeconfig:{
     
    googleclientid:process.env.GOOGLE_CLIENT_ID,
     
  },

  googleSignIn: {
    clientId: process.env.GOOGLE_CLIENT_ID,
  },
})

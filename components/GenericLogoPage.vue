<template>
  <v-container align="center">
    <v-row justify="center">
      <v-col
        cols="12"
        sm="10"
      >
        <v-card
          min-height="50vh"
          rounded="lg"
          class="mt-3"
        >
          <v-row class="pa-10">
            <v-col
              cols="12"
              sm="5"
              :align="$vuetify.display.smAndDown ? 'center' : 'right'"
            >
              <v-img
                :lazy-src="compressedLogoURL"
                max-height="550"
                max-width="250"
                :src="logoURL"
                class="mt-50"
              />
            </v-col>
            <v-col
              cols="12"
              sm="7"
              :class="!$vuetify.display.xs ? 'pl-10' : ''"
            >
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    class="py-0"
                  >
                    <slot />
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
  
<script>
export default {
    name: 'GenericLogoPage',
    data() {
        return {
            contactUs: {},
        };
    },
    computed: {
      compressedLogoURL() {
        const config = useRuntimeConfig();
        return config.public.compressedLogoUrl;
      },
      logoURL() {
        const config = useRuntimeConfig();
        return config.public.logoUrl;
      },
    },
};
</script>

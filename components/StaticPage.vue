<template>
  <v-container align="center">
    <v-row justify="center">
      <v-col
        cols="12"
        sm="10"
      >
        <v-card
          min-height="calc(100vh - 140px)"
          rounded="lg"
        >
          <v-container class="pa-5">
            <v-row>
              <v-col v-if="page.title">
                <h2 class="mb-2 text-capitalize">
                  {{ page.title }}
                </h2>
                <v-divider />
                <div
                  class="pa-8"
                  v-dompurify-html="page.content"
                />
              </v-col>
              <v-col v-else>
                <div><h2>Page is not yet published!</h2></div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
    data: () => ({
        service: {},
        page: {},
    }),
    metaInfo() {
        return {
            meta: [{ name: this?.metaTags?.name, content: this?.metaTags?.content }],
        };
    },
    computed: {
        slug() {
            return this.$route.params.slug;
        },
        metaTags() {
            return {
                'airport-shuttle-service': {
                    name: 'BWI airport shuttle service to the airport | newark liberty airport',
                    content:
            'Need BWI airport shuttle service to the airport near me Baltimore? Get shuttle service to bwi airport - Book newark liberty airport transfer',
                },
                'limousine-services': {
                    name: '#1 limo rentals | limousine service near me Baltimore New York MD',
                    content:
            'Searching limo companies near me?Hire affordable limo rental near me for limo service. Get best limo prices in Baltimore Washington DC newark',
                },
                'wedding-limo-service': {
                    name: 'Luxury limousine services | wedding transportation near me Newark',
                    content:
            'Want private chauffeur service near me?Hire wedding limo for wedding transportation near me with luxury limousine services New York Baltimore',
                },
                'airport-car-service': {
                    name: 'BWI airport transportation services | BWI airport car service Newark',
                    content:
            'Need black car service to BWI Airport? Hire BWI Airport car service. Enjoy JFK airport transportation services Baltimore Maryland New York',
                },
            }[this.$route.params.slug];
        },
    },
    watch: {
        slug(newValue, oldValue) {
            if (oldValue !== newValue) {
                this.updatePage(newValue);
            }
        },
    },
    created() {
        this.updatePage();
    },
    methods: {
        async updatePage() {
            this.page = this.$store.pages.find((page) => page.slug === this.slug) || {};
        },
    },
};
</script>

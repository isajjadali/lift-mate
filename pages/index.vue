<template>
  <v-container class="pa-3" fluid>
    <v-row>
      <v-carousel
        height="calc(100vh - 64px)"
        :show-arrows="false"
        interval="4000"
        hide-delimiters
      >
        <v-carousel-item v-for="(item, i) in items" :key="i" cover eager>
          <v-img
            height="calc(100vh - 64px)"
            :src="item.src"
            :lazy-src="item.lazySrc"
            eager
            cover
          />
        </v-carousel-item>
      </v-carousel>
      <v-container
        class="heading d-flex align-center flex-wrap"
        :class="$vuetify.display.smAndDown ? 'pl-4' : ''"
      >
        <v-row>
          <v-col cols="11" sm="10" md="8" class="image-text">
            <h2 class="text-white">Welcome to</h2>
            <h1
              :class="
                $vuetify.display.xs
                  ? 'text-white text-h2'
                  : 'text-white text-h1'
              "
            >
              [-[App Name]-]
            </h1>
            <h3 class="text-white">Airport Sedan, Shuttle and Limo Service.</h3>
            <p
              class="text-white welcome-description"
              v-dompurify-html="homeConfig.welcomeDescription"
            />
            <div class="float-right">
              <shared-custom-btn
                id="home__get-a-quote-btn"
                :class="$vuetify.display.xs ? 'mb-2' : 'mr-3'"
                color="primary"
                @click="$router.push('/reservation/create')"
              >
                Get a Free Quote
              </shared-custom-btn>
              <shared-custom-btn
                id="home__make-a-reservation-btn"
                color="primary"
                @click="
                  $router.push({
                    path: '/reservation/create',
                    query: { isGettingAQuote: false },
                  })
                "
              >
                Make a Reservation
              </shared-custom-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-row>
    <v-container class="mt-2">
      <v-row>
        <v-col>
          <v-card class="pa-10">
            <v-row>
              <v-col v-if="!$vuetify.display.xs" cols="3" />
              <v-col cols="12" sm="6" md="6" class="text-center">
                <h1 class="text-primary">
                  {{ homeConfig.questionare }}
                </h1>
                <h2 class="mt-5 text-decoration-underline">
                  {{ homeConfig.coreValue }}
                </h2>
                <div align="center" class="mt-5">
                  <p
                    v-dompurify-html="
                      homeConfig.customerSatisfactionDescription
                    "
                  />
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col
                v-for="(field, index) in info"
                :key="index"
                class="d-flex justify-center align-center"
              >
                <v-card
                  class="d-flex align-center justify-center gradient-background teal-darken-1"
                  width="300px"
                  height="180px"
                  elevation="15"
                  radius="sm"
                >
                  <v-card-text align="center">
                    <v-row class="text-white">
                      <v-col cols="12">
                        <h3>
                          <v-icon x-large color="white">
                            {{ field.icon }} </v-icon
                          >{{ field.heading }}
                        </h3>
                      </v-col>
                      <v-col>
                        <h3 v-dompurify-html="field.value" />
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-row />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="mt-2">
      <v-row>
        <v-col>
          <v-card class="pa-10">
            <v-row>
              <v-col v-if="!$vuetify.display.xs" cols="3" />
              <v-col cols="12" sm="6" md="6" class="text-center">
                <h1 class="text-primary">Services We Offer</h1>
              </v-col>
            </v-row>
            <!-- Todo: we can imporove by adding some text on UI -->
            <v-row justify="center">
              <v-col cols="12" sm="6">
                <div align="center">
                  <p v-dompurify-html="homeConfig.serviceWeOfferDescription" />
                </div>
              </v-col>
            </v-row>
            <v-row class="mt-3">
              <v-col
                v-for="(item, index) in $store.cars"
                :key="index"
                class="d-flex justify-center align-center services"
              >
                <v-card width="300px" elevation="10">
                  <v-card-title>
                    <div
                      class="title text-white teal-darken-1 gradient-background"
                    >
                      {{ item.name }}
                    </div>
                  </v-card-title>
                  <v-card-text class="pb-1">
                    <v-img
                      contain
                      :src="item.imageUrl"
                      :lazy-src="item.compressedImageUrl"
                      height="120px"
                      width="200px"
                    />
                    <v-divider class="mx-4" />
                    <v-row class="pt-3 pb-2">
                      <v-col cols="12" class="pb-0">
                        <v-icon class="mr-3" color="primary">
                          mdi-arrow-right-bold-circle
                        </v-icon>
                        <span>
                          Passengers:
                          {{ item.maxPassenger }}
                        </span>
                      </v-col>
                      <v-col cols="12" class="pt-0">
                        <v-icon class="mr-3" color="primary">
                          mdi-arrow-right-bold-circle
                        </v-icon>
                        <span>
                          Bags:
                          {{ item.maxBags }}
                        </span>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-container class="mt-2">
      <v-row>
        <v-col>
          <v-card class="pa-10">
            <v-row>
              <v-col v-if="!$vuetify.display.xs" cols="3" />
              <v-col cols="12" sm="6" md="6" class="text-center">
                <h1 class="text-primary">Payment Gateways</h1>
              </v-col>
            </v-row>

            <v-row justify="center">
              <v-col cols="12" sm="6">
                <div align="center" class="mt-5">
                  <p v-dompurify-html="homeConfig.paymentDescription" />
                </div>
              </v-col>
            </v-row>
            <v-row class="mt-3">
              <v-col class="d-flex justify-center align-center">
                <v-card
                  class="d-flex align-center justify-center"
                  width="300px"
                  height="180px"
                  elevation="10"
                  radius="sm"
                >
                  <v-card-text align="center">
                    <v-img
                      :src="`${$config.public.s3Url}/paypal.png`"
                      :lazy-src="`${$config.public.s3Url}/paypal-lazy-src.png`"
                    />
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col class="d-flex justify-center align-center">
                <v-card
                  class="d-flex align-center justify-center pa-5"
                  width="300px"
                  height="180px"
                  elevation="15"
                  radius="sm"
                >
                  <v-img
                    :src="`${$config.public.s3Url}/ssl.png`"
                    :lazy-src="`${$config.public.s3Url}/ssl-lazy-src.png`"
                  />
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script >

export default {
  name: "HomePage",
  data() {
    return {
      config: {},
    };
  },
  computed: {
    info() {
      return [
        {
          icon: "mdi-cellphone",
          heading: "Call us at",
          value: this.homeConfig.contactNumber,
        },
        {
          icon: "mdi-av-timer",
          heading: "Working Hours",
          value: this.homeConfig.workingHours,
        },

        {
          icon: "mdi-money",
          heading: "Three Easy Steps",
          value:
            " <div>Make a Reservation</div><div>Pay Ahead</div><div> Enjoy the Ride</div>",
        },
      ];
    },
    items() {
      return [
        {
          src: "/home0.jpeg",
          lazySrc: "/home0-compressed.jpg",
        },
        {
          src: "/home1.jpeg",
          lazySrc: "/home1-compressed.jpg",
        },
        {
          src: "/home2.jpeg",
          lazySrc: "/home2-compressed.jpg",
        },
        {
          src: "/home3.jpeg",
          lazySrc: "/home3-compressed.jpg",
        },
      ].map((item) => {
        return {
          src: `${this.$config.public.s3Url}${item.src}`,
          lazySrc: `${this.$config.public.s3Url}${item.lazySrc}`,
        };
      });
    },
    homeConfig() {
      return this.$store.configurations?.home || {};
    },
  },
};
</script>
<style lang="scss" scoped>
.welcome-description {
  ol {
    padding: 24px;
  }
}

.heading {
  position: absolute;
  height: calc(100vh - 64px);
  padding-left: 100px;
}

.gradient-background {
  background-image: linear-gradient(
    to left,
    rgb(0 0 0 / 62%),
    rgb(var(--v-theme-primary))
  );
}

.image-text {
  border-radius: 20px;
  padding: 20px;
  @extend .gradient-background;
}

.tabs {
  .col {
    height: 200px;
    border-right: 2px solid white;
  }
}

.banner {
  position: right;
  border-radius: 40px 10px 10px 40px;
  width: 100px;
  height: 50px;
}

.services {
  position: relative;

  .title {
    position: absolute;
    right: 0;
    padding: 0 20px;
    border-radius: 16px 0 0 16px;
    margin-bottom: 15px;
  }
}
</style>

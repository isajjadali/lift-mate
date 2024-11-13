<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-6 bg-primary rounded-xl" image="/background.svg">
          <v-row>
            <v-col cols="6" justify-self="start">
              <p class="text-body-2 text-sm-body-1 font-weight-bold my-1">
                Revenue
              </p>
              <p class="text-h5 text-sm-h4 font-weight-light">$700,000</p>
            </v-col>
            <v-col cols="6" class="d-flex flex-column align-end">
              <p class="text-body-2 text-sm-body-1 font-weight-bold my-1">
                Rating
              </p>
              <p class="text-h5 text-sm-h4">3.5</p>

              <v-rating
                hover
                :length="5"
                size="x-small"
                :model-value="3"
                readonly
                half-increments
                active-color="white"
              >
              </v-rating>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" class="my-6">
        <v-card
          elevation="3"
          class="pa-2 rounded-xl elevation-0 background-cards"
        >
          <template v-slot:prepend>
            <span class="text-md-body-1"
              ><v-icon color="primary" class="mr-1">mdi-finance</v-icon
              >Reservation / Income</span
            >
          </template>
          <template v-slot:append>
            <v-btn-toggle
              class="pa-xs-0"
              v-model="selectedOption"
              variant="outlined"
              rounded="lg"
              density="compact"
              mandatory
            >
              <v-btn value="daily" size="small">Daily</v-btn>
              <v-btn size="small">Weekly</v-btn>
            </v-btn-toggle>
          </template>
          <v-card-text>
            <v-row align="center">
              <v-col cols="12" sm="12" md="8">
                <client-only>
                  <vue-apex-charts
                    type="area"
                    height="250"
                    :options="chartOptions"
                    :series="series"
                  />
                </client-only>
              </v-col>
              <v-divider
                :vertical="smAndDown ? false : true"
                :horizontal="smAndDown ? true : false"
                :inset="smAndDown ? false : true"
              ></v-divider>
              <v-col class="mx-3">
                <v-row align="center">
                  <v-col cols="3" sm="3" md="2">
                    <v-avatar color="#025864" size="50" rounded="lg"
                      ><v-icon>mdi-calendar-check-outline</v-icon></v-avatar
                    >
                  </v-col>
                  <v-col>
                    <p class="text-body-1 mb-1">Reservations</p>
                    <p class="text-h4">
                      30<span
                        style="color: #025864"
                        class="mx-3 text-subtitle-1"
                        >45.5%<v-icon size="x-small"
                          >mdi-arrow-top-right</v-icon
                        ></span
                      >
                    </p>
                  </v-col>
                </v-row>
                <v-divider class="mx-7 my-5" />
                <v-row align="center">
                  <v-col cols="3" sm="3" md="2">
                    <v-avatar color="#56AB87" size="50" rounded="lg"
                      ><v-icon>mdi-currency-usd</v-icon></v-avatar
                    >
                  </v-col>
                  <v-col>
                    <p class="text-body-1 mb-1">Income</p>
                    <p class="text-h4">
                      $300,000
                      <span style="color: #d32f2f" class="mx-3 text-subtitle-1"
                        >45.5%
                        <v-icon size="x-small"
                          >mdi-arrow-bottom-left</v-icon
                        ></span
                      >
                    </p>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" sm="4" md="4" v-for="n in 3" :key="n" class="mb-6">
        <v-card
          class="pa-5 elevation-0 background-cards-2 rounded-xl"
          image="/background-2.svg"
        >
          <template v-slot:prepend>
            <p style="color: white">
              <v-icon color="white" class="mr-2">mdi-calendar-check</v-icon
              >Reservation
            </p>
          </template>
          <template v-slot:append>
            <p class="text-body-2" style="color: #e7e7e7">Last 30 Days</p>
          </template>
          <v-card-text>
            <p class="text-h4" style="color: white">30</p>
            <v-progress-linear
              color="white"
              class="rounded my-3"
              model-value="30"
              :height="10"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card class="background-cards elevation-0 rounded-xl">
          <v-card-text>
            <v-row>
              <v-col cols="3">
                <p class="text-h6 text-center font-weight-medium">Top Users</p>
                <!-- <v-divider class="my-3" /> -->
                <v-list lines="two" class="background-cards">
                  <v-list-item
                    title="Google"
                    :prepend-avatar="'/google-icon.svg'"
                  />
                  <v-list-item
                    title="Google"
                    :prepend-avatar="'/google-icon.svg'"
                  />
                  <v-list-item
                    title="Google"
                    :prepend-avatar="'/google-icon.svg'"
                  />
                </v-list>
              </v-col>
              <v-divider vertical inset />
              <v-col cols="3">
                <p class="text-h6 text-center font-weight-medium">
                  Top Drivers
                </p>
                <!-- <v-divider class="my-3" /> -->
                <v-list lines="two" class="background-cards">
                  <v-list-item
                    title="Google"
                    :prepend-avatar="'/google-icon.svg'"
                  />
                  <v-list-item
                    title="Google"
                    :prepend-avatar="'/google-icon.svg'"
                  />
                  <v-list-item
                    title="Google"
                    :prepend-avatar="'/google-icon.svg'"
                  />
                </v-list>
              </v-col>
              <v-divider vertical />
              <v-col cols="6">
                <p class="text-h6 text-center font-weight-medium">
                  Top Feedbacks
                </p>
                <!-- <v-divider class="my-3" /> -->
                <v-list lines="two" class="background-cards">
                  <v-list-item
                    title="Google"
                    :prepend-avatar="'/google-icon.svg'"
                  />
                  <v-list-item
                    title="Google"
                    :prepend-avatar="'/google-icon.svg'"
                  />
                  <v-list-item
                    title="Google"
                    :prepend-avatar="'/google-icon.svg'"
                  />
                </v-list>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { useDisplay } from "vuetify";

const { smAndDown } = useDisplay();

const selectedOption = ref("daily");

const series = ref([
  {
    name: "series1",
    data: [10, 20, 23, 15],
  },
  {
    name: "series2",
    data: [13, 16, 24, 19],
  },
]);

const chartOptions = ref({
  chart: {
    type: "area",
    toolbar: {
      show: false,
    },
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350,
      },
    },
  },
  colors: ["#025864", "#56AB87"],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },
  xaxis: {
    type: "datetime",
    categories: [
      "2018-09-19T00:00:00.000Z",
      "2018-09-19T01:30:00.000Z",
      "2018-09-19T02:30:00.000Z",
      "2018-09-19T03:30:00.000Z",
      // "2018-09-19T04:30:00.000Z",
      // "2018-09-19T05:30:00.000Z",
      // "2018-09-19T06:30:00.000Z",
    ],
  },
  grid: {
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  tooltip: {
    x: {
      format: "dd/MM/yy HH:mm",
    },
  },
});
</script>


<style lang="scss" scoped>
.background-color {
  background-color: #bbbbbb;
}
::v-deep .v-input__control {
  width: 150px;
}
::v-deep .v-divider--inset.v-divider--vertical {
  margin-top: 30px !important;
  margin-bottom: 30px !important;
}
::v-deep .v-avatar.v-avatar--size-default {
  --v-avatar-height: 30px;
}
.background-cards {
  // border: 0.5px solid #dddddd;
  background-color: #f2f2f2;
}
.background-cards-2 {
  // border: 0.5px solid #dddddd;
  background-color: #025864;
}
@media (max-width: 600px) {
  ::v-deep .v-card-item {
    padding: 2px !important;
  }
}
</style>

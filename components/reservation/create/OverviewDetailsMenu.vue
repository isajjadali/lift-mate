<template>
  <v-menu
    v-if="selectedCars.length > 0"
    v-model="toggleDialog"
    width="350"
    no-click-animation
    persistent
    :scrim="false"
    transition="dialog-bottom-transition"
    class="reservation-summary"
    scroll-strategy="none"
    :close-on-content-click="false"
  >
    <template v-slot:activator>
      <v-snackbar
        v-if="$vuetify.display.smAndUp && !toggleDialog"
        :model-value="true"
        absolute
        :timeout="-1"
        max-width="400"
        min-width="400"
        variant="flat"
        color="transparent"
        location="bottom right"
        style="bottom: 00px; right: 0px"
      >
        <v-card
          elevation="0"
          class="rounded-lg border-primary border-md pa-0"
        >
          <v-card-title
            class="d-flex align-center justify-space-between bg-primary"
          >
            <h4>Reservation Overview</h4>
            <v-btn
              variant="text"
              size="small"
              icon="mdi-chevron-up"
              @click="toggleDialog = !toggleDialog"
            />
          </v-card-title>
          <v-card-text class="mt-3">
            <div
              v-for="car in selectedCars"
              class="d-flex align-center justify-space-between ga-2"
            >
              <p class="text-subtitle-1">
                {{ car.title }} x
                {{ car.noOfCarsSelected }}
              </p>
              <div class="dynamic-line" />
              <h4>
                <shared-amount-value
                  :amount="car.price * car.noOfCarsSelected"
                />
              </h4>
            </div>
            <h2 class="d-flex align-center justify-end text-primary">
              Total: <shared-amount-value :amount="totalBill" />
            </h2>

            <p
              class="text-center text-caption text-primary cursor-pointer"
              @click="toggleDialog = !toggleDialog"
            >
              Click to view complete details.
            </p>
          </v-card-text>
        </v-card>
      </v-snackbar>
    </template>

    <!-- height="calc(100vh - 64px - 80px - 75px)" -->
    <v-card
      elevation="0"
      class="details-card border-md border-primary rounded-lg"
      color="white"
    >
      <v-card-title
        class="d-flex align-center justify-space-between bg-primary py-1"
      >
        <h4>Reservation Details</h4>
        <v-btn
          variant="text"
          size="small"
          icon="mdi-chevron-down"
          @click="toggleDialog = !toggleDialog"
        />
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-row>
          <v-col
            v-if="isRoundTrip"
            cols="12"
          >
            <h3>First Trip:</h3>
          </v-col>
          <v-col
            cols="12"
            class="py-0"
          >
            <shared-custom-key-value-pair
              :title-strong="false"
              show-line-between-key-value
              :config="oneWayTripKeyValues"
            />
          </v-col>

          <!-- <surge-calculation
            :surges="surges"
            :amount="100"
            @surgesCalculation="onChangeSurge"
          /> -->

          <template v-if="isRoundTrip">
            <v-divider class="mx-4 mt-3" />
            <v-col cols="12">
              <h3>Return Trip:</h3>
            </v-col>
            <v-col
              cols="12"
              class="py-0"
            >
              <shared-custom-key-value-pair
                :title-strong="false"
                show-line-between-key-value
                :config="oneWayTripKeyValues"
              />
            </v-col>

            <!-- <surge-calculation
              :surges="returnSurges"
              :amount="roundTripPayload.sumOfTotalCars"
              @surgesCalculation="onChangeSurge"
            /> -->
          </template>
        </v-row>
      </v-card-text>
      <v-card-actions class="elevation-7">
        <v-col
          cols="12"
          class="py-0 total-bill-container"
        >
          <div
            @blur="
              $emit('totalBill', {
                totalBill: totalBill,
              })
            "
            class="d-flex justify-space-between w-100"
          >
            <h3>Total Bill:</h3>
            <h3>
              <shared-amount-value :amount="totalBill" />
            </h3>
          </div>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script setup>
import store from '@/stores';
import CustomSpan from '~/components/shared/CustomSpan.vue';

const $store = store();
const $emits = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  payload: {
    type: Object,
    default: () => {},
  },
  discounts: {
    type: Array,
    default: () => [],
  },
  surges: {
    type: Array,
    default: () => [],
  },
  totalExtraStopCharges: {
    type: Number,
    default: () => 40,
  },
  totalReturnExtraStopCharges: {
    type: Number,
    default: () => 40,
  },
});

const oneWayTripKeyValues = computed(() => [
  {
    title: 'Amount',
    type: 'amount',
    value: 200,
  },
  // {
  //   title: 'Discount',
  //   type: 'amount',
  //   containerProps: {
  //     class: 'text-primary font-weight-bold',
  //   },
  //   value: 200,
  // },
  // {
  //   title: 'Discounted Amount',
  //   type: 'amount',
  //   value: 200,
  // },
  // {
  //   title: 'Extra Stop Charges',
  //   type: 'amount',
  //   value: 40,
  // },
  {
    title: 'Gratuity',
    type: 'amount',
    value: 30,
  },
  {
    title: 'Meet And Greet Charges',
    type: 'amount',
    value: 20,
  },
  // {
  //   title: 'Addons',
  //   container: CustomSpan,
  //   containerProps: {
  //     helpText: 'testing addon abc',
  //   },
  //   type: 'amount',
  //   value: 20,
  // },
  {
    title: 'Bill',
    hide: !isRoundTrip.value,
    container: 'h3',
    // textSize: 'text-h6',
    style: {
      fontWeight: 'bold',
    },
    type: 'amount',
    value: 200,
  },
]);
const toggleDialog = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    $emits('update:modelValue', val);
  },
});
const selectedCars = computed(() => {
  return $store.cars
    .map((car) => {
      const selectedCar = props.payload.step2.selectedCarsMap[car.id];
      return selectedCar
        ? {
            ...car,
            ...selectedCar,
          }
        : null;
    })
    .filter((car) => !!car);
});
const totalBill = computed(() => {
  return selectedCars.value.reduce(
    (acc, car) => acc + car.price * car.noOfCarsSelected,
    0
  );
});
const isRoundTrip = computed(() => props.payload.step1.isRoundTrip);
</script>

<style lang="scss">
.reservation-summary {
  .v-overlay__content {
    right: 20px !important;
    // bottom: 95px;
    bottom: 20px;
  }

  .details-card {
    overflow-y: hidden !important;

    .v-card-text {
      overflow-y: auto;
      // height: calc(100vh - 64px - 80px - 40px);
      max-height: calc(100vh - 64px - 80px - 40px);

      .key-value {
        margin-bottom: 8px;

        > .dynamic-component {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }
        .custom-span > div {
          width: 100%;
          display: flex;
          justify-content: end;
        }
      }

      .total-bill-container {
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }
  }
}

.dynamic-line {
  flex-grow: 1;
  height: 10px;
  margin: 0 6px;
  border-bottom: 2px dotted #000;
}
</style>

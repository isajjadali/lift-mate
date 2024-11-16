<template>
  <v-card
    v-for="(car, index) in cars"
    :key="index"
    class="car-card rounded-lg border-md py-3 mb-2"
    :class="{ 'border-primary': car.isSelected }"
    flat
  >
    <v-card-text>
      <v-row>
        <v-col
          cols="4"
          class="py-0"
        >
          <v-carousel
            height="110"
            color="primary"
            cycle
            interval="2800"
            :show-arrows="false"
            hide-delimiters
          >
            <v-carousel-item
              v-for="(carImage, i) in car.images"
              :key="i"
              class="car-image"
            >
              <v-img
                height="110"
                contain
                :src="`${$config.public.s3Url}/${carImage}`"
              />
            </v-carousel-item>
          </v-carousel>
        </v-col>
        <v-col
          cols="4"
          class="py-0 px-5"
        >
          <h2 style="align-items: center">{{ car.title }}</h2>
          <p class="text-subtitle-2">
            Most popular - Mercedes-Benz E-Class or similar!
          </p>
          <div class="d-flex ga-3 mt-4">
            <p>
              <v-icon
                color="primary"
                size="small"
                icon="mdi-account-multiple"
              />
              {{ car.noOfPassengers }}
            </p>
            <p>
              <v-icon
                color="primary"
                size="small"
                icon="mdi-bag-suitcase"
              />
              {{ car.maxBags }}
            </p>
          </div>
        </v-col>
        <v-col
          cols="4"
          class="d-flex flex-column align-end justify-space-between py-0 px-5"
        >
          <p class="text-h4">
            <shared-amount-value :amount="car.price" />
          </p>
          <div
            v-if="car.noOfCarsSelected >= 1"
            class="d-flex align-center"
          >
            <v-icon
              id="minus"
              variant="plain"
              color="primary"
              :ripple="false"
              flat
              size="small"
              icon="mdi-minus"
              :disabled="!car.noOfCarsSelected"
              @click="
                () =>
                  changeMultipleCarsValue(
                    car,
                    +car.noOfCarsSelected - 1
                  )
              "
            />
            <shared-custom-field
              v-model="car.noOfCarsSelected"
              id="no-of-cars"
              type="number"
              width="50"
              hide-details
              :rules="[(v) => v <= car.maxCars]"
              placeholder="0"
              density="compact"
              class="num-of-cars-field mx-1"
              @update:modelValue="() => mutipleCarsValueChanged(car)"
            />
            <v-icon
              id="plus"
              variant="plain"
              color="primary"
              :ripple="false"
              flat
              size="small"
              icon="mdi-plus"
              :disabled="car.maxCars <= car.noOfCarsSelected"
              @click="
                () =>
                  changeMultipleCarsValue(
                    car,
                    +car.noOfCarsSelected + 1
                  )
              "
            />
          </div>
          <div
            v-else
            class="d-flex"
          >
            <shared-custom-btn
              id="add-car"
              rounded="lg"
              flat
              max-height="40"
              variant="elevated"
              class="mt-auto"
              @click="() => addCarInPayload(car)"
            >
              {{ car.isSelected ? 'Deselect' : 'Select' }}
            </shared-custom-btn>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="car.error">
        <v-col
          cols="12"
          class="pt-0 d-flex justify-center"
        >
          <p
            v-html="car.error"
            class="text-error"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import store from '@/stores';

const $store = store();
const props = defineProps({
  reservationPayload: {
    type: Object,
    default: () => {},
  },
});

const carsImages = [
  '1000002872-removebg-preview.png',
  '1000002875-removebg-preview.png',
  '1000003204-removebg-preview.png',
];
const cars = computed(() => {
  return $store.cars.map((car) => {
    const selectedCar =
      props.reservationPayload.step2.selectedCarsMap[car.id];
    car.isSelected = false;
    if (selectedCar) {
      car.isSelected = true;
      car.noOfCarsSelected = selectedCar.noOfCarsSelected;
    }
    return car;
  });
});

const addCarInPayload = (car) => {
  car.isSelected = true;
  car.noOfCarsSelected = 1;

  props.reservationPayload.step2.selectedCarsMap[car.id] = {
    carId: car.id,
    noOfCarsSelected: 1,
  };
};
const changeMultipleCarsValue = (car, value) => {
  if (+value === 0) car.isSelected = false;
  car.noOfCarsSelected = +value;
  mutipleCarsValueChanged(car);
};
const mutipleCarsValueChanged = (car) => {
  if (!+car.noOfCarsSelected) {
    car.isSelected = false;
    delete props.reservationPayload.step2.selectedCarsMap[car.id];
    return;
  }
  if (car.noOfCarsSelected > car.maxCars) {
    car.error = `Cars selected should not exceed limit: <strong>${car.maxCars}</strong>`;
    return;
  }
  car.error = null;
  const selectedCar =
    props.reservationPayload.step2.selectedCarsMap[car.id];
  selectedCar.noOfCarsSelected = car.noOfCarsSelected;
};

const validateStep = async () => {
  return true;
};

defineExpose({
  validateStep,
});
</script>

<style lang="scss">
// .car-card {
//   border-bottom: 0 !important;
//   border-radius: 0 !important;
// }
// .car-card:first-child {
//   border-radius: 12px 12px 0 0 !important;
// }
// .car-card:last-child {
//   border-radius: 0 0 12px 12px !important;
//   border-bottom: 1px solid
//     rgba(var(--v-border-color), var(--v-border-opacity)) !important;
// }

.car-image {
  .v-responsive__content {
    display: flex !important;
    align-items: center !important;
  }
}

.num-of-cars-field {
  .v-text-field {
    .v-field {
      --v-input-control-height: 20px !important;
    }
  }
}
</style>

<template>
  <v-row
    class="mx-16"
    justify="center"
  >
    <v-col cols="12">
      <v-stepper
        v-model="currentStep"
        flat
        bg-color="transparent"
      >
        <v-stepper-header>
          <template
            v-for="(step, index) in steps"
            :key="`${index + 1}-step`"
          >
            <v-stepper-item
              :complete="currentStep > index + 1"
              :value="index + 1"
              color="primary"
              density="compact"
            >
              {{ step.title }}
            </v-stepper-item>
            <v-divider
              v-if="index + 1 !== steps.length"
              :key="index + 1"
            />
          </template>
        </v-stepper-header>

        <v-stepper-window>
          <v-row justify="center">
            <v-col cols="8">
              <v-stepper-window-item
                key="content-1"
                :value="1"
              >
                <reservation-create-stepper1
                  ref="stepper-1"
                  :payload="reservationPayload"
                />
              </v-stepper-window-item>
              <v-stepper-window-item
                key="content-2"
                :value="2"
              >
                <reservation-create-stepper2 />
              </v-stepper-window-item>
              <v-stepper-window-item
                key="content-3"
                :value="3"
              >
                <reservation-create-stepper3 />
              </v-stepper-window-item>
              <v-stepper-window-item
                key="content-4"
                :value="4"
              >
                <reservation-create-stepper4 />
              </v-stepper-window-item>
            </v-col>
          </v-row>
        </v-stepper-window>
      </v-stepper>
    </v-col>
  </v-row>
  <div class="create-page-footer bg-white elevation-4 pt-4">
    <v-row
      class="mx-16 pb-5"
      style="justify-self: center"
      justify="center"
    >
      <v-col
        cols="4"
        class="pr-1"
      >
        <shared-custom-btn
          id="back-btn"
          flat
          block
          height="50"
          variant="outlined"
          rounded="lg"
          @click="currentStep -= 1"
        >
          Back
        </shared-custom-btn>
      </v-col>
      <v-col
        cols="4"
        class="pl-1"
      >
        <shared-custom-btn
          id="continue-btn"
          flat
          block
          height="50"
          rounded="lg"
          @click="onNext"
        >
          Continue
        </shared-custom-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { useTemplateRef } from 'vue';
import ReservationCreateStepper1 from '~/components/reservation/create/Stepper1.vue';

const reservationPayload = ref({});
const currentStep = ref(1);
const stepper1Ref = useTemplateRef('stepper-1');
const steps = ref([
  {
    title: 'Trip Details',
    valid: true,
    icon: 'mdi-map-marker-radius',
  },
  {
    title: 'Choose Your Ride',
    valid: false,
    icon: 'mdi-car-sports',
  },
  {
    title: 'Passenger Information',
    valid: false,
    icon: 'mdi-account-details',
  },
  {
    title: 'Payment & Confirmation',
    valid: false,
    icon: 'mdi-credit-card',
    icon: 'mdi-cash-check',
  },
]);

const validateSteps = async () => {
  let valid = await stepper1Ref.value.oneWayTripForm.validate();
  if (reservationPayload.value.isRoundTrip) {
    valid = await stepper1Ref.value.roundTripForm?.validate();
  }

  return valid;
};

const onNext = async () => {
  // const valid = await validateSteps();
  // console.log(valid, 'valid');
  currentStep.value += 1;
};
</script>

<style lang="scss" scoped>
.v-stepper-header {
  box-shadow: none;
}

.create-page-footer {
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;

  > .v-row {
    width: 65%;
  }
}
</style>

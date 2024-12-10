<template>
  <v-container>
    <v-row justify="center">
      <v-col
        cols="12"
        md="11"
      >
        <v-stepper
          v-model="currentStep"
          class="reservation-create-steppers"
          flat
          bg-color="transparent"
        >
          <v-stepper-header
            :class="{
              'd-flex flex-wrap overflow-x-hidden':
                $vuetify.display.xs,
            }"
          >
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

          <reservation-create-info-header
            :reservation-payload="reservationPayload"
            :is-round-trip="reservationPayload.step1.isRoundTrip"
            :loading="calculatingMiles"
          />

          <v-row justify="center">
            <v-col
              cols="12"
              sm="10"
              md="8"
              xl="7"
            >
              <v-stepper-window class="ma-0">
                <v-stepper-window-item
                  v-for="(step, index) in steps"
                  :key="`content-${index + 1}`"
                  :value="index + 1"
                  class="mb-6"
                  :class="{
                    'px-14': $vuetify.display.smAndUp,
                    'px-4': $vuetify.display.xs,
                  }"
                >
                  <keep-alive>
                    <component
                      :is="step.component"
                      :ref="stepRefs[index]"
                      :reservation-payload="reservationPayload"
                    />
                  </keep-alive>
                </v-stepper-window-item>
              </v-stepper-window>
              <!-- <v-stepper-window-item
                  key="content-1"
                  :value="1"
                >
                  <reservation-create-stepper1
                    :ref="stepRefs[0]"
                    :set-alert-modal-config="setAlertModalConfig"
                    :reservation-payload="reservationPayload"
                  />
                </v-stepper-window-item>
                <v-stepper-window-item
                  key="content-2"
                  :value="2"
                >
                  <reservation-create-stepper2
                    :ref="stepRefs[1]"
                    :reservation-payload="reservationPayload"
                  />
                </v-stepper-window-item>
                <v-stepper-window-item
                  key="content-3"
                  :value="3"
                >
                  <reservation-create-stepper3 :ref="stepRefs[2]" />
                </v-stepper-window-item>
                <v-stepper-window-item
                  key="content-4"
                  :value="4"
                >
                  <reservation-create-stepper4 :ref="stepRefs[3]" />
                </v-stepper-window-item>
                <v-stepper-window-item
                  key="content-5"
                  :value="5"
                >
                  <reservation-create-stepper5 :ref="stepRefs[4]" />
                </v-stepper-window-item> -->
            </v-col>
          </v-row>
        </v-stepper>
      </v-col>
    </v-row>
    <div
      class="create-page-footer bg-white elevation-4 pt-4"
      :class="{ 'px-4': $vuetify.display.xs }"
    >
      <v-row
        class="mx-16 pb-5"
        :class="{ 'w-100': $vuetify.display.xs }"
        justify="center"
      >
        <v-col
          cols="6"
          md="4"
          sm="4"
          class="pr-1"
        >
          <shared-custom-btn
            id="back-btn"
            flat
            block
            height="50"
            size="large"
            variant="outlined"
            rounded="lg"
            @click="onBack"
          >
            Back
          </shared-custom-btn>
        </v-col>
        <v-col
          cols="6"
          md="4"
          sm="4"
          class="pl-1"
        >
          <shared-custom-btn
            id="continue-btn"
            flat
            block
            height="50"
            size="large"
            rounded="lg"
            :disabled="currentStep === 5"
            @click="onNext"
          >
            {{ continueBtnText }}
          </shared-custom-btn>
        </v-col>
      </v-row>
    </div>

    <!-- <modals-alert-modal
      :open="showAlertModal"
      v-bind="{ ...alertModalProps }"
      @update:modelValue="(v) => (showAlertModal = v)"
      @close="showAlertModal = false"
    /> -->

    <reservation-create-overview-details-menu
      v-if="currentStep >= 2"
      v-model="openReservationSummary"
      :payload="reservationPayload"
    />
  </v-container>
</template>

<script setup>
import moment from 'moment';
import _ from 'lodash';
import ModalsAlertModal from '~/shared/modals/AlertModal.vue';

const DEFAULT_PAYLOAD = {
  step1: {
    pickupLocation: null,
    dropOffLocation: null,
    pickupDate: moment().format('MM-DD-YY'),
    pickupTime: moment().format('hh:mm a'),
    miles: null,
    isRoundTrip: false,
    roundTripDate: null,
    extraStops: [],
    returnExtraStops: [],
    roundTripTime: null,
  },
  step2: {
    selectedCarsMap: {},
  },
  step3: {
    flightNumber: '123',
  },
  step4: {},
};

const { $localStorage } = useNuxtApp();
const reservationPayload = ref(DEFAULT_PAYLOAD);
const openReservationSummary = ref(false);
const alertModalProps = ref({});
const showAlertModal = ref(false);
const calculatingMiles = ref(false);
const currentStep = ref(1);
const stepRefs = ref([]);
const steps = ref([
  {
    title: 'Trip Details',
    valid: true,
    icon: 'mdi-map-marker-radius',
    ref: null,
    component: shallowRef(
      resolveComponent('ReservationCreateStepper1')
    ),
  },
  {
    title: 'Choose Your Ride',
    valid: false,
    icon: 'mdi-car-sports',
    ref: null,
    component: shallowRef(
      resolveComponent('ReservationCreateStepper2')
    ),
  },
  {
    title: 'Passenger Information',
    valid: false,
    icon: 'mdi-account-details',
    ref: null,
    component: shallowRef(
      resolveComponent('ReservationCreateStepper3')
    ),
  },
  {
    title: 'More Information',
    valid: false,
    icon: 'mdi-cash-check',
    ref: null,
    component: shallowRef(
      resolveComponent('ReservationCreateStepper4')
    ),
  },
  {
    title: 'Payment & Confirmation',
    valid: false,
    icon: 'mdi-credit-card',
    icon: 'mdi-cash-check',
    ref: null,
    component: shallowRef(
      resolveComponent('ReservationCreateStepper5')
    ),
  },
]);
const previousPayload = ref({});

const continueBtnText = computed(() => {
  return currentStep.value === 5
    ? 'Continue'
    : 'Continue';
});

const setAlertModalConfig = ({ toggle, ...config }) => {
  showAlertModal.value = toggle;
  alertModalProps.value = config || {};
};
const validateSteps = async () => {
  if (currentStep.value === 5) {
    return;
  }
  const stepperRef = stepRefs.value[currentStep.value - 1];
  const valid = await stepperRef.value[0]?.validateStep();
  return valid;
};
const onNext = async () => {
  const valid = await validateSteps();
  console.log(valid, 'valid');
  if (valid) {
    currentStep.value += 1;
  }
};
const onBack = async () => {
  if (currentStep.value === 1) return;
  currentStep.value -= 1;
};
const setPayloadOnLocalStorage = () => {
  $localStorage.setItem(
    'payload',
    JSON.stringify(reservationPayload.value)
  );
};
const loadPayloadFromLocalStorage = () => {
  reservationPayload.value = JSON.parse(
    $localStorage.getItem('payload') ||
      JSON.stringify(DEFAULT_PAYLOAD)
  );
};

watch(
  () => reservationPayload.value,
  async (newValue) => {
    setPayloadOnLocalStorage();

    const { pickupLocation, dropOffLocation, isRoundTrip } =
      newValue.step1;
    const {
      pickupLocation: previousPickup,
      dropOffLocation: previousDropOff,
      isRoundTrip: previousIsRoundTrip,
    } = previousPayload.value.step1 || {};

    if (
      pickupLocation &&
      dropOffLocation &&
      (isRoundTrip !== previousIsRoundTrip ||
        pickupLocation !== previousPickup ||
        dropOffLocation !== previousDropOff)
    ) {
      calculatingMiles.value = true;
      await calculateAndSetDistanceInMilesOnPayload(newValue);
      calculatingMiles.value = false;
    }
    previousPayload.value = _.cloneDeep(newValue || {});
  },
  { deep: true }
);

onMounted(() => {
  steps.value.forEach(() => {
    stepRefs.value.push(ref(null));
  });

  loadPayloadFromLocalStorage();
});
</script>

<style lang="scss">
.reservation-create-steppers {
  margin-bottom: 130px;
  .v-stepper-header {
    box-shadow: none;
  }
}
.create-page-footer {
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;

  > .v-row {
    width: 65%;
    justify-self: center;
  }
}
</style>

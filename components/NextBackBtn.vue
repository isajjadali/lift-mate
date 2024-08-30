<template>
  <div>
    <shared-custom-btn
      v-if="isBackBtnVisible"
      id="reservation-step-back"
      color="primary"
      @click="$emit('onBack')"
    >
      <v-icon class="mr-2">
        mdi-arrow-left-bold
      </v-icon>
      Back
    </shared-custom-btn>
    <shared-custom-btn
      v-if="isNextBtnVisible"
      id="reservation-step-forward"
      class="float-right"
      color="primary"
      :disabled="isNextBtnDisabled"
      @click="$emit('onNext')"
    >
      Next
      <v-icon class="ml-2">
        mdi-arrow-right-bold
      </v-icon>
    </shared-custom-btn>
    <shared-custom-btn
      v-if="isProceedBtnVisible"
      id="proceed-to-reservation"
      color="primary"
      class="float-right"
      @click="$emit('onProceed')"
    >
      Proceed To Reservation
    </shared-custom-btn>
    <div>
      <strong class="float-right text-red mt-2">{{ error }}</strong>
    </div>
  </div>
</template>

<script>
export default {
    name: 'NextBackBtn',
    props: {
        error: {
            type: String,
            default: '',
        },
        isBackBtnVisible: {
            type: Boolean,
            default: false,
        },
        isNextBtnVisible: {
            type: Boolean,
            default: false,
        },
        isProceedBtnVisible: {
            type: Boolean,
            default: false,
        },
        isNextBtnDisabled: {
            type: Boolean,
            default: false,
        },
    },
};
</script>

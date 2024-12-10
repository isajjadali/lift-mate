<template>
  <v-row justify="center">
    <v-col cols="12">
      <h2>Add Credit Card</h2>
    </v-col>
    <v-col cols="12">
      <v-card
        elevation="0"
        class="border-md rounded-lg"
      >
        <v-card-text>
          <generic-form
            prevent-deep-clone
            :data="cardPayload"
            :fields-config="cardFieldsConfig"
            :btns="{}"
          />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <h2>Pay with</h2>
    </v-col>
    <v-col
      cols="10"
      xl="8"
      md="8"
      sm="8"
    >
      <shared-custom-btn
        id="paypal-btn"
        block
        size="large"
        rounded="lg"
        color="#ffc539"
        class="paypal-button font-italic font-weight-black"
      >
        <v-img
          :src="paypal"
          max-width="30"
          min-width="30"
        />
        <span class="text-checkout mr-1">Checkout with </span>
        <span class="text-pay">Pay</span>
        <span class="text-pal">Pal</span>
      </shared-custom-btn>
    </v-col>
    <v-col
      cols="12"
      class="py-0 d-flex justify-center"
    >
      <strong>OR</strong>
    </v-col>
    <v-col
      cols="10"
      xl="8"
      md="8"
      sm="8"
    >
      <shared-custom-btn
        id="stripe-btn"
        block
        size="large"
        rounded="lg"
        height="45"
        color="#403c67"
        append-icon="mdi-chevron-right"
      >
        Checkout with Stripe
      </shared-custom-btn>
    </v-col>
  </v-row>
</template>

<script setup>
import { MDI_ICONS } from '~/enums';
import paypal from '~/public/paypal.svg';
import GenericForm from '~/shared/forms/GenericForm.vue';

const cardPayload = ref({});

const cardFieldsConfig = ref([
  {
    id: 'cardHolderName',
    vModel: 'cardHolderName',
    name: 'cardHolderName',
    label: 'Card Holder Name',
    cols: 12,
    required: true,
    'prepend-inner-icon': MDI_ICONS.username,
  },
  {
    id: 'cardNumber',
    vModel: 'cardNumber',
    name: 'cardNumber',
    label: 'Card Number',
    type: 'mask',
    mask: '#### #### #### ####',
    placeholder: 'xxxx xxxx xxxx xxxx',
    rules: [
      (v) => !!v || 'Card Number is required',
      (v) => v.length >= 19 || 'Card Number is not valid',
    ],
    cols: 12,
    required: true,
    'prepend-inner-icon': MDI_ICONS.username,
  },
  {
    id: 'expiryDate',
    vModel: 'expiryDate',
    name: 'expiryDate',
    label: 'Expiry Date',
    placeholder: 'MM / YY',
    type: 'mask',
    mask: '## / ##',
    cols: 12,
    md: 6,
    xl: 6,
    required: true,
    'prepend-inner-icon': MDI_ICONS.username,
  },
  {
    id: 'cvc',
    vModel: 'cvc',
    name: 'cvc',
    label: 'CVC',
    type: 'mask',
    placeholder: 'xxx',
    mask: '###',
    cols: 12,
    md: 6,
    xl: 6,
    required: true,
    'prepend-inner-icon': MDI_ICONS.username,
  },
]);
</script>

<style lang="scss">
.paypal-button {
  position: relative;
  overflow: hidden;

  .v-btn__content {
    .text-checkout {
      opacity: 0;
      width: 0;
      color: #003187 !important;
      visibility: hidden;
      transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
      transition: width 0s ease-in-out, transform 0.3s ease-in-out;
      transform: translateX(50%);
    }

    .text-pay {
      color: #003187 !important;
    }

    .text-pal {
      color: #009cdf !important;
    }
  }
}

.paypal-button:hover {
  .text-checkout {
    opacity: 1;
    width: auto;
    visibility: visible;
    transform: translateX(0);
  }
}
</style>

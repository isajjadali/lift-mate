<template>
  <v-row>
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
            :btns="{}"
            :fields-config="cardFieldsConfig"
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import GenericForm from '~/shared/forms/GenericForm.vue';

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
    cols: 12,
    required: true,
    'prepend-inner-icon': MDI_ICONS.username,
  },
  {
    id: 'expiryDate',
    vModel: 'expiryDate',
    name: 'expiryDate',
    label: 'Expiry Date',
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
    cols: 12,
    md: 6,
    xl: 6,
    required: true,
    'prepend-inner-icon': MDI_ICONS.username,
  },
]);
</script>

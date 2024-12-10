<template>
  <v-row>
    <v-col
      cols="12"
      class="px-0"
    >
      <h2>Who Are You Booking For?</h2>
    </v-col>
    <v-col
      cols="12"
      class="border-md rounded-lg"
    >
      <v-radio-group
        v-model="bookForMyself"
        hide-details
        color="primary"
      >
        <v-radio
          label="Book for myself"
          :value="true"
        ></v-radio>
        <v-radio
          label="Book for someone else"
          :value="false"
        ></v-radio>
      </v-radio-group>
    </v-col>
    <v-col
      v-if="!bookForMyself"
      cols="12"
      class="border-md rounded-lg px-5 pb-5 mt-3"
    >
      <generic-form
        ref="userDetailsFormRef"
        :btns="[]"
        :data="reservationPayload.step3"
        :fields-config="userInfoFieldsConfig"
      />
    </v-col>
    <v-col
      cols="12"
      class="px-0"
    >
      <h2>Additional Information</h2>
      <span class="text-subtitle-2 text-grey-darken-2">
        Enter your flight number to ensure your chauffeur can track
        your flight and adjust the pickup time.
      </span>
    </v-col>
    <v-col
      cols="12"
      class="border-md rounded-lg px-5"
    >
      <generic-form
        ref="additionalInformationFormRef"
        :btns="[]"
        :data="reservationPayload.step3"
        :fields-config="additionalInfoFieldsConfig"
      />
    </v-col>
  </v-row>
</template>

<script setup>
import { MDI_ICONS } from '~/enums';
import GenericForm from '~/shared/forms/GenericForm.vue';

const props = defineProps({
  reservationPayload: {
    type: Object,
    default: {},
  },
})

const userDetailsFormRef = ref(null);
const additionalInformationFormRef = ref(null);
const bookForMyself = ref(true);
const userInfoFieldsConfig = ref([
  {
    id: 'firstName',
    vModel: 'firstName',
    name: 'firstName',
    label: 'First Name',
    cols: 12,
    md: 6,
    xl: 6,
    required: true,
    'prepend-inner-icon': MDI_ICONS.username,
  },
  {
    id: 'lastName',
    vModel: 'lastName',
    name: 'lastName',
    label: 'Last Name',
    cols: 12,
    md: 6,
    xl: 6,
    'prepend-inner-icon': MDI_ICONS.username,
  },
  {
    id: 'email',
    vModel: 'email',
    name: 'email',
    label: 'Email',
    type: 'email',
    cols: 12,
    required: true,
    'prepend-inner-icon': MDI_ICONS.marker,
  },
  {
    id: 'phoneNumber',
    vModel: 'phoneNumber',
    name: 'phoneNumber',
    label: 'Phone Number',
    type: 'phoneNumber',
    required: true,
    cols: 12,
  },
]);

const additionalInfoFieldsConfig = ref([
  {
    id: 'flightNumber',
    vModel: 'flightNumber',
    name: 'flightNumber',
    label: 'Flight Number',
    rows: '3',
    required: true,
    cols: 12,
  },
  {
    id: 'pickupSign',
    vModel: 'pickupSign',
    name: 'pickupSign',
    label: 'Pickup Sign',
    hint: "It will appear on your chauffeur's pickup sign when they meet you.",
    persistentHint: true,
    cols: 12,
  },
  {
    id: 'comments',
    vModel: 'comments',
    name: 'comments',
    label: 'Comments',
    type: 'textarea',
    rows: '3',
    cols: 12,
  },
]);

const validateStep = async () => {
  const valid = await additionalInformationFormRef.value.validate();
  if (userDetailsFormRef.value) {
    return (await userDetailsFormRef.value.validate()) && valid;
  }
  return valid;
};

defineExpose({
  validateStep,
});
</script>

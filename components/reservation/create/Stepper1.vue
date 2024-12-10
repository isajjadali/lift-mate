<template>
  <generic-form
    ref="oneWayTripForm"
    :fields-config="fieldsConfig"
    :data="reservationPayload.step1"
    prevent-deep-clone
    :btns="{}"
  />
  <v-checkbox
    v-model="reservationPayload.step1.isRoundTrip"
    color="primary"
    class="mt-3"
    hide-details
    :disabled="!oneWayTripForm?.valid"
    label="Round Trip"
  />
  <generic-form
    ref="roundTripForm"
    v-if="reservationPayload.step1.isRoundTrip"
    :data="reservationPayload.step1"
    :fields-config="roundTripFieldsConfig"
    prevent-deep-clone
    :btns="{}"
  />
</template>

<script setup>
import { MDI_ICONS } from '~/enums';
import GenericForm from '~/shared/forms/GenericForm.vue';
import _ from 'lodash';

const props = defineProps({
  reservationPayload: {
    type: Object,
    default: () => {},
  },
  setAlertModalConfig: {
    type: Function,
    default: () => {},
  },
});

const oneWayTripForm = ref(null);
const roundTripForm = ref(null);
const fieldsConfig = ref([
  {
    id: 'pickupLocation',
    vModel: 'pickupLocation',
    name: 'pickupLocation',
    label: 'Pickup Location',
    placeholder: 'Address. airport, hotel, ...',
    type: 'googlePlaceDropDown',
    cols: 12,
    required: true,
    'prepend-inner-icon': MDI_ICONS.marker,
  },
  {
    id: 'dropOffLocation',
    vModel: 'dropOffLocation',
    name: 'dropOffLocation',
    label: 'Drop Off Location',
    placeholder: 'Address. airport, hotel, ...',
    type: 'googlePlaceDropDown',
    cols: 12,
    required: true,
    'prepend-inner-icon': MDI_ICONS.marker,
  },
  {
    id: 'pickupDate',
    vModel: 'pickupDate',
    name: 'pickupDate',
    label: 'Date',
    type: 'datePicker',
    placeholder: 'Date',
    required: true,
    cols: 12,
  },
  {
    id: 'pickupTime',
    vModel: 'pickupTime',
    name: 'pickupTime',
    label: 'Time',
    type: 'timePicker',
    placeholder: 'Time',
    required: true,
    cols: 12,
  },
  {
    id: 'noOfPassengers',
    vModel: 'noOfPassengers',
    name: 'noOfPassengers',
    label: 'No Of Passengers',
    type: 'number',
    required: true,
    cols: 12,
  },
]);
const roundTripFieldsConfig = ref([
  {
    id: 'returnPickupLocation',
    vModel: 'dropOffLocation',
    name: 'returnPickupLocation',
    label: 'Return Pickup Location',
    placeholder: 'Address. airport, hotel, ...',
    type: 'googlePlaceDropDown',
    cols: 12,
    required: true,
    disabled: true,
    'prepend-inner-icon': MDI_ICONS.marker,
  },
  {
    id: 'returnDropOffLocation',
    vModel: 'pickupLocation',
    name: 'returnDropOffLocation',
    label: 'Return Drop Off Location',
    placeholder: 'Address. airport, hotel, ...',
    type: 'googlePlaceDropDown',
    cols: 12,
    required: true,
    disabled: true,
    'prepend-inner-icon': MDI_ICONS.marker,
  },
  {
    id: 'roundTripDate',
    vModel: 'roundTripDate',
    name: 'roundTripDate',
    label: 'Return Date',
    type: 'datePicker',
    placeholder: 'Date',
    required: true,
    cols: 12,
  },
  {
    id: 'roundTripTime',
    vModel: 'roundTripTime',
    name: 'roundTripTime',
    label: 'Return Time',
    type: 'timePicker',
    placeholder: 'Time',
    required: true,
    cols: 12,
  },
]);

const validateStep = async () => {
  const validOneWayForm = await oneWayTripForm.value.validate();
  if (roundTripForm.value) {
    return (await roundTripForm.value.validate()) && validOneWayForm;
  }
  return validOneWayForm;
};

defineExpose({
  validateStep,
});
</script>

<style lang="scss"></style>

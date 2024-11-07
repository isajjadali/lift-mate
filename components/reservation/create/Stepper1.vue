<template>
  <generic-form
    ref="oneWayTripForm"
    :fields-config="fieldsConfig"
    :btns="{}"
  />
  <v-checkbox
    v-model="props.payload.isRoundTrip"
    color="primary"
    class="mt-3"
    hide-details
    label="Round Trip"
  ></v-checkbox>
  <generic-form
    ref="roundTripForm"
    :fields-config="roundTripFieldsConfig"
    :btns="{}"
  />
</template>

<script setup>
import { MDI_ICONS } from '~/enums';
import GenericForm from '~/shared/forms/GenericForm.vue';

const props = defineProps({
  payload: {
    type: Object,
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
    vModel: 'returnPickupLocation',
    name: 'returnPickupLocation',
    label: 'Return Pickup Location',
    placeholder: 'Address. airport, hotel, ...',
    type: 'googlePlaceDropDown',
    cols: 12,
    required: true,
    'prepend-inner-icon': MDI_ICONS.marker,
  },
  {
    id: 'returnDropOffLocation',
    vModel: 'returnDropOffLocation',
    name: 'returnDropOffLocation',
    label: 'Return Drop Off Location',
    placeholder: 'Address. airport, hotel, ...',
    type: 'googlePlaceDropDown',
    cols: 12,
    required: true,
    'prepend-inner-icon': MDI_ICONS.marker,
  },
  {
    id: 'returnPickupDate',
    vModel: 'returnPickupDate',
    name: 'returnPickupDate',
    label: 'Return Date',
    type: 'datePicker',
    placeholder: 'Date',
    required: true,
    cols: 12,
  },
  {
    id: 'returnPickupTime',
    vModel: 'returnPickupTime',
    name: 'returnPickupTime',
    label: 'Return Time',
    type: 'timePicker',
    placeholder: 'Time',
    required: true,
    cols: 12,
  },
]);

const validateSteps = () => {
  console.log(oneWayTripForm.value, 'oneWayTripForm.value');
  console.log(roundTripForm.value, 'roundTripForm.value');
};

defineExpose({
  oneWayTripForm,
  roundTripForm,
});
</script>

<style lang="scss"></style>

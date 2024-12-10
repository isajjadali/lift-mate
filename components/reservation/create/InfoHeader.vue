<template>
  <v-container>
    <v-row
      v-if="
        reservationPayload?.step1?.pickupLocation ||
        reservationPayload?.step1?.dropOffLocation
      "
      justify="center"
      class="my-5"
    >
      <v-col
        cols="12"
        sm="10"
        md="7"
        xl="6"
        class="bg-grey-lighten-2 rounded-lg pa-4"
      >
        <strong>
          {{
            `${formatDate(
              reservationPayload?.step1?.pickupDate
            )} at ${reservationPayload?.step1?.pickupTime}`
          }}
        </strong>
        <div class="text-grey-darken-2 d-flex align-center">
          <shared-custom-tooltip
            id="pickup"
            icon="mdi-airplane"
            :tooltip-text="reservationPayload?.step1?.pickupLocation"
            :text="
              reservationPayload?.step1?.pickupLocation ||
              'Select Airport'
            "
            class="truncate"
            :class="{
              'opacity-50':
                !reservationPayload?.step1?.pickupLocation,
            }"
          />
          <v-icon
            icon="mdi-arrow-right"
            size="small"
            class="mx-3"
          />
          <shared-custom-tooltip
            id="dropOff"
            v-if="reservationPayload?.step1?.dropOffLocation"
            :tooltip-text="reservationPayload?.step1?.dropOffLocation"
            class="truncate"
            :text="reservationPayload?.step1?.dropOffLocation"
          />
        </div>
        <p
          class="text-grey-darken-1"
          :class="{
            'opacity-50': !milesConfig.miles,
          }"
        >
          {{ isRoundTrip ? 'First Trip' : '' }} Miles:
          <strong>{{
            milesConfig.parentMiles || milesConfig.miles || 0
          }}</strong>
          mi
        </p>
        <p
          v-if="isRoundTrip"
          class="text-grey-darken-1 d-flex flex-column"
          :class="{
            'opacity-50': !milesConfig.miles,
          }"
        >
          <span>
            Return Trip Miles:
            <strong>
              {{ milesConfig.childMiles || milesConfig.loading || 0 }}
            </strong>
            mi
          </span>
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const props = defineProps({
  reservationPayload: {
    type: Object,
    default: () => {},
  },
  loading: {
    type: Boolean,
    default: () => false,
  },
  isRoundTrip: {
    type: Boolean,
    default: () => false,
  },
});

const milesConfig = computed(() => {
  if (props.loading) return {};

  const { miles, parentMiles, childMiles } =
    props.reservationPayload.step1;

  return {
    miles: miles || 0,
    parentMiles: parentMiles || 0,
    childMiles: childMiles || 0,
  };
});
</script>

<style lang="scss">
.truncate {
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 430px) {
    max-width: 160px;
  }
}
</style>

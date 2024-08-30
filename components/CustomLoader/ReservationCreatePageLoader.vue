<template>
  <v-row justify="center">
    <v-col
      cols="12"
      sm="8"
      md="8"
    >
      <v-card class="mx-auto">
        <div class="mx-auto text-center">
          <shared-custom-loading type="createReservation" />
        </div>
      </v-card>
    </v-col>
    <v-col
      v-if="currentStep > 1"
      cols="12"
      sm="4"
      md="4"
    >
      <v-card class="mx-auto">
        <div class="mx-auto text-center">
          <shared-custom-loading type="createReservationRightSideBar" />
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
    name: 'ReservationCreatePageLoader',
    props: {
        currentStep: {
            type: Number,
            required: true,
        },
    },
};
</script>

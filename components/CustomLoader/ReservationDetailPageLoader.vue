<template>
  <v-row>
    <v-col
      cols="12"
      sm="8"
      md="8"
    >
      <v-card class="mx-auto">
        <shared-custom-loading type="reservationDetailPage" />
      </v-card>
      <v-card class="mx-auto mt-4">
        <shared-custom-loading type="reservationDetailPageDataTable" />
      </v-card>
    </v-col>

    <v-col
      cols="12"
      sm="4"
      md="4"
    >
      <v-card class="mx-auto">
        <shared-custom-loading type="reservationDetailPageRightSideBar" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
    name: 'ReservationDetailPageLoader',
};
</script>
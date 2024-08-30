<template>
  <v-row justify="center">
    <v-col
      cols="12"
      sm="8"
    >
      <v-card class="mx-auto">
        <div class="mx-auto text-center">
          <shared-custom-loading type="updateReservation" />
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>
  
<script>
export default {
    name: 'ReservationUpdatePageLoader',
};
</script>
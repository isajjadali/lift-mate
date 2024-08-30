<template>
  <crud-page :meta="metaInfo" />
</template>

<script>
  import { ReservationMeta } from '@/enums/meta/reservations.js';

  export default {
    name: 'ReservationPage',
    data: () => ({
      metaInfo: ReservationMeta,
    }),
  };
</script>

<style scoped></style>

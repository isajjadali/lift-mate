<template>
  <crud-page :meta="ReservationMeta" />
</template>

<script >
import { ReservationMeta } from '~/enums';

export default {
  name: "HomePage",
  data() {
    return {
      config: {},
      ReservationMeta,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>

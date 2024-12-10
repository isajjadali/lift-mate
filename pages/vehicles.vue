<template>
  <crud-page :meta="VehicleMeta" />
</template>

<script>
import { VehicleMeta } from "~/enums";
export default {
  name: "HomePage",
  data() {
    return {
      config: {},
      VehicleMeta,
    };
  },
};
</script>

<style lang="scss" scoped></style>

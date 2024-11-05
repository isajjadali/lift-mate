<template>
  <crud-page :meta="CarMeta" />
</template>

<script>
import { CarMeta } from "~/enums";
export default {
  name: "HomePage",
  data() {
    return {
      config: {},
      CarMeta,
    };
  },
};
</script>

<style lang="scss" scoped></style>

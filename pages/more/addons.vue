<template>
  <crud-page :meta="AddonMeta" />
</template>

<script>
import { AddonMeta } from "~/enums";
export default {
  name: "HomePage",
  data() {
    return {
      config: {},
      AddonMeta,
    };
  },
};
</script>

<style lang="scss" scoped></style>

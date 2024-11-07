<template>
  <crud-page :meta="DiscountMeta" />
</template>
  
<script >
import { DiscountMeta } from "~/enums";
export default {
  name: "HomePage",
  data() {
    return {
      config: {},
      DiscountMeta,
    };
  },
};
</script>
  
  <style lang="scss" scoped>
</style>
  
<template>
  <crud-page :meta="DiscountCodeMeta" />
</template>
  
<script >
import { DiscountCodeMeta } from "~/enums";
export default {
  name: "HomePage",
  data() {
    return {
      config: {},
      DiscountCodeMeta,
    };
  },
};
</script>
  
  <style lang="scss" scoped>
</style>
  
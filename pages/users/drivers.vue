<template>
  <crud-page :meta="DriverMeta" />
</template>
  
  <script >
import { DriverMeta } from "~/enums";
export default {
  name: "HomePage",
  data() {
    return {
      config: {},
      DriverMeta,
    };
  },
};
</script>
  
  <style lang="scss" scoped>
</style>
  
<template>
  <crud-page :meta="SurgeMeta" />
</template>
  
<script >
import { SurgeMeta } from "~/enums";
export default {
  name: "HomePage",
  data() {
    return {
      config: {},
      SurgeMeta,
    };
  },
};
</script>
  
  <style lang="scss" scoped>
</style>
  
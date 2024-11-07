<template>
  <crud-page :meta="ReservationMeta" />
</template>
  
  <script >
import { ReservationMeta } from "~/enums";
import CrudPage from "~/components/CrudPage.vue";
export default {
  components: { CrudPage },
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
  
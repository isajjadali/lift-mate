<template>
  <crud-page :meta="AddonMeta"/>
</template>

<script>
import CrudPage from '~/components/CrudPage.vue';
import { AddonMeta } from '~/enums';
  export default {
  components: { CrudPage },
    name: 'HomePage',
    data() {
      return {
        config: {},
        AddonMeta
      };
    },
  };
</script>

<style lang="scss" scoped></style>

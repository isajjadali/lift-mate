<template>
  <crud-page :meta="metaInfo" />
</template>

<script>
  import { AffiliateMeta } from '@/enums/meta/affiliates.js';

  export default {
    name: 'CarPage',
    data: () => ({
      metaInfo: AffiliateMeta,
    }),
  };
</script>

<style scoped></style>

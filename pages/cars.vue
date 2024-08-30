<template>
  <crud-page :meta="metaInfo" />
</template>

<script>
  import { CarMeta } from '@/enums/meta/cars.js';

  export default {
    name: 'CarPage',
    data: () => ({
      metaInfo: CarMeta,
    }),
  };
</script>

<style scoped></style>

<template>
  <crud-page :meta="metaInfo" />
</template>

<script>
  import { DriverMeta } from '@/enums/meta/users.js';

  export default {
    name: 'CarPage',
    data: () => ({
      metaInfo: DriverMeta,
    }),
  };
</script>

<style scoped></style>

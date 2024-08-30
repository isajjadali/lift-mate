<template>
  <crud-page :meta="metaInfo" />
</template>

<script>
  import { CustomerMeta } from '@/enums/meta/users.js';

  export default {
    name: 'CarPage',
    data: () => ({
      metaInfo: CustomerMeta,
    }),
  };
</script>

<style scoped></style>

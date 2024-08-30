<template>
  <crud-page :meta="metaInfo" />
</template>

<script>
  import { SurgeMeta } from '@/enums/meta/surges.js';

  export default {
    name: 'CarPage',
    data: () => ({
      metaInfo: SurgeMeta,
    }),
  };
</script>

<style scoped></style>

<template>
    <crud-page :meta="metaInfo" />
  </template>
  
  <script>
    import { AddonMeta } from '@/enums/meta/addons.js';
  
    export default {
      name: 'CarPage',
      data: () => ({
        metaInfo: AddonMeta,
      }),
    };
  </script>
  
  <style scoped></style>
  
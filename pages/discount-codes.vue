<template>
    <crud-page :meta="metaInfo" />
  </template>
  
  <script>
    import { DiscountCodeMeta } from '@/enums/meta/discount-codes.js';
  
    export default {
      name: 'CarPage',
      data: () => ({
        metaInfo: DiscountCodeMeta,
      }),
    };
  </script>
  
  <style scoped></style>
  
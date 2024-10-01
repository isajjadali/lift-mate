<template>
  <crud-page :meta="CustomerMeta"/>
  </template>
  
  <script >
  import { CustomerMeta } from '~/enums';
  export default {
    name: "HomePage",
    data() {
      return {
        config: {},
        CustomerMeta,
      };
    },
  };
  </script>
  
  <style lang="scss" scoped>
  </style>

  

  
  
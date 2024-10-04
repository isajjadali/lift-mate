<template>
    <crud-page :meta="CustomerMeta"/>
    </template>
    
    <script >
import { CustomerMeta } from "~/enums";
import CrudPage from '~/components/CrudPage.vue';
    export default {
      components: { CrudPage },
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
  
    
  
    
    
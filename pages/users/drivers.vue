<template>
    <crud-page :meta="DriverMeta"/>
    </template>
    
    <script >
import { DriverMeta } from "~/enums";
import CrudPage from '~/components/CrudPage.vue';
    export default {
      components: { CrudPage },
      name: "HomePage",
      data() {
        return {
          config: {},
          DriverMeta,
        };
      },
    };
    </script>
    
    <style lang="scss" scoped>
    </style>
    
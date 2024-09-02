<template>
  <nuxt-layout name="settings">
    <roles-permissions-assign-page :meta-data="RoleMeta" />
  </nuxt-layout>
</template>

<script setup>
  import { RoleMeta } from '~/enums';
</script>

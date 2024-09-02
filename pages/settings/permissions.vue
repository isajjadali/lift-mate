<template>
  <nuxt-layout name="settings">
    <roles-permissions-assign-page :meta-data="PermissionMeta" />
  </nuxt-layout>
</template>

<script setup>
  import { PermissionMeta } from '~/enums';
</script>

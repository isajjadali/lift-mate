<template>
  <nuxt-layout name="settings">
    <roles-permissions-assign-page :meta-data="UsersWithRoles" />
  </nuxt-layout>
</template>

<script setup>
  import { UsersWithRoles } from '~/enums';
</script>

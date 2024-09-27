<template>
  <v-layout class="rounded rounded-md">
    <CustomAppBar />
    <!-- Main content slot -->
    <v-main
      class="d-flex align-center justify-center"
      style="min-height: 300px; background-color: #ffffff"
    >
      <slot />
    </v-main>
  </v-layout>
</template>

<script setup>
import CustomAppBar from "@/components/CustomeAppbar.vue";F
</script>

<style scoped lang="scss">
</style>
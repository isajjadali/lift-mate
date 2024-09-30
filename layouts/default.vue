<template>
  <v-layout class="rounded rounded-md">
    <CustomAppBar />
    <!-- Main content slot -->
    <v-app
      :class="
        $vuetify.theme.global.name === 'dark'
          ? 'dark-mode'
          : 'light-mode'
      "
    >
      <v-main
        class="main-container"
        :class="[
          $vuetify.theme.global.name === 'dark'
            ? ''
            : 'grey-lighten-3',
        ]"
      >
        <div class="v-main__wrap">
          <v-container>
            <slot />
          </v-container>
        </div>
      </v-main>
    </v-app>
  </v-layout>
</template>

<script setup>
  import CustomAppBar from '@/components/CustomeAppbar.vue';
</script>

<style scoped lang="scss"></style>

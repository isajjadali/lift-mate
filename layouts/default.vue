<template>
  <v-layout class="rounded rounded-md">
    <SharedCustomAppBar />
    <!-- Main content slot -->
    <v-app
      :class="
        $vuetify.theme.global.name === 'dark' ? 'dark-mode' : 'light-mode'
      "
    >
      <v-main
        class="main-container"
        :class="[$vuetify.theme.global.name === 'dark' ? '' : 'grey-lighten-3']"
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
import { inject } from "vue";

const fluid = inject("fluid", false);
console.log(fluid, "sda");
</script>

<style scoped lang="scss"></style>

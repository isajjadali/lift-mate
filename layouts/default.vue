<template>
  <v-app :class="isDarkMode ? 'dark-mode' : 'light-mode'">
    <shared-custom-app-bar />
    <v-main
      ref="mainContainer"
      class="main-container"
      :class="[isDarkMode ? '' : 'grey-lighten-3']"
    >
      <slot />
      <app-footer v-if="!$store.user?.isAdmin" />
    </v-main>
  </v-app>
</template>

<script script></script>

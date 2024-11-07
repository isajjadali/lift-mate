<template>
  <v-row class="mt-4">
    <v-col cols="3" class="pr-0">
      <v-card elevation="0">
        <h2 class="mx-5 font-weight-medium">Settings</h2>
        <v-card-text>
          <v-list dense>
            <template v-for="(item, i) in linkLists" :key="i">
              <v-list-item :to="item.path" link rounded="lg" class="my-1">
                <template v-slot:prepend>
                  <v-icon :icon="item.icon"></v-icon>
                </template>
                <v-list-item-title class="text-capitalize">
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="9" class="pr-8">
      <slot />
    </v-col>
  </v-row>
</template>
  
<script setup>
import { provide } from "vue";

provide("fluid", true);

const linkLists = [
  {
    title: "Profile Info",
    icon: "mdi-account-outline",
    path: "/settings/1/profile-info",
  },
  {
    title: "Change Email",
    icon: "mdi-email-outline",
    path: "/settings/1/change-email",
  },
  {
    title: "Change Password",
    icon: "mdi-lock-outline",
    path: "/settings/1/change-password",
  },
  {
    title: "User Attachments",
    icon: "mdi-attachment",
    path: "/settings/1/user-attachments",
  },
  {
    title: "User Reservations ",
    icon: "mdi-plane-car",
    path: "/settings/1/user-reservations",
  },
];
</script>


<style scoped>
</style>
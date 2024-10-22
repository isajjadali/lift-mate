<template>
  <v-container fluid>
    <v-row>
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
        <router-view />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const linkLists = [
  {
    title: "Profile Info",
    icon: "mdi-account-outline",
    path: "/users/1/profile-info",
  },
  {
    title: "Change Email",
    icon: "mdi-email-outline",
    path: "/users/1/change-email",
  },
  {
    title: "Change Password",
    icon: "mdi-lock-outline",
    path: "/users/1/change-password",
  },
  {
    title: "User Attachemnts",
    icon: "mdi-attachment",
    path: "/users/1/user-attachments",
  },
  {
    title: "User Reservations ",
    icon: "mdi-plane-car",
    path: "/users/1/user-reservations",
  },
];
</script>

<style scoped>
::v-deep .v-list-item__spacer {
  width: 15px !important;
}
</style>
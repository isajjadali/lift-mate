<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar elevation="0"></v-app-bar>

    <v-main
      class="d-flex align-center justify-center"
      style="min-height: 300px; background-color: #ffffff"
    >
      <slot />
    </v-main>
  </v-layout>
</template>

<script setup>
const selectedItem = ref([]);
const groupSelectedItem = ref([]);
const sidebarLinks = [
  {
    name: "Dashboard",
    link: "/dashboard",
    icon: "mdi-view-dashboard",
    children: [],
  },
  {
    name: "Reservation",
    link: "/reservation",
    icon: "mdi-car-hatchback",
    children: [],
  },
  {
    name: "Drivers",
    link: "/drivers",
    icon: "mdi-account-group",
    children: [],
  },
  {
    name: "Customers",
    link: "/customers",
    icon: "mdi-account-circle",
    children: [],
  },
  {
    name: "Vehicles",
    link: "/vehicles",
    icon: "mdi-car-electric",
    children: [],
  },
  {
    name: "Addons",
    link: "/addons",
    icon: "mdi-plus-thick",
    children: [],
  },
  {
    name: "Discount",
    link: "/discount",
    icon: "mdi-percent",
    children: [],
  },
  {
    name: "Surges",
    link: "/surges",
    icon: "mdi-currency-usd",
    children: [],
  },
  {
    name: "Static Page Editor",
    link: "/static-page-editor",
    icon: "mdi-file-document-outline",
    children: [],
  },
];

const sidebarLinks2 = [
  {
    name: "Settings",
    link: "/settings",
    icon: "mdi-cog",
    children: [],
  },
  // {
  //   name: "Help",
  //   link: "/help",
  //   icon: "mdi-help-circle",
  //   children: [],
  // },
  {
    name: "Logout",
    link: "/logout",
    icon: "mdi-logout",
    children: [],
  },
];
function getLinkClass(subLink) {
  return "selected-child";
}

const getRoute = (link, name) => {
  console.log(link, name);
  return { link, name };
};
</script>

<style scoped lang="scss">
.navigation-drawer {
  border: none !important;
}

.sub-links-wrapper {
  border-left: 1px dotted #ffffff;
}

.active {
  background: #025864 !important;
  color: white !important;
}

.sub-link {
  text-decoration: none;
  font-size: small;

  .selected-child {
    font-weight: bolder;
  }
}
</style>
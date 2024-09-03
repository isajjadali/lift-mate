<template>
  <v-layout class="rounded rounded-md">
    <v-navigation-drawer
      class="pt-8 navigation-drawer"
      elevation="4"
      style="background-color: #ffffff"
      rounded="lg"
      width="250"
    >
      <div class="d-flex align-center mx-4 mt-3">
        <v-btn class="ma-2" color="primary" icon="mdi-car" size="small"></v-btn>
        <p class="text-primary text-h4 font-weight-bold">Lift Mate</p>
      </div>

      <v-divider class="mx-5 my-3"></v-divider>
      <!-- Content  -->
      <div>
        <v-list>
          <div v-for="(link, index) in sidebarLinks" :key="index">
            <v-list-item
              :value="link.name"
              active-class="active"
              class="ma-2"
              density="compact"
              rounded="lg"
            >
              <v-list-item-title>
                <p class="text-subtitle-1">
                  {{ link.name }}
                </p>
              </v-list-item-title>
              <template v-slot:prepend>
                <v-icon>
                  {{ link.icon }}
                </v-icon>
              </template>
            </v-list-item>
          </div>
        </v-list>
        <div style="position: fixed; bottom: 2px; width: 100%">
          <v-list>
            <v-list-item
              v-for="(link, index) in sidebarLinks2"
              :key="index"
              :value="link.name"
              active-class="active"
              class="ma-2"
              density="compact"
              rounded="lg"
            >
              <v-list-item-title>
                <p class="text-subtitle-1">
                  {{ link.name }}
                </p>
              </v-list-item-title>
              <template v-slot:prepend>
                <v-icon>
                  {{ link.icon }}
                </v-icon>
              </template>
            </v-list-item>
          </v-list>
        </div>
      </div>
    </v-navigation-drawer>

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
<template>
  <v-layout class="rounded rounded-md">
    <!-- App Bar -->
    <v-app-bar elevation="0">
      <div class="d-flex align-center flex-row">
        <p class="font-weight-bold text-h6 text-primary mx-9 mb-0">
          <v-icon class="mr-3"> mdi-car-hatchback </v-icon>
          Lift Mate
        </a>

        <!-- Sidebar links displayed horizontally -->
        <v-list class="d-flex flex-row align-center">
          <!-- Loop through sidebarLinks for navigation -->
          <v-list-item
            v-for="(item, index) in sidebarLinks"
            :key="index"
            class="d-flex align-center hover-active"
            :class="{ active: getRouteActive(item) }"
            :to="item.children.length ? '' : item.link"
            @click="selectedItem = item"
            elevation="0"
          >
            <!-- Parent links without children -->
            <v-list-item-title
              v-if="!item.children.length"
              class="text-body-1"
              :class="{
                'font-weight-bold': getRouteActive(item),
              }"
            >
              {{ item.name }}
            </v-list-item-title>
            <v-menu v-else open-on-hover location="bottom">
              <template v-slot:activator="{ props }">
                <v-list-item-title
                  class="text-body-1"
                  v-bind="props"
                  :class="{
                    'font-weight-bold': getRouteActive(item),
                  }"
                >
                  {{ item.name }}
                </v-list-item-title>
              </template>
              <div class="mt-2 base-card">
                <v-list-item
                  v-for="(subLink, index) in item.children"
                  :key="index"
                  active-class="active"
                  class="link"
                  :to="subLink.link"
                >
                  <v-list-item-title
                    class="text-body-1"
                    :class="{
                      'font-weight-bold': getRouteActive(subLink),
                    }"
                  >
                    {{ subLink.name }}
                  </v-list-item-title>
                </v-list-item>
              </div>
            </v-menu>
          </v-list-item>
        </v-list>
      </div>
    </v-app-bar>

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
import { useRoute } from "vue-router";

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
    children: [
      {
        name: "List",
        link: "/reservation",
        icon: "mdi-view-list",
      },
      {
        name: "Create",
        link: "/reservation/create",
        icon: "mdi-edit",
      },
      {
        name: "Details",
        link: "/reservation/details",
        icon: "mdi-edit",
      },
    ],
  },
  {
    name: "Users",
    link: "/users",
    icon: "mdi-account-group",
    children: [
      {
        name: "Drivers",
        link: "/users/drivers",
        icon: "mdi-account-group",
        children: [],
      },
      {
        name: "Customers",
        link: "/users/customers",
        icon: "mdi-account-circle",
        children: [],
      },
    ],
  },
  {
    name: "Vehicles",
    link: "/vehicles",
    icon: "mdi-car-electric",
    children: [],
  },
  {
    name: "Settings",
    link: `/settings`,
    icon: "mdi-cog",
    children: [
      {
        name: "Addons",
        link: "/settings/addons",
        icon: "mdi-plus-thick",
        children: [],
      },
      {
        name: "Discount",
        link: "/settings/discounts",
        icon: "mdi-percent",
        children: [],
      },
      {
        name: "Surges",
        link: "/settings/surges",
        icon: "mdi-currency-usd",
        children: [],
      },
      {
        name: "Static Page Editor",
        link: "/settings/static-page-editor",
        icon: "mdi-file-document-outline",
        children: [],
      },
    ],
  },
];

const getRouteActive = (item) => {
  const route = useRoute();
  if (route.path === item.link) return true;

  if (item.children && item.children.length)
    return item.children.some((child) => route.path === child.link);

  return false;
};
</script>

<style scoped lang="scss">
.active {
  color: #025864 !important;
  opacity: 1 !important;
  background-color: transparent !important;
}

::v-deep .v-list-item--active > .v-list-item__overlay,
::v-deep
  .v-list-item[aria-haspopup="menu"][aria-expanded="true"]
  > .v-list-item__overlay {
  opacity: 1 !important; /* Set opacity to 1 */
  background: none !important; /* Remove background */
}

.base-card {
  padding: 0.5rem !important;
  background: white !important;
  box-shadow: 0 6px 32px rgba(44, 50, 169, 0.04) !important;
  border-radius: 2px !important;
}
.hover-active {
  position: relative;
  color: #025864; /* Default text color */
  text-decoration: none; /* Remove default underline */
}

.hover-active:hover {
  color: #025864; /* Change the text color on hover (optional) */
  text-decoration: underline;
  text-underline-offset: 4px;
  transition: all 0.3s ease;
}
</style>
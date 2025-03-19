<template>
  <section>
    <!-- App Bar -->
    <v-app-bar elevation="0">
      <div class="d-flex align-center flex-row">
        <p class="font-weight-bold text-h6 text-primary mx-9 mb-0">
          <v-icon class="mr-3"> mdi-car-hatchback </v-icon>
          Lift Mate
        </p>

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
      <template v-slot:append>
        <v-menu location="bottom" v-model="toggle">
          <template #activator="{ props }">
            <v-btn rounded v-bind="props" color="primary">
              <template v-slot:prepend>
                <v-icon size="large">mdi-account</v-icon>
              </template>
              <template v-slot:append>
                <v-icon size="large">{{
                  toggle ? "mdi-menu-down" : "mdi-menu-up"
                }}</v-icon>
              </template>
              {{ $store.user.fullName }}
            </v-btn>
          </template>
          <v-card>
            <div class="ma-3 text-center">
              <v-avatar color="primary" class="mb-3">
                <span class="white--text pt-1">{{ $store.user.initials }}</span>
              </v-avatar>
              <p class="text-h6">{{ $store.user.fullName }}</p>
              <p class="text-caption mt-1">{{ $store.user.email }}</p>
              <v-divider class="my-3"></v-divider>
              <v-btn
                depressed
                text
                elevation="0"
                @click="router.push(`/settings/1/profile-info`)"
              >
                <!-- <v-btn
                v-if="hasPermission(sysEntities.users, sysActions.profileInfo)"
                depressed
                text
                elevation="0"
                @click="router.push(`/settings/1/profile-info`)"
              ></v-btn> -->
                <v-icon class="mr-2"> mdi-cog </v-icon>
                Settings
              </v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn depressed text elevation="0" @click="onSignOut">
                <v-icon class="mr-2"> mdi-logout </v-icon>
                Sign Out
              </v-btn>
            </div>
          </v-card>
        </v-menu>
      </template>
    </v-app-bar>
  </section>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import store from "@/stores";
import { onMounted } from "vue";
import { SysActions, SysEntities } from "~/enums";

const selectedItem = ref([]);
const router = useRouter();
const $store = store();
const sysEntities = ref(SysEntities);
const sysActions = ref(SysActions);
// const user = $store.user;
// console.log(user.email);
const toggle = ref();

const availableLinks = [
  {
    name: "Dashboard",
    link: "/dashboard",
    icon: "mdi-view-dashboard",
    entity: sysEntities.value.cars,
    action: sysActions.value.view,
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
        entity: sysEntities.value.reservations,
        action: sysActions.value.view,
      },
      {
        name: "Create",
        link: "/reservation/create",
        icon: "mdi-edit",
        entity: sysEntities.value.reservations,
        action: sysActions.value.create,
      },
      {
        name: "Details",
        link: "/reservation/details",
        icon: "mdi-edit",
        entity: sysEntities.value.reservations,
        action: sysActions.value.edit,
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
        entity: sysEntities.value.drivers,
        action: sysActions.value.view,
        children: [],
      },
      {
        name: "Customers",
        link: "/users/customers",
        icon: "mdi-account-circle",
        entity: sysEntities.value.customers,
        action: sysActions.value.view,
        children: [],
      },
    ],
  },
  {
    name: "Vehicles",
    link: "/vehicles",
    icon: "mdi-car-electric",
    entity: sysEntities.value.cars,
    action: sysActions.value.view,
    children: [],
  },
  {
    name: "More",
    link: `/more`,
    icon: "mdi-cog",
    children: [
      {
        name: "Addons",
        link: "/more/addons",
        icon: "mdi-plus-thick",
        entity: sysEntities.value.addons,
        action: sysActions.value.view,
        children: [],
      },
      {
        name: "Discount",
        link: "/more/discounts",
        icon: "mdi-percent",
        entity: sysEntities.value.discounts,
        action: sysActions.value.view,
        children: [],
      },
      {
        name: "Surges",
        link: "/more/surges",
        icon: "mdi-currency-usd",
        entity: sysEntities.value.surges,
        action: sysActions.value.view,
        children: [],
      },
      {
        name: "Static Page Editor",
        link: "/more/static-page-editor",
        icon: "mdi-file-document-outline",
        entity: sysEntities.value.staticPageEditor,
        action: sysActions.value.view,
        children: [],
      },
    ],
  },
];

const sidebarLinks = availableLinks
  .map((item) => {
    if (item.children.length) {
      const filteredChildren = item.children.filter((child) =>
        hasPermission(child.entity, child.action)
      );
      return filteredChildren.length
        ? { ...item, children: filteredChildren }
        : null;
    } else {
      return hasPermission(item.entity, item.action) ? item : null;
    }
  })
  .filter(Boolean);

const getRouteActive = (item) => {
  const route = useRoute();
  if (route.path === item.link) return true;

  if (item.children && item.children.length)
    return item.children.some((child) => route.path === child.link);
  return false;
};

const onSignOut = () => {
  $store.signOut();
  router.push("/");
};

onMounted(() => {
  $store.getMe();
});
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
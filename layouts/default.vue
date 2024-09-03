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
      <div class="mt-8">
        <v-list class="mx-2" >
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
    icon: "mdi-car",
    children: [],
  },
  {
    name: "Profile",
    link: "/profile",
    icon: "mdi-account-circle",
    children: [],
  },
  {
    name: "Booking",
    link: "/booking",
    icon: "mdi-calendar",
    children: [],
  },
  {
    name: "Settings",
    link: "/settings",
    icon: "mdi-cog",
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
  background: #025864  !important;
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
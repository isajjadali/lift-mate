<template>
  <div>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list-item
        :style="{
          background:
            $vuetify.theme.themes[isDarkMode ? 'dark' : 'light'].colors.primary,
        }"
        class="text-white"
      >
        <v-list-item-title class="d-flex justify-left align-center text-h6">
          <v-img
            :lazy-src="compressedLogoURL"
            max-height="30"
            max-width="30"
            :src="logoURL"
            @click="$router.push(RoutesConfig.default.path)"
          />
          <span class="ml-3">[-[App Name]-]</span>
        </v-list-item-title>
      </v-list-item>

      <v-divider />
      <v-list nav dense>
        <v-list-group color="primary">
          <v-list-item
            v-for="(tab, index) in tabs" :key="index" :to="tab.path"
            :title="tab.title"
            scrollable
            class="text-capitalize"
          ></v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      :color="isDarkMode ? '' : 'white'"
      elevation="2"
      flat
    >
      <v-app-bar-nav-icon
        v-if="$vuetify.display.smAndDown"
        @click.stop="drawer = !drawer"
      />
      <v-img
        :lazy-src="compressedLogoURL"
        max-height="40"
        max-width="40"
        :src="logoURL"
        @click="$router.push(RoutesConfig.default.path)"
      />

      <v-tabs v-if="!$vuetify.display.smAndDown" align-with-title>
        <v-tab v-for="(tab, index) in tabs" :key="index" :to="tab.path">
          {{ tab.title }}
        </v-tab>

        <!-- <v-tab
          v-if="hasPermission(PERMISSIONS.surgesCreate)"
        >
          Admin
        </v-tab> -->
      </v-tabs>
      <!-- <v-menu location="bottom">
        <template #activator="{ on }">
          <v-btn
            color="primary"
            dark
            v-bind="on"
          >
            Dropdown
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in tabs"
            :key="index"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu> -->
      <v-spacer />
      <v-btn
        v-if="!$store.user.id"
        rounded
        color="primary"
        variant="flat"
        @click="isSignInModalOpen = true"
      >
        Sign in
      </v-btn>
      <v-menu
        v-else
        offset-x
        left
        transition="slide-x-transition"
        min-width="200px"
        rounded
      >
        <template #activator="{ props }">
          <v-btn icon x-large v-bind="props">
            <v-avatar color="primary" size="40">
              <span class="text-white">{{ $store.user.initials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list-item class="justify-center py-3">
            <div class="mx-auto text-center">
              <v-avatar color="primary" class="mb-3">
                <span class="text-white">{{ $store.user.initials }}</span>
              </v-avatar>
              <h3 style="max-width: 230px">
                {{ $store.user.fullName }}
              </h3>
              <p class="text-caption mt-1">
                {{ $store.user.email }}
              </p>
              <v-divider
                v-if="hasPermission(PERMISSIONS.usersEdit)"
                class="my-3"
              />
              <v-btn
                v-if="hasPermission(PERMISSIONS.usersEdit)"
                variant="text"
                @click="$router.push(`/users/${$store.user.id}/profile-info`)"
              >
                <v-icon class="mr-2"> mdi-pencil </v-icon>
                Edit Account
              </v-btn>
              <div v-if="hasPermission(PERMISSIONS.settingsView)">
                <v-divider
                  v-if="hasPermission(PERMISSIONS.settingsView)"
                  class="my-3"
                />
                <v-btn
                  variant="text"
                  @click="
                    $router.push(
                      hasPermission(PERMISSIONS.rolesView)
                        ? RoutesConfig.settings.rolesPath
                        : RoutesConfig.settings.configurationPath
                    )
                  "
                >
                  <v-icon class="mr-2"> mdi-cog </v-icon>
                  settings
                </v-btn>
              </div>
              <v-divider class="my-3" />

              <div class="d-flex justify-center">
                <v-switch
                  :model-value="isDarkMode"
                  inset
                  label="Dark Mode"
                  color="primary"
                  hide-details
                  @click="onThemeChange()"
                />
              </div>
              <v-divider class="mb-3" />
              <v-btn variant="text" @click="onSignOut()">
                <v-icon class="mr-2"> mdi-logout </v-icon>
                Signout
              </v-btn>
            </div>
          </v-list-item>
        </v-card>
      </v-menu>
    </v-app-bar>

    <login-modal
      :open="isSignInModalOpen"
      @toggleDialog="(v) => isSignInModalOpen = v"
      @switchToSignUp="() => {
        isSignInModalOpen = false;
        isSignUpModalOpen = true;
      }"
    />
    <sign-up-modal
      :open="isSignUpModalOpen"
      @toggleDialog="(v) => isSignUpModalOpen = v"
      @switchToLogin="() => {
        isSignUpModalOpen = false;
        isSignInModalOpen = true;
      }"
    />
  </div>
</template>

<script>
import { RoutesConfig } from "@/enums";
import { Messages } from "@/enums";
import { PERMISSIONS } from "@/enums";

export default {
  name: "CustomAppBar",
  data() {
    return {
      isSignInModalOpen: false,
      isSignUpModalOpen: false,
      RoutesConfig,
      PERMISSIONS,
      activeTab: 0,
      service: [],
      drawer: false,
    };
  },
  computed: {
    tabs() {
      let list = [];

      if (this.$store.user?.isAdmin) {
        list = [
          RoutesConfig.default,
          RoutesConfig.drivers,
          RoutesConfig.customers,
          RoutesConfig.affiliates,
          RoutesConfig.reservations,
          RoutesConfig.discountCodes,
          RoutesConfig.addons,
          RoutesConfig.surges,
          RoutesConfig.cars,
          RoutesConfig.staticPageEditor,
        ];
      } else {
        list = [
          ...list,
          RoutesConfig.default,
          ...(this.$store.user?.id ? [RoutesConfig.reservations] : []),
          ...this.customerMenuList.map((page) => {
            return { title: page.title, path: `/${page.slug}` };
          }),
          RoutesConfig.staticPageEditor,
        ];
      }
      return list
        .map((li) => ({ ...li, title: li?.meta?.title || li?.title }))
        .filter((li) =>
          li.meta?.permission ? this.hasPermission(li.meta?.permission) : true
        );
    },
    customerMenuList() {
      return this.$store.pages.filter(
        (page) =>
          !["privacy-policy", "terms-and-conditions"].includes(page.slug)
        ) || []
    },
    compressedLogoURL() {
      const config = useRuntimeConfig();
      return config.public.compressedLogoUrl;
    },
    logoURL() {
      const config = useRuntimeConfig();
      return config.public.logoUrl;
    },
  },
  async created() {
    await this.$store.getMe();
    this.setTheme();
  },
  methods: {
    setTheme() {
      this.$vuetify.theme.global.name = this.$localStorage.getItem('theme') || 'light';
    },
    onThemeChange() {
      this.$vuetify.theme.global.name = this.isDarkMode ? 'light' : 'dark';
      this.$localStorage.setItem('theme', this.$vuetify.theme.global.name);
    },
    onSignOut() {
      this.$store.signOut();
      this.$router.push(RoutesConfig.default.path);
      this.$localStorage.setItem('theme', 'light');
      this.$vuetify.theme.global.name = 'light'
      this.$toast?.success(Messages.success.signoutSuccessFully);
    },
  },
};
</script>

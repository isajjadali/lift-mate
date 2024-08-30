<template>
  <v-container fluid :class="$vuetify.display.smAndDown ? '' : 'px-12'">
    <user-profile-loader v-if="isLoading" />
    <error-page v-else-if="error" :error="error" />
    <v-row v-else>
      <v-col cols="12" sm="4" md="3" lg="2" xl="2">
        <v-card class="mx-auto">
          <div class="mx-auto text-center align-center">
            <v-avatar color="primary" size="106" class="mt-5">
              <span class="text-white">
                <h1>{{ userDetails.initials || $store.user.initials }}</h1>
              </span>
            </v-avatar>
          </div>
          <v-card-title class="justify-center text-center">
            <div>Edit Account</div>
          </v-card-title>
          <v-card-text>
            <v-list dense>
              <template v-for="(item, i) in listItems" :key="i">
                <v-list-item :to="item.path" link>
                  <template v-slot:prepend>
                    <v-icon
                      v-if="item.icon"
                      size="small"
                      :icon="item.icon"
                    />
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
      <v-col cols="12" sm="8" md="9" lg="10" xl="10">
        <nuxt-page />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { RoutesConfig } from "@/enums";
import UserService from "@/services/user";
import Service from "@/services/index";
import { PERMISSIONS } from "@/enums";
import ErrorPage from "@/shared/pages/ErrorPage.vue";
import UserProfileLoader from "@/components/CustomLoader/UserProfileLoader.vue";
export default {
  name: "SettingsPage",
  components: {
    UserProfileLoader,
    ErrorPage,
  },
  data() {
    return {
      RoutesConfig,
      userId: null,
      error: "",
      isLoading: false,
      userDetails: {},
    };
  },
  computed: {
    listItems() {
      const items = [
        {
          title: "Profile Info",
          path: `${this.userId || this.$store.user?.id}/profile-info`,
          permission: PERMISSIONS.usersProfileInfo,
        },
        {
          title: "User Attachments",
          path: `${this.userId || this.$store.user?.id}/user-attachments`,
          permission: PERMISSIONS.usersAttachments,
        },
        {
          title: "Change Password",
          path: `${this.userId || this.$store.user?.id}/change-password`,
          permission: PERMISSIONS.usersChangePassword,
        },
        {
          title: "Change Email",
          path: `${this.userId || this.$store.user?.id}/change-email`,
          permission: PERMISSIONS.usersChangeEmail,
        },
        {
          title: "Jobs",
          path: `${this.userId || this.$store.user?.id}/user-reservations`,
          permission: PERMISSIONS.usersJobs,
          preCondition: (user) => (user.isDriver ? true : false),
        },
      ];

      items.map((item) => {
        this.setSettingsPath(item);
      });
      let list = items
        .filter((i) => (i.permission ? this.hasPermission(i.permission) : true))
        .filter((i) =>
          i.preCondition
            ? i.preCondition(this.userDetails || this.$store.user)
            : true
        );

      return list;
    },
  },
  created() {
    this.userId = this.$route?.params?.id;
    if (this.userId) {
      this.isLoading = true;
      this.service = new Service("/users");
      this.fetch();
    }
  },
  methods: {
    async fetch() {
      try {
        const response = await this.service.get(this.userId);
        this.userDetails = response.data;
        console.log(this.userDetails, 'this.userDetails');
        this.isLoading = false;
      } catch (e) {
        this.error = e;
        this.isLoading = false;
      }
    },
    setSettingsPath(items = []) {
      if (!Array.isArray(items)) {
        items = [items];
      }
      items.forEach((item) => {
        if (item.path) {
          item.path = `/users/${item.path}`;
        }
      });
    },
  },
};
</script>
<style scoped>
.routerLink {
  text-decoration: none;
}
</style>

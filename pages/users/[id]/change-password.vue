<template>
  <nuxt-layout name="user-profile">
    <div>
      <v-card
        elevation="4"
        class="mb-4"
      >
        <v-card-title> Change Password </v-card-title>
      </v-card>
      <v-card>
        <v-col>
          <change-password
            :show-old-password-field="!currentUser.isAdmin"
            @onSubmit="changeUserPassword"
          />
        </v-col>
      </v-card>
    </div>
  </nuxt-layout>
</template>
<script>
  import UserService from '@/services/user';
  import Service from '@/services/index';
  import ChangePassword from '@/shared/forms/ChangePassword.vue';
  import { MDI_ICONS } from '@/enums';
  import { PERMISSIONS } from '@/enums';
  export default {
    name: 'ChangePasswordPage',
    components: {
      ChangePassword,
    },
    props: {},
    data: () => {
      return {
        valid: true,
        user: {},
        userService: {},
        service: {},
        userId: '',
        MDI_ICONS,
        PERMISSIONS,
      };
    },
    computed: {
      currentUser() {
        return this.$store.user;
      },
    },
    async created() {
      this.userId = this.$route?.params?.id;
      this.service = new Service('/users');
      this.fetch();
    },
    methods: {
      async fetch() {
        const response = await this.service.get(this.userId);
        this.user = response.data;
      },
      async changeUserPassword(payload) {
        await UserService.changePassword(this.userId, payload);
        this.$toast.success(
          `${this.user.fullName} password has been updated successfully!`
        );
      },
    },
  };
</script>

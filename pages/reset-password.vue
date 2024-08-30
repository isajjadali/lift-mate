<template>
  <v-container align="center">
    <reset-password-loader v-if="loading" />
    <v-row v-else-if="!isTokenVerified">
      <v-col cols="12" sm="12">
        <v-card
          rounded="lg"
          min-height="268"
          class="d-flex justify-center align-center"
        >
          <h3>Sorry, link has expired!</h3>
        </v-card>
      </v-col>
    </v-row>
    <generic-logo-page-vue v-else>
      <v-row>
        <v-col :cols="$vuetify.display.smAndDown ? '12' : '8'" class="py-0">
          <h1>{{ isSetPassword ? "Set" : "Reset" }}</h1>
          <h1>Password?</h1>
          <p>Please enter{{ isSetPassword ? " " : " new " }}password below</p>
          <change-password
            ref="resetPassword"
            :authenticate="false"
            :show-old-password-field="false"
            btn-label="Reset Password"
            :is-verticle="true"
            :is-set-password="isSetPassword"
            @onSubmit="onResetPassword"
          />
          <p v-if="error" :class="`text-error`">
            <strong>{{ error }}</strong>
          </p>
        </v-col>
      </v-row>
    </generic-logo-page-vue>
  </v-container>
</template>


<script>
import ChangePassword from "@/shared/forms/ChangePassword.vue";
import UserService from "@/services/user";
import { Messages, RoutesConfig } from "@/enums";
import ResetPasswordLoader from "@/components/CustomLoader/ResetPasswordLoader.vue";
import GenericLogoPageVue from "@/components/GenericLogoPage.vue";

definePageMeta({
  title: "Reset Password",
});

export default {
  name: "ResetPassword",
  components: {
    ChangePassword,
    ResetPasswordLoader,
    GenericLogoPageVue,
  },
  data() {
    return {
      isTokenVerified: false,
      loading: false,
      isSetPassword: false,
      token: "",
      error: "",
    };
  },
  created() {
    this.token = this.$route.query.token;
    this.isSetPassword = this.$route.query.setPassword === "true";
    if (!this.token) {
      return (this.isTokenVerified = false);
    }
    this.verifyTokenInParams();
  },
  methods: {
    async verifyTokenInParams() {
      try {
        this.loading = true;
        await UserService.verifyToken({ token: this.token });
        this.isTokenVerified = true;
      } catch (e) {
        this.isTokenVerified = false;
      } finally {
        this.loading = false;
      }
    },
    async onResetPassword(payload) {
      try {
        await UserService.resetPassword({
          ...payload,
          token: this.token,
        });
        this.$toast.success(Messages.success.passwordUpdated);
        this.$router.push(RoutesConfig.default.path);
      } catch (e) {
        this.error = e;
      }
    },
  },
};
</script>

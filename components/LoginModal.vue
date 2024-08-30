<template>
  <v-dialog
    v-model="toggleDialog"
    max-width="450"
    persistent
  >
    <v-card>
      <v-toolbar
        color="primary"
        dark
      >
        <v-toolbar-title>Sign In</v-toolbar-title>
        <v-spacer />
        <v-btn
          id="close-modal"
          icon
          @click="$emit('toggleDialog', false)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="mt-10">
        <v-form
          ref="loginModal"
          v-model="valid"
        >
          <shared-custom-field
            id="login-email-field"
            v-model="email"
            :required="true"
            prepend-inner-icon="mdi-account"
            label="Email"
            type="email"
            @keyup.enter="onEnter"
          />
          <shared-custom-field
            id="login-password-field"
            v-model="password"
            :required="true"
            type="password"
            label="Password"
            @keyup.enter="onEnter"
          />
          <div class="text-right text-primary mb-5">
            <a @click="onClickForgotPassword()">Forgot password?</a>
          </div>
          <shared-custom-btn
            id="login-modal-btn"
            block
            color="primary"
            :loading="loading"
            @click="proceed()"
          >
            Sign in
          </shared-custom-btn>
          <p class="text-error text-center mt-2">
            <strong>{{ error }}</strong>
          </p>
          <div class="mt-5 text-center">
            <span>Don't have an account?</span>
            <span
              class="text-primary"
              style="cursor: pointer"
              @click="
                $emit('switchToSignUp');
                isSignUpModalOpen = true;
              "
            >
              Sign Up</span>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { RoutesConfig, Messages } from '@/enums';
import { PERMISSIONS } from '@/enums';
export default {
    name: 'LoginModal',
    props: {
        open: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            valid: false,
            email: '',
            password: '',
            showPassword: false,
            isSignUpModalOpen: false,
            error: null,
            RoutesConfig,
            loading: false,
        };
    },
    computed: {
      toggleDialog: {
        get() {
          return !!this.open;
        },
        set(value) {
          this.$emit('toggleDialog', value);
        },
      },
    },
    watch: {
        open(newValue) {
            if (newValue) {
                this.email = '';
                this.password = '';
                this.error = null;
                this.reset();
            }
        },
    },
    methods: {
        onEnter() {
            if (this.valid) this.onLogin();
        },
        validate() {
            return this.$refs.loginModal.validate();
        },
        proceed() {
            if (this.validate()) this.onLogin();
        },
        reset() {
            this.$refs.loginModal?.reset();
        },
        async onLogin() {
            try {
                this.loading = true;
                const response = await this.$store.login({
                    email: this.email,
                    password: this.password,
                });
                if (this.$route.path.includes('/reservations/create')) {
                    // this.$$window.location.reload();
                } else {
                    if(response?.user?.isAdmin) {
                        this.$store.fetchAddons();
                        this.$store.fetchDrivers();
                    }
                    const paths = {
                        [PERMISSIONS.reservationsView]: RoutesConfig.reservations.path,
                        [PERMISSIONS.configurationsHome]: RoutesConfig.settings.configurationPath,
                        [PERMISSIONS.rolesView]: RoutesConfig.settings.rolesPath,
                        default: RoutesConfig.default.path,
                    };
                    
                    this.$router.push(
                        paths[
                            [
                                PERMISSIONS.reservationsView,
                                PERMISSIONS.configurationsHome,
                                PERMISSIONS.rolesView,
                            ].find((p) => this.hasPermission(p)) || 'default'
                        ]
                    );
                }
                this.loading = false;
                this.$emit('toggleDialog', false);
            } catch (e) {
                this.error = 'Invalid email or password!';
            }
            this.loading = false;
            this.reset();
        },
        onClickForgotPassword() {
            this.$emit('toggleDialog', false);
            this.reset();
            this.$router.push(RoutesConfig.forgotPassword.path);
        },
    },
};
</script>

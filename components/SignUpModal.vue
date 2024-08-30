<template>
  <v-dialog
    v-model="toggleDialog"
    max-width="600"
    scrollable
    persistent
  >
    <v-card>
      <v-toolbar
        color="primary"
        dark
      >
        <v-toolbar-title>Sign Up</v-toolbar-title>
        <v-spacer />
        <v-btn
          id="close-modal"
          icon
          @click="$emit('toggleDialog', false) && reset()"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="pt-10">
        <v-form
          ref="signUpModal"
          v-model="valid"
        >
          <v-row>
            <v-col
              sm="6"
              md="6"
              cols="12"
              class="py-0"
            >
              <shared-custom-field
                id="firstName"
                v-model="firstName"
                :required="true"
                label="First Name"
                :prepend-inner-icon="MDI_ICONS.username"
              />
            </v-col>
            <v-col
              sm="6"
              md="6"
              cols="12"
              class="py-0"
            >
              <shared-custom-field
                id="lastName-field"
                v-model="lastName"
                :prepend-inner-icon="MDI_ICONS.username"
                label="Last Name"
              />
            </v-col>
            <v-col
              sm="6"
              md="6"
              cols="12"
              class="py-0"
            >
              <shared-custom-field
                id="email-field"
                v-model="email"
                :required="true"
                label="Email"
                type="email"
              />
            </v-col>
            <v-col
              sm="6"
              md="6"
              cols="12"
              class="py-0"
            >
              <shared-custom-field
                id="phoneNumber-field"
                v-model="phoneNumber"
                :required="true"
                label="Phone Number"
                type="phoneNumber"
              />
            </v-col>
            <v-col
              sm="6"
              md="6"
              cols="12"
              class="py-0"
            >
              <shared-custom-field
                id="password-field"
                v-model="password"
                type="password"
                :required="true"
                label="Password"
              />
            </v-col>
            <v-col
              sm="6"
              md="6"
              cols="12"
              class="py-0"
            >
              <shared-custom-field
                id="confirmPassword-field"
                v-model="confirmPassword"
                :required="true"
                :rules="rules.confirmPassword"
                label="Confirm Password"
                type="password"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-center pt-0">
              <shared-custom-btn
                id="signup-btn"
                width="50%"
                color="primary"
                :loading="loading"
                @click="onSubmit()"
              >
                Sign Up
              </shared-custom-btn>
            </v-col>
          </v-row>
          <p class="text-error text-center mt-2">
            <strong>{{ error }}</strong>
          </p>
          <div class="mt-5 text-center">
            <div class="mb-1">
              Already A User?
              <span
                class="text-primary"
                style="cursor: pointer"
                @click="
                  isSignUpModalOpen = true;
                  reset();
                  $emit('switchToLogin', false);
                "
              >
                Sign In
              </span>
            </div>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
  <!-- <login-modal
    :open="isSignUpModalOpen"
    @update:modelValue="(v) => isSignUpModalOpen = v"
    @close="isSignUpModalOpen = false"
  /> -->
</template>

<script>
import { mask } from 'vue-the-mask';
import { Messages, MDI_ICONS } from '@/enums';
import UserMixin from '@/mixins/user-mixin';
export default {
    name: 'SignUpModal',
    directives: {
        mask,
    },
    mixins: [UserMixin],
    props: {
        open: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            valid: false,
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            phoneNumber: '',
            showPassword: false,
            loading: false,
            isSignUpModalOpen: false,
            error: null,
            MDI_ICONS,
        };
    },
    computed: {
      toggleDialog: {
        get() {
          return this.open;
        },
        set(value) {
          this.$emit('toggleDialog', value);
        },
      },
    },
    methods: {
        validate() {
            return this.$refs.signUpModal.validate();
        },
        onSubmit() {
            if (this.validate()) {
                this.loading = true;
                this.proceedToSignUp();
            }
        },
        reset() {
            this.$refs.signUpModal?.reset();
            this.loading = false;
        },
        async proceedToSignUp() {
            try {
                await this.$store.signup({
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email,
                    password: this.password,
                    confirmPassword: this.confirmPassword,
                    phoneNumber: this.phoneNumber,
                });
                this.$emit('toggleDialog', false);
                this.reset();
                this.loading = false;
                this.$toast.success(Messages.success.signupSuccessFully);
            } catch (e) {
                this.error = e;
                this.loading = false;
                this.reset();
            }
        },
    },
};
</script>

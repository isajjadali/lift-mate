<template>
  <div>
    <v-card
      elevation="4"
      class="mb-4"
    >
      <v-card-title> Change Email </v-card-title>
    </v-card>
    <v-card class="px-5">
      <v-form
        ref="changeEmailForm"
        v-model="valid"
      >
        <v-container>
          <v-row class="mt-1">
            <v-col
              :sm="6"
              cols="12"
              class="py-0"
            >
              <shared-custom-field
                id="change-email-field"
                v-model="email"
                :required="true"
                label="Email"
                type="email"
                clearable
              />
            </v-col>
            <v-col
              :sm="6"
              cols="12"
              :class="$vuetify.display.xs ? 'py-0' : 'py-8'"
            >
              <shared-custom-btn
                id="reset-password-btn"
                color="primary"
                :class="$vuetify.display.xs ? 'float-right' : ''"
                @click="onValidate"
              >
                Submit
              </shared-custom-btn>
              <shared-custom-auth-btn
                id="custom-auth-modal-btn"
                ref="authBtn"
                color="primary"
                :class="$vuetify.display.xs ? 'float-right' : ''"
                hidden
                @click="onClick()"
              >
                Submit
              </shared-custom-auth-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col />
          </v-row>
        </v-container>
      </v-form>
    </v-card>
  </div>
</template>
<script>
  import UserService from '@/services/user';
  import { Messages, RoutesConfig } from '@/enums';

  export default {
    name: 'ChangeEmail',
    props: {
      showOldPasswordField: {
        type: Boolean,
        default: true,
      },
      btnLabel: {
        type: String,
        default: 'Update',
      },
      isVerticle: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        valid: false,
        email: '',
        userId: '',
      };
    },
    created() {
      this.userId = this.$route?.params?.id;
    },
    methods: {
      async onClick() {
        if (!this.$store.user?.isAdmin) {
          await UserService.changeEmail({ email: this.email });
          this.$toast.success(Messages.success.mailSent);
        } else {
          await UserService.changeEmailByAdmin(this.userId, {
            email: this.email,
          });
          this.$toast.success(
            `${this.$store.user.fullName}'s email has been updated successfully!`
          );
        }
      },
      onValidate() {
        if (this.$refs.changeEmailForm.validate()) {
          this.$refs.authBtn.$refs.customBtn.$el.click();
        }
      },
    },
  };
</script>

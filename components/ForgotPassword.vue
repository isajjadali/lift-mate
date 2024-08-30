<template>
  <generic-logo-page-vue>
    <v-row>
      <v-col
        cols="12"
        class="py-0"
      >
        <h1>Forgot</h1>
        <h1>Password?</h1>
        <p>Please enter email address below</p>
        <v-form
          ref="forgotPasswordForm"
          v-model="valid"
        >
          <v-row>
            <v-col cols="12">
              <shared-custom-field
                id="sidebar-search-field"
                v-model="email"
                color="primary"
                type="email"
                placeholder="Enter your email here!"
                label="Email"
                :show-label="false"
                prepend-inner-icon="mdi-email"
                :required="true"
                clearable
              />
              <p
                v-if="msg.content"
                :class="`text-${msg.type}`"
              >
                <strong>{{ msg.content }}</strong>
              </p>
              <div v-if="msg.type === 'primary'">
                <a
                  :href="link"
                  target="_blank"
                >
                  Go check your email.
                </a>
              </div>
              <shared-custom-btn
                id="add-btn-generic-modal"
                class="float-right"
                color="primary"
                :block="$vuetify.display.xs"
                :loading="isEmailSending"
                @click="onValidate"
              >
                Send
              </shared-custom-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </generic-logo-page-vue>
</template>


<script>
import UserService from '@/services/user';

export default {
    name: 'ForgotPassword',
    data() {
        return {
            email: '',
            msg: {
                type: '',
                content: '',
            },
            valid: false,
            isEmailSending: false,
            link: '',
            mailUrls: {
                yahoo: 'https://login.yahoo.com/',
                gmail: 'https://mail.google.com/',
            },
        };
    },
    methods: {
        async sendEmail() {
            try {
                this.isEmailSending = true;
                await UserService.sendForgotPasswordEmail({
                    email: this.email,
                });

                this.createLink();
                this.msg = {
                    type: 'primary',
                    content: 'Email Sent Successfully!',
                };
                this.$refs.forgotPasswordForm.reset();

                setTimeout(() => {
                    this.msg = {};
                }, 30000);
            } catch (e) {
                this.msg = {
                    type: 'error',
                    content: 'No registered user against this email!',
                };
            } finally {
                this.isEmailSending = false;
            }
        },
        onValidate() {
            if (this.$refs.forgotPasswordForm.validate()) {
                this.sendEmail();
            }
        },
        createLink() {
            Object.keys(this.mailUrls).some((i) => {
                if (this.email.includes(i)) {
                    this.link = this.mailUrls[i];
                    return false;
                }
            });
        },
    },
};
</script>

<template>
  <div>
    <shared-custom-btn
      id="custom-auth-btn"
      ref="customBtn"
      :disabled="disabled"
      color="primary"
      v-bind="$attrs"
      @click="open = true"
    >
      {{ label }}
    </shared-custom-btn>
    <v-dialog
      v-model="open"
      transition="dialog-bottom-transition"
      max-width="400px"
      persistent
    >
      <v-card>
        <v-toolbar
          color="primary"
          dark
        >
          <v-toolbar-title>Please enter passsword to confirm</v-toolbar-title>
          <v-spacer />
          <v-icon @click="open = false">
            mdi-close
          </v-icon>
        </v-toolbar>
        <v-form
          ref="authBtnForm"
          v-model="valid"
        >
          <v-card-text class="py-5">
            <shared-custom-field
              id="custom-auth-modal-field"
              v-model="password"
              type="password"
              :required="true"
              label="Password"
            />
            <v-spacer />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <shared-custom-btn
              id="custom-auth-modal-btn"
              color="primary"
              @click="onValidate()"
            >
              Submit
            </shared-custom-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import UserService from '@/services/user';
import { Messages, RoutesConfig } from '@/enums';
export default {
    name: 'CustomAuthBtn',
    props: {
        label: {
            type: String,
            default: 'Submit',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        sendMail: {
            type: Boolean,
            default: false,
        },
        email: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            valid: false,
            open: false,
            password: '',
        };
    },
    watch: {
        open(newValue) {
            if (newValue) {
                this.password = '';
            }
        },
    },
    methods: {
        async onClick() {
            try {
                await UserService.verifyPassword({ password: this.password });
                this.open = false;
                this.$emit('click');
            } catch (e) {
                this.open = true;
                this.$toast.error(Messages.error.incorrectPassword);
            }
        },
        onValidate() {
            if (this.$refs.authBtnForm.validate()) {
                this.onClick();
            }
        },
    },
};
</script>

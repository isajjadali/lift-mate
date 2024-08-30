<template>
  <v-form
    ref="resetPasswordForm"
    v-model="valid"
  >
    <v-container>
      <v-row class="mt-1">
        <v-col
          v-if="showOldPasswordField"
          :sm="isVerticle ? 12 : 6"
          cols="12"
          class="py-0"
        >
          <shared-custom-field
            id="oldpassword-field"
            v-model="payload.oldPassword"
            :required="true"
            label="Old Password"
            type="password"
          />
        </v-col>
        <v-col
          :sm="isVerticle ? 12 : 6"
          cols="12"
          class="py-0"
        >
          <shared-custom-field
            id="newpassword-field"
            v-model="payload.newPassword"
            :required="true"
            label="New Password"
            :rules="rules.newPassword"
            type="password"
            @copy.prevent
            @paste.prevent
            @click.right.prevent
          />
        </v-col>
        <v-col
          :sm="isVerticle ? 12 : 6"
          cols="12"
          class="py-0"
        >
          <shared-custom-field
            id="confirmPassword-field"
            v-model="payload.confirmPassword"
            :required="true"
            label="Confirm Password"
            :rules="rules.confirmPassword"
            type="password"
            @copy.prevent
            @paste.prevent
            @click.right.prevent
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="authenticate">
          <shared-custom-auth-btn
            ref="authBtn"
            class="float-right"
            hidden
            :label="btnLabel"
            @click="$emit('onSubmit', payload)"
          />
          <shared-custom-btn
            id="reset-password-btnn"
            class="float-right"
            color="primary"
            @click="onValidate"
          >
            {{ btnLabel }}
          </shared-custom-btn>
        </v-col>
        <v-col v-if="!authenticate">
          <shared-custom-btn
            id="reset-password-btn"
            ref="nonauthenticated"
            class="float-right"
            color="primary"
            @click="onValidate"
          >
            {{ isSetPassword ? "Set" : "Reset" }} Password
          </shared-custom-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script>
import { Rules } from '@/enums';

export default {
    name: 'ChangePassword',
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
        authenticate: {
            type: Boolean,
            default: true,
        },
        isSetPassword: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            valid: false,
            payload: {
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            },
            rules: {
                newPassword: [
                    (v) => this.payload.oldPassword !== v || Rules.oldPassword,
                ],
                confirmPassword: [
                    (v) =>
                        this.payload.newPassword === v || Rules.confirmPasswordMismatch,
                ],
            },
        };
    },
    methods: {
        onValidate() {
            if (this.$refs.resetPasswordForm.validate()) {
                if (this.authenticate) {
                    this.$refs.authBtn.$refs.customBtn.$el.click();
                } else {
                    this.$emit('onSubmit', this.payload);
                }
            }
        },
    },
};
</script>

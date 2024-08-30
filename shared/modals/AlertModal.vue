<template>
  <v-dialog
    v-model="toggleDialog"
    width="600px"
    height="500px"
    persistent
  >
    <v-card>
      <v-card-text>
        <v-icon
          v-if="!hideCancelBtn && !hideBtns"
          class="close-btn"
          @click="$emit('close')"
        >
          mdi-close
        </v-icon>
        <v-container>
          <v-row class="flex-column justify-center align-center">
            <v-progress-circular
              v-if="type === 'loading'"
              :size="80"
              class="my-8"
              :color="alertType.color"
              indeterminate
              :width="8"
            />
            <v-icon
              v-else
              :color="alertType.color"
              size="80px"
              class="my-8"
            >
              {{ alertType.icon }}
            </v-icon>
            <h2 :class="`text-${isDarkMode ? 'white' : 'black'}`">
              {{ title }}
            </h2>
            <h3
              v-if=" message"
              :class="message ? 'mt-6' : ''"
            >
              {{ message }}
            </h3>
            <h3
              v-for="(msg,index) in messages"
              :key="index"
              :class="messages.length ? 'mt-3' : ''"
            >
              {{ msg }}
            </h3>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions
        v-if="!hideBtns"
        class="justify-center"
      >
        <div class="mb-5">
          <shared-custom-btn
            variant="elevated"
            v-if="!hideCancelBtn"
            id="cancel-alert-btn"
            min-width="100px"
            class="mr-2"
            color="secondary"
            @click="$emit('close')"
          >
            {{ cancelBtnLabel }}
          </shared-custom-btn>
          <shared-custom-btn
            variant="elevated"
            id="confirm-alert-btn"
            min-width="100px"
            :color="alertType.color"
            @click="$emit('onConfirm')"
          >
            {{ okBtnLabel }}
          </shared-custom-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script>
export default {
    name: 'AlertModal',
    props: {
        open: {
            type: Boolean,
            default: false,
        },
        okBtnLabel: {
            type: String,
            default: 'OK',
        },
        cancelBtnLabel: {
            type: String,
            default: 'Cancel',
        },
        hideCancelBtn: {
            type: Boolean,
            default: false,
        },
        hideBtns: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            default: 'success',
        },
        color: {
            type: String,
            default: 'primary',
        },
        title: {
            type: String,
            default: '',
        },
        icon: {
            type: String,
            default: '',
        },
        message: {
            type: String,
            default: '',
        },
        messages: {
            type: Array,
            default: ()=>[],
        },
    },
    data() {
        return {
            types: {
                error: {
                    color: 'error',
                    icon: 'mdi-alert-circle-outline',
                },
                info: {
                    color: 'info',
                    icon: 'mdi-information-outline',
                },
                warning: {
                    color: 'warning',
                    icon: 'mdi-alert-outline',
                },
                success: {
                    color: 'primary',
                    icon: 'mdi-checkbox-marked-circle-outline',
                },
                loading: {
                    color: 'primary',
                },
            },
        };
    },
    computed: {
        alertType() {
            return this.types[this.type] || {};
        },
        toggleDialog: {
          get() {
            return this.open;
          },
          set(value) {
            this.$emit('change', value);
          },
        },
    },
};
</script>
<style lang="scss">
.close-btn {
  float: right;
  margin-top: 15px;
}
</style>

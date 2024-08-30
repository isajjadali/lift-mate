<template>
  <v-dialog
    v-model="dialogToggle"
    transition="dialog-bottom-transition"
    max-width="500px"
    persistent
  >
    <v-card>
      <v-toolbar
        :color="color"
        dark
      >
        <v-toolbar-title>Are you sure?</v-toolbar-title>
        <template v-slot:append>
          <v-btn icon="mdi-close" @click="onClick(false)"/>
        </template>
      </v-toolbar>
      <v-card-text class="py-5">
        <div
          class="break-word text-subtitle-1"
          v-dompurify-html="title"
        />
        <v-spacer />
        <slot />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <shared-custom-btn
          id="confirmation-modal_cancel-btn"
          class="mb-2"
          variant="elevated"
          @click="onClick(false)"
        >
          Cancel
        </shared-custom-btn>
        <shared-custom-btn
          id="confirmation-modal_confirm-btn"
          class="mb-2"
          variant="elevated"
          :color="color"
          :disabled="disableConfirmButton"
          @click="onClick(true)"
        >
          Confirm
        </shared-custom-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
    name: 'ConfirmationModal',
    props: {
        open: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: 'Are you sure you want to perform this action?',
        },
        color: {
            type: String,
            default: 'primary',
        },
        disableConfirmButton: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {};
    },
    computed: {
      dialogToggle: {
        set(value) {
          this.$emit('change', value)
        },
        get() {
          return this.open;
        },
      },
    },
    methods: {
        onClick(isConfirmed) {
            if (isConfirmed) {
                this.$emit('confirm');
            } else {
                this.$emit('cancel');
            }
        },
    },
};
</script>

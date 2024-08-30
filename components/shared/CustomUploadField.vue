<template>
  <div>
    <div
      v-if="showLabel"
      class="mb-2"
    >
      <span>
        <strong> {{ label }} </strong>
        <span
          v-if="required && label"
          style="color: red"
        >*</span>
      </span>
    </div>
    <v-file-input
      v-model="inputVal"
      class="custom-file-input"
      color="primary"
      counter
      label="Choose File..."
      placeholder="Select your files"
      prepend-inner-icon="mdi-paperclip"
      prepend-icon=""
      variant="outlined"
      density="compact"
      v-bind="$attrs"
      accept=".png,.jpeg,.jpg"
      :rules="rules"
    >
      <!-- <template #selection="{ index, text }">
        <v-chip
          v-if="index < 2"
          color="primary"
          dark
          label
          small
        >
          {{ text }}
        </v-chip>

        <span
          v-else-if="index === 2"
          class="text-overline text-grey text-darken-3 mx-2"
        >
          +{{ files.length - 2 }} File(s)
        </span>
      </template> -->
    </v-file-input>
  </div>
</template>
<script>
export default {
    name: 'CustomUploadField',
    props: {
        label: {
            type: String,
            default: '',
        },
        required: {
            type: Boolean,
            default: false,
        },
        showLabel: {
            type: Boolean,
            default: true,
        },
        modelValue: {
            type: null,
            default: () => [],
        },
    },
    computed: {
        inputVal: {
            get() {
                return this.modelValue;
            },
            set(val) {
                this.$emit('update:modelValue', val);
            },
        },
        rules() {
            const computedRules = [];
            if (this.required) {
                computedRules.push((val) => !!val || 'File is required');
            }
            return computedRules;
        },
    },
};
</script>
<style lang="scss" >
.custom-file-input {
  .v-field {
    border-radius: 8px;
  }
}

.v-file-input {
  .v-input__prepend-outer {
    display: none !important;
  }
}
</style>

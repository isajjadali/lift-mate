<template>
  <div>
    <div
      v-if="showLabel"
      class="mb-2"
    >
      <span>
        <strong> {{ label }} </strong>
        <span
          v-if="required"
          style="color: red"
        >*</span>
      </span>
    </div>
    <v-select
      :id="id"
      v-bind="{ ...$attrs, label: !showLabel? label: placeholder }"
      :rules="rules"
      color="primary"
      density="compact"
      variant="outlined"
      :rounded="4"
      class="custom-select"
    />
  </div>
</template>

<script>
export default {
    name: 'CustomSelect',
    props: {
        id: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            default: '',
        },
        placeholder: {
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
    },
    computed: {
        rules() {
            const computedRules = [];
            if (this.required) {
                computedRules.push(
                    (val) => !!val || `${this.label || 'Field'} is required`
                );
            }
            return computedRules;
        },
    },
};
</script>
<style lang="scss" scoped>
.custom-select {
  .v-field {
    border-radius: 8px !important;
  }
}
</style>

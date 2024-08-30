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
    <v-autocomplete
      :id="id"
      v-bind="{ ...$attrs, label: placeholder }"
      :rules="rules"
      density="compact"
      variant="outlined"
      flat
      class="custom-autocomplete"
    />
  </div>
</template>

<script>
export default {
    name: 'CustomAutocomplete',
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
.custom-autocomplete {
  border-radius: 8px;
}
</style>

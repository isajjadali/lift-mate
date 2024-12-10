<template>
  <v-row>
    <v-col cols="12">
      <shared-custom-field
        id="test"
        v-model="computedDiscountCode"
        label="Discount Code"
      />
    </v-col>
    <v-col cols="12">
      <p
        v-if="discountConfig.message"
        class="d-inline"
      >
        <span :class="`text-${discountConfig.color}`">
          {{ discountConfig.message }}
        </span>
      </p>
      <shared-custom-btn
        id="validate-btn"
        color="primary"
        class="float-right"
        :disabled="!computedDiscountCode"
        :loading="loading"
        @click="() => emits('click:apply')"
      >
        Apply
      </shared-custom-btn>
      <shared-custom-btn
        v-if="discounts.length"
        id="clear-btn"
        color="error"
        class="float-right mr-1"
        @click="() => emits('clear')"
      >
        clear
      </shared-custom-btn>
    </v-col>
  </v-row>
</template>

<script setup>
const emits = defineEmits([
  'update:modelValue',
  'click:apply',
  'clear',
]);

const props = defineProps({
  discounts: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: String,
    default: () => '',
  },
  loading: {
    type: Boolean,
    default: () => false,
  },
  discountConfig: {
    type: Object,
    default: () => {},
  },
});

const computedDiscountCode = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits('update:modelValue', value);
  },
});
</script>

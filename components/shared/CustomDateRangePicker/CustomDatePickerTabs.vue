<template>
  <v-btn-toggle
    :model-value="activeTab"
    rounded="lg"
    density="compact"
    mandatory
    color="primary"
    @update:modelValue="onChange"
  >
    <v-btn
      v-for="tab in availableTabs"
      :key="tab.id"
      :value="tab.value"
    >
      {{ tab.label }}
    </v-btn>
  </v-btn-toggle>
</template>

<script>
import {AVAILABLE_TABS} from './date-picker-config';

export default {
    name: 'CustomDatePickerTabs',
    props: {
        activeTab: {
            type: String,
            default: 'range',
        }
    },
    data() {
        return {
            availableTabs: AVAILABLE_TABS,
        };
    },
    methods: {
        onChange(value) {
            this.$emit('update', value);
        }
    },
};
</script>

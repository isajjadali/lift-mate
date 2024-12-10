<!-- Unused -->
<template>
  <component
    :is="name"
    v-bind="$attrs"
  >
    <template
      v-for="(_, slotName) in $slots"
      v-slot:[slotName]="slotProps"
    >
      <slot
        :name="slotName"
        v-bind="slotProps ?? {}"
      />
    </template>
  </component>
</template>
<script setup>
defineProps({
  name: {
    type: [String, Object],
    required: true,
  },
});
</script>

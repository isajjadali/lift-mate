<template>
  <span>
    <v-tooltip
      :id="id"
      location="top"
      :text="tooltipText || text"
      color="primary"
      open-on-click
    >
      <template v-slot:activator="{ props }">
        <p
          :id="id"
          v-if="type === 'text'"
          v-bind="{ ...props, ...$attrs }"
          class="tooltip-activator"
        >
          <v-icon v-if="icon">{{ icon }}</v-icon>
          {{ text }}
        </p>
      </template>
    </v-tooltip>
  </span>
</template>

<script setup>
const componentProps = defineProps({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: () => 'text',
  },
  text: {
    type: String,
    required: true,
  },
  tooltipText: {
    type: String,
    default: () => '',
  },
  icon: {
    type: String,
    default: () => '',
  },
});

</script>

<style lang="scss">
</style>

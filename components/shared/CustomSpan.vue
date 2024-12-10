<template>
  <span class="custom-span">
    <slot />
    <v-tooltip
      location="top"
      color="black"
      :text="helpText"
    >
      <template #activator="{ props }">
        <v-icon
          v-if="helpText"
          v-bind="props"
          class="help-icon"
        >
          mdi-help-circle
        </v-icon>
      </template>
    </v-tooltip>
  </span>
</template>

<script>
export default {
  name: 'CustomSpan',
  props: {
    helpText: {
      type: String,
      default: null,
    },
  },
};
</script>
<style lang="scss">
.custom-span {
  .help-icon {
    margin-bottom: 3px;
    margin-right: 2px;
  }
}
</style>

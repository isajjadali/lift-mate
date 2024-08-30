<template>
  <span class="custom-span">
    <slot />
    <v-tooltip
      top
      color="black"
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
      <p>
        {{ helpText }}
      </p>
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

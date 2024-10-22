<template>
  <v-expansion-panels elevation="0" :multiple="isMultiple">
    <v-expansion-panel>
      <v-expansion-panel-title>
        <h4>{{ title }}</h4>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <slot />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  name: "CustomExpansionPanel",
  props: {
    title: {
      type: String,
      default: "",
    },
    isMultiple: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style scoped>
::v-deep .v-expansion-panel {
  background-color: white;
  border-radius: 15px !important;
}
::v-deep .v-expansion-panel-title__overlay {
  background-color: white;
}
</style>
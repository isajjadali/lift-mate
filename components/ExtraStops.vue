<template>
  <v-container
    class="py-0"
    :class="inputVal.length && !$vuetify.display.smAndDown ? 'px-15' : 'px-0'"
  >
    <v-row>
      <v-col
        v-for="(stop, extraStopIndex) in inputVal"
        :key="extraStopIndex"
        cols="12"
        class="py-0 align-center"
      >
        <shared-google-place-dropdown
          v-model="stop.value"
          label="Extra Stop"
          placeholder="Enter Extra Stop Location"
          no-data-text="Type to search location..."
          required
          class="mr-3"
          prepend-inner-icon="mdi-map-marker"
          append-icon="mdi-delete"
          @click:append="onRemovingStop(extraStopIndex)"
        />
      </v-col>
      <v-col
        cols="12"
        class="mb-5"
        :class="$vuetify.display.smAndDown ? 'pt-0' : 'py-0'"
      >
        <shared-custom-btn
          id="add-extra-stop"
          color="primary"
          size="small"
          :disabled="isAddExtraStopBtnDisabled"
          @click="onAddingExtraStop()"
        >
          Add Extra stop
        </shared-custom-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
    name: 'ExtraStops',
    props: {
        modelValue: {
            type: Array,
            default: () => [],
        },
        extraStops: {
            type: Array,
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
        isAddExtraStopBtnDisabled() {
            return !this.inputVal.every((i) => i.value);
        },
    },
    methods: {
        onRemovingStop(index) {
            this.inputVal.splice(index, 1);
        },
        onAddingExtraStop() {
            this.inputVal.push({ value: null });
        },
    },
};
</script>

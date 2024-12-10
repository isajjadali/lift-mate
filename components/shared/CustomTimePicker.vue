<template>
  <v-menu
    v-model="isMenuOpen"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    location="bottom"
    min-width="auto"
  >
    <template #activator="{ props }">
      <shared-custom-field
        :id="id"
        :model-value="formattedTime"
        class="custom-time-picker-input"
        readonly
        rounded
        :required="required"
        prepend-inner-icon="mdi-clock"
        v-bind="{ ...$attrs, ...props }"
        clearable
      />
    </template>
    <v-time-picker
      v-model="inputVal"
      color="primary"
      ampm-in-title
    />
  </v-menu>
</template>

<script>
import moment from 'moment';
import { VTimePicker } from 'vuetify/labs/components';

export default {
  name: 'CustomDatePicker',
  components: {
    VTimePicker,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    modelValue: {
      type: [String, Array],
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    timeFormat: {
      type: String,
      default: () => 'hh:mm a',
    },
    range: {
      type: Boolean,
      default: false,
    },
    allowedDates: {
      type: Function,
      default: (val) => val,
    },
  },
  data() {
    return {
      isMenuOpen: false,
      date: new Date(),
    };
  },
  computed: {
    formattedTime() {
      if (!this.inputVal) return null;
      return moment(this.inputVal, 'HH:mm').format(this.timeFormat);
    },
    inputVal: {
      get() {
        if (!this.modelValue) return null;
        return moment(this.modelValue, this.timeFormat).format(
          'HH:mm'
        );
      },
      set(val) {
        this.isMenuOpen = false;
        this.$emit(
          'update:modelValue',
          moment(val, 'HH:mm').format(this.timeFormat)
        );
      },
    },
  },
  methods: {},
};
</script>
<style lang="scss">
.custom-time-picker-input {
  .v-text-field--rounded > .v-input__control > .v-input__slot {
    padding: 0 12px !important;
  }
}
</style>

<template>
  <v-menu
    v-model="isMenuOpen"
    :close-on-content-click="false"
    :nudge-right="0"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template #activator="{ props }">
      <shared-custom-field
        :id="id"
        v-model="formattedDate"
        class="custom-date-picker-input"
        readonly
        rounded
        :required="required"
        prepend-inner-icon="mdi-calendar"
        v-bind="{ ...$attrs, ...props }"
        clearable
      />
    </template>
    <v-date-picker
      v-model="inputVal"
      :range="range"
      :allowed-dates="allowedDates"
      @update:modelValue="onInput"
    />
  </v-menu>
</template>

<script>
  import moment from 'moment';

  export default {
    name: 'CustomDatePicker',
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
      inputVal: {
        get() {
          const val = this.modelValue
            ? new Date(this.modelValue)
            : null;
          return val;
        },
        set(val) {
          this.$attrs['onUpdate:modelValue'](
            moment(val).format('YYYY-MM-DD')
          );
        },
      },
      formattedDate() {
        if (!this.inputVal) return '';

        return moment(this.inputVal).format('YYYY-MM-DD');
      },
    },
    methods: {
      onInput(val) {
        if (!this.range || val.filter((i) => i).length > 0) {
          this.isMenuOpen = false;
          this.$emit('onDateSelect', val);
        }
      },
    },
  };
</script>
<style lang="scss">
  .custom-date-picker-input {
    .v-text-field--rounded > .v-input__control > .v-input__slot {
      padding: 0 12px !important;
    }
  }
</style>

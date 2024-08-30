<template>
  <v-dialog
    v-model="display"
    persistent
    :width="dialogWidth"
  >
    <template v-slot:activator="{ props }">
      <shared-custom-field
        :id="`text-field-props-${id}`"
        v-bind="{ ...textFieldProps, ...props }"
        :disabled="disabled"
        :loading="loading"
        :label="label"
        :required="required"
        :placeholder="placeholder"
        :model-value="formattedDatetime"
        prepend-inner-icon="mdi-calendar-clock"
        readonly
      >
        <template #progress>
          <slot name="progress">
            <v-progress-linear
              color="primary"
              indeterminate
              absolute
              height="2"
            />
          </slot>
        </template>
      </shared-custom-field>
    </template>
    <v-card>
      <v-card-text class="px-0 py-0">
        <v-tabs
          v-model="activeTab"
          fixed-tabs
        >
          <v-tab value="calendaTab">
            <v-icon
              class="mr-1"
              small
            >
              mdi-calendar
            </v-icon>
            Date
          </v-tab>
          <v-tab
            value="timerTab"
            :disabled="dateSelected"
          >
            <v-icon
              class="mr-1"
              small
            >
              mdi-clock
            </v-icon>
            Time
          </v-tab>
        </v-tabs>
        <v-tabs-window v-model="activeTab">
          <v-tabs-window-item value="calendaTab">
            <v-date-picker
              v-model="date"
              v-bind="datePickerProps"
              full-width
              @update:modelValue="showTimePicker"
            />
          </v-tabs-window-item>
          <v-tabs-window-item value="timerTab">
            <v-time-picker
              ref="timerPicker"
              v-model="time"
              ampm-in-title
              color="primary"
              class="v-time-picker-custom"
              v-bind="timePickerProps"
              full-width
            />
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <shared-custom-btn
          :id="cancelBtnId"
          variant="elevated"
          @click.native="clearHandler"
        >
          {{ clearText }}
        </shared-custom-btn>
        <shared-custom-btn
          :id="okBtnId"
          color="primary"
          variant="elevated"
          @click="okHandler"
        >
          {{ okText }}
        </shared-custom-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import moment from 'moment';
  import { VTimePicker } from 'vuetify/labs/components';

  const DEFAULT_DATE = null;
  const DEFAULT_TIME = '00:00:00';
  const DEFAULT_DIALOG_WIDTH = 340;
  const DEFAULT_CLEAR_TEXT = 'Clear';
  const DEFAULT_OK_TEXT = 'Ok';
  export default {
    name: 'CustomDateTimePicker',
    model: {
      prop: 'datetime',
      event: 'input',
    },
    components: {
      VTimePicker,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
      modelValue: {
        type: [Date, String],
        default: null,
      },
      disabled: {
        type: Boolean,
      },
      loading: {
        type: Boolean,
      },
      label: {
        type: String,
        default: '',
      },
      required: {
        type: Boolean,
        default: false,
      },
      placeholder: {
        type: String,
        default: '',
      },
      dialogWidth: {
        type: Number,
        default: DEFAULT_DIALOG_WIDTH,
      },
      clearText: {
        type: String,
        default: DEFAULT_CLEAR_TEXT,
      },
      okText: {
        type: String,
        default: DEFAULT_OK_TEXT,
      },
      textFieldProps: {
        type: Object,
        default: () => {},
      },
      datePickerProps: {
        type: Object,
        default: () => {},
      },
      timePickerProps: {
        type: Object,
        default: () => {},
      },
      clearDateTime: {
        type: Boolean,
        default: false,
      },
      rules: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        display: false,
        activeTab: 0,
        date: DEFAULT_DATE,
        time: DEFAULT_TIME,
        errorMessages: [],
      };
    },
    computed: {
      datetime: {
        get() {
          return this.modelValue;
        },
        set(val) {
          this.$emit('update:modelValue', val);
        },
      },
      cancelBtnId() {
        return `${this.id}_cancelBtn`;
      },
      okBtnId() {
        return `${this.id}_okBtn`;
      },
      textFieldId() {
        return `${this.id}_textFieldId`;
      },
      formattedDatetime() {
        if (!this.selectedDatetime) {
          return '';
        }
        const [hourStr, minStr] = this.time.split(':');
        let hour = parseInt(hourStr, 10);
        const amOrPm = hour < 12 ? 'a.m' : 'p.m';
        if (hour > 12) {
          hour %= 12;
        } else if (hour === 0) {
          hour = 12;
        }
        const date = moment(this.date).format('YYYY-MM-DD');
        return `${date} ${hour}:${minStr} ${amOrPm}`;
      },
      selectedDatetime() {
        if (this.date && this.time) {
          let datetimeString = `${moment(this.date).format(
            'YYYY-MM-DD'
          )}T${this.time}`;
          if (this.time.length === 5) {
            datetimeString += ':00';
          }

          const result = `${datetimeString}Z`;
          return result;
        }
        return null;
      },
      dateSelected() {
        return !this.date;
      },
    },
    watch: {
      datetime(newVal) {
        this.init(newVal);
        this.runRules(newVal);
      },
      clearDateTime(newValue) {
        if (newValue) {
          this.clearHandler();
          this.$emit('updateClearDateTimeFlag');
        }
      },
    },
    mounted() {
      this.init();
    },
    methods: {
      init(newVal) {
        if (!this.datetime) {
          if (newVal === null) {
            this.date = DEFAULT_DATE;
            this.time = DEFAULT_TIME;
          }
          return;
        }
        let initDateTime;
        if (this.datetime instanceof Date) {
          initDateTime = this.datetime;
        } else if (
          typeof this.datetime === 'string' ||
          this.datetime instanceof String
        ) {
          initDateTime = new Date(Date.parse(this.datetime));
        }
        const [dateStr, timeStr] = initDateTime
          .toISOString()
          .split('T');
        this.date = new Date(dateStr);
        this.time = timeStr.replace('.000Z', '');
      },
      okHandler() {
        this.resetPicker();
        this.$emit('update:modelValue', this.selectedDatetime);
        this.$emit('change', this.selectedDatetime);
      },
      clearHandler() {
        this.resetPicker();
        this.date = DEFAULT_DATE;
        this.time = DEFAULT_TIME;
        this.$emit('update:modelValue', null);
        this.$emit('change', null);
      },
      resetPicker() {
        this.display = false;
        this.activeTab = 0;
        if (this.$refs.timerPicker) {
          this.$refs.timerPicker.selectingHour = true;
        }
      },
      showTimePicker() {
        this.activeTab = 1;
      },
      runRules(newVal) {
        this.errorMessages = [];
        this.rules.forEach((rule) => {
          const result = rule(newVal);
          if (typeof result === 'string') {
            this.errorMessages.push(result);
          }
        });
      },
    },
  };
</script>
<style lang="scss">
  .v-time-picker-custom {
    .v-picker__title {
      height: 84px;
      padding-top: 10px;
    }
  }
  .v-picker__title__btn--active {
    cursor: pointer;
  }
</style>

<template>
  <v-menu
    ref="menuRef"
    v-model="menu"
    :close-on-content-click="false"
    offset-y
    max-width="635px"
    min-width="320px"
    nudge-bottom="5"
  >
    <template v-slot:activator="{ props }">
      <div>
        <div class="mb-2">
          <span>
            <strong> {{ label }} </strong>
            <span v-if="required && label" style="color: red">*</span>
          </span>
        </div>
        <div style="width: 100%" class="d-flex align-center">
          <v-btn
            v-if="!isAllSelected"
            dark
            size="small"
            variant="plain"
            icon="mdi-chevron-left"
            :disabled="isAllSelected"
            @click="onPrevious"
          />
          <v-text-field
            v-bind="props"
            :value="labelToShow"
            readonly
            density="compact"
            variant="outlined"
            flat
            class="centered-input"
            bg-color="rgba(var(--v-theme-background))"
            hide-details
            append-inner-icon="mdi-menu-down"
            @click:append="menu = !menu"
          />
          <v-btn
            v-if="!isAllSelected"
            dark
            size="small"
            variant="plain"
            icon="mdi-chevron-right"
            :disabled="isAllSelected"
            @click="onNext"
          />
        </div>
      </div>
    </template>
    <v-card class="mx-auto pa-4">
      <div style="width: 100%" class="d-flex justify-center">
        <customDatePickerTabs :active-tab="activeTab" @update="onTabChange" />
      </div>
      <div
        class="mt-5"
        :class="{
          'd-flex justify-center': activeTab !== TAB_NAMES.customRange,
        }"
      >
        <customDatePickerRange
          v-if="activeTab === TAB_NAMES.customRange"
          :selected-range-option="selectedRangeOption"
          :range="customRange"
          @rangeOptionChange="onRangeOptionChange"
          @setSelectedRange="setSelectedRange"
          @customRangeChange="onCustomRangeChange"
        />
        <customDatePickerMonth
          v-if="activeTab === TAB_NAMES.month"
          :selected-month="selectedMonth"
          @monthSelect="onMonthSelect"
        />
        <customDatePickerYear
          v-if="activeTab === TAB_NAMES.year"
          ref="yearPickerRef"
          :selected-year="selectedMonth"
          @yearSelect="onYearSelect"
        />
      </div>
    </v-card>
  </v-menu>
</template>

<script>
import { differenceInDays } from "date-fns";
import CustomDatePickerMonth from "./CustomDatePickerMonth.vue";
import CustomDatePickerYear from "./CustomDatePickerYear.vue";
import CustomDatePickerRange from "./CustomDatePickerRange.vue";
import CustomDatePickerTabs from "./CustomDatePickerTabs.vue";
import {
  DEFAULT_ACTIVE_TAB,
  DEFAULT_SELECTED_RANGE_OPTION,
  DEFAULT_RANGE,
  TAB_NAMES,
  RANGE_VALUE_MAP,
  PERSIST_DATA_PREFIX_KEY,
  KEYS_TO_PERSIST,
} from "./date-picker-config";
import { format } from "date-fns";

import { CALCULATE_RANGE_METHODS, formatLabel } from "./utils";

export default {
  name: "CustomDateRangePicker",
  components: {
    CustomDatePickerMonth,
    CustomDatePickerYear,
    CustomDatePickerRange,
    CustomDatePickerTabs,
  },
  props: {
    range: {
      type: Array,
      default() {
        return [];
      },
    },
    label: {
      type: String,
      default: "",
    },
    persistData: {
      type: Boolean,
      default: true,
    },
    persistDataKey: {
      type: String,
      default: "custom_date_picker",
    },
  },
  data: () => ({
    activeTab: DEFAULT_ACTIVE_TAB,
    selectedRangeOption: DEFAULT_SELECTED_RANGE_OPTION,
    selectedRange: DEFAULT_RANGE,
    TAB_NAMES,
    menu: false,
    labelToShow: "",
  }),
  computed: {
    selectedMonth() {
      let [year, month] = this.selectedRange[0].split("-");
      const currentYear = new Date().getFullYear();

      if (currentYear - 50 == year) {
        year = new Date().getFullYear();
      }

      return `${year}-${month}`;
    },
    rangeDiffInDays() {
      return differenceInDays(
        new Date(this.selectedRange[1]),
        new Date(this.selectedRange[0])
      );
    },
    localStorageKeyName() {
      return `${PERSIST_DATA_PREFIX_KEY}${this.persistDataKey}`;
    },
    isAllSelected() {
      return (
        this.activeTab === TAB_NAMES.customRange &&
        this.selectedRangeOption === RANGE_VALUE_MAP.all
      );
    },
    customRange() {
      var date = new Date();
      const currentYear = date.getFullYear();
      var firstDay = format(
        new Date(currentYear, date.getMonth(), 1),
        "yyyy-MM-dd"
      );
      var lastDay = format(
        new Date(currentYear, date.getMonth() + 1, 0),
        "yyyy-MM-dd"
      );

      const year = this.selectedRange[0].split("-")[0];

      if (currentYear - 50 == year) {
        return [firstDay, lastDay];
      }

      return this.selectedRange;
    },
  },
  watch: {
    selectedRange(value) {
      if (value && value.length >= 2 && value[0] !== value[1]) {
        this.setLabelToShow();
        this.persistDataIfEnabled();
      }
    },
  },
  mounted() {
    this.initRanges();
    this.setLabelToShow();
    this.$emit("init", {
      type: this.selectedRangeOption,
      range: this.selectedRange,
    });
  },
  methods: {
    initRanges() {
      if (this.range && this.range.length >= 2) {
        this.selectedRangeOption = RANGE_VALUE_MAP.customRange;
        this.activeTab = TAB_NAMES.customRange;
        this.persistDataIfEnabled("activeTab", this.activeTab);
        this.selectedRange = this.range;
        return;
      }
      const savedData = this.getPersistedData();

      if (this.persistData && savedData) {
        this.activeTab = savedData.activeTab;
        this.selectedRangeOption = savedData.selectedRangeOption;
      }
      this.selectedRange = CALCULATE_RANGE_METHODS[this.activeTab].current(
        new Date(),
        this.selectedRangeOption
      );
    },
    setLabelToShow() {
      this.labelToShow = formatLabel({
        activeTab: this.activeTab,
        selectedRange: this.selectedRange,
        selectedRangeOption: this.selectedRangeOption,
      });
    },

    onTabChange(value) {
      this.activeTab = value;
    },
    onYearSelect(date) {
      this.updateSelectedRangeAndEmit(`${date}-01`);
    },
    onMonthSelect(yearMonth) {
      this.updateSelectedRangeAndEmit(`${yearMonth}-01`);
    },
    onRangeOptionChange(value) {
      this.selectedRangeOption = value;
      if (value !== RANGE_VALUE_MAP.customRange) {
        this.updateSelectedRangeAndEmit(new Date());
      }
    },
    setSelectedRange(value) {
      this.selectedRange = value;
    },
    onCustomRangeChange() {
      this.menu = false;
      this.$emit("update", {
        type: this.selectedRangeOption,
        range: this.selectedRange,
      });
    },

    onNext() {
      if (this.activeTab === TAB_NAMES.customRange) {
        this.selectedRangeOption = RANGE_VALUE_MAP.customRange;
      }
      this.selectedRange = CALCULATE_RANGE_METHODS[this.activeTab].next(
        this.selectedRange[0],
        this.rangeDiffInDays
      );
      this.$emit("update", {
        type: this.selectedRangeOption,
        range: this.selectedRange,
      });
    },
    onPrevious() {
      if (this.activeTab === TAB_NAMES.customRange) {
        this.selectedRangeOption = RANGE_VALUE_MAP.customRange;
      }
      this.selectedRange = CALCULATE_RANGE_METHODS[this.activeTab].previous(
        this.selectedRange[0],
        this.rangeDiffInDays
      );
      this.$emit("update", {
        type: this.selectedRangeOption,
        range: this.selectedRange,
      });
    },
    persistDataIfEnabled() {
      if (!this.persistData) {
        return;
      }
      let savedData = this.getPersistedData() || {};
      savedData = KEYS_TO_PERSIST.reduce((acc, key) => {
        // TODO: NEED TO IMPROVE THIS CHECK
        if (this[key] === RANGE_VALUE_MAP.customRange) {
          return acc;
        }

        acc[key] = this[key];
        return acc;
      }, savedData);
      this.$localStorage.setItem(
        this.localStorageKeyName,
        JSON.stringify(savedData)
      );
    },
    getPersistedData() {
      return JSON.parse(
        this.$localStorage.getItem(this.localStorageKeyName) || "null"
      );
    },
    updateSelectedRangeAndEmit(value) {
      this.selectedRange = CALCULATE_RANGE_METHODS[this.activeTab].current(
        value,
        this.selectedRangeOption
      );
      this.menu = false;
      this.$emit("update", {
        type: this.selectedRangeOption,
        range: this.selectedRange,
      });
    },
  },
};
</script>
<style lang="scss">
.centered-input {
  .v-field {
    border-radius: 8px;
  }
  input {
    text-align: center;
  }
  .v-field__input {
    text-align: center;
  }
}
</style>

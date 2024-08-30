<template>
  <v-row>
    <v-col
      cols="12"
      :md="isCustomRangeOptionSelected ? '4' : '12'"
    >
      <v-radio-group
        :model-value="selectedRangeOption"
        @update:model-value="emitRangeOptionChange"
      >
        <v-radio
          v-for="option in availableRangeOptions"
          :key="option.id"
          :label="option.label"
          :value="option.value"
        />
      </v-radio-group>
    </v-col>
    <v-col
      v-if="isCustomRangeOptionSelected"
      cols="12"
      md="8"
    >
      <v-date-picker
        :model-value="computedDateRange"
        class="w-100"
        color="primary"
        multiple="range"
        @update:model-value="emitCustomRangeChange"
      />
    </v-col>
  </v-row>
</template>

<script>
  import moment from 'moment';
  import {
    RANGE_OPTIONS,
    RANGE_VALUE_MAP,
  } from './date-picker-config';

  export default {
    name: 'CustomDatePickerRange',
    props: {
      selectedRangeOption: {
        type: [Number, String],
        required: true,
      },
      range: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        availableRangeOptions: RANGE_OPTIONS,
      };
    },
    computed: {
      isCustomRangeOptionSelected() {
        return (
          this.selectedRangeOption === RANGE_VALUE_MAP.customRange
        );
      },
      computedDateRange() {
        const dates = [];
        let currentDate = moment(this.range[0]);
        while (currentDate.isSameOrBefore(this.range[1], 'day')) {
          dates.push(new Date(currentDate));
          currentDate.add(1, 'day');
        }
        return dates;
      },
    },
    methods: {
      emitRangeOptionChange(value) {
        this.$emit('rangeOptionChange', value);
      },
      emitCustomRangeChange(range) {
        const fromDate = moment(range[0]).format('YYYY-MM-DD');
        const toDate = moment(range[range.length - 1]).format(
          'YYYY-MM-DD'
        );
        this.$emit('setSelectedRange', [fromDate, toDate]);

        if (fromDate === toDate) return;

        this.$emit('customRangeChange', [fromDate, toDate]);
      },
    },
  };
</script>

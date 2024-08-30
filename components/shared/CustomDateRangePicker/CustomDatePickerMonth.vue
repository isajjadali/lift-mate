<template>
  <v-date-picker
    color="primary"
    view-mode="months"
    reactive
    :month="monthIndex"
    :year="computedYear"
    @update:month="onInput"
    @update:year="changeYear"
  />
</template>

<script>
  export default {
    name: 'CustomDatePickerMonth',
    props: {
      selectedMonth: {
        type: String,
        required: true,
      },
    },
    data: () => ({
      year: '',
    }),
    computed: {
      monthIndex() {
        return +this.selectedMonth.split('-')[1] - 1;
      },
      computedYear() {
        if (!this.year) this.year = this.selectedMonth.split('-')[0];
        return +this.year;
      },
    },
    methods: {
      onInput(monthIndex) {
        const formattedDate = `${this.year}-${monthIndex + 1}`;
        this.$emit('monthSelect', formattedDate);
      },
      changeYear(year) {
        this.year = year;
      },
    },
  };
</script>

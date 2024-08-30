<template>
  <div
    v-if="surges.length || returnSurges.length"
    class="w-100"
  >
    <v-col
      cols="12"
      class="py-0"
    >
      <div v-if="allSurges.length === 1">
        <shared-custom-span :help-text="allSurges[0].description">
          <strong class="text-error">Surge ({{ allSurges[0].name }}): </strong>
          <span v-if="+allSurges[0].amount">  <shared-amount-value :amount=" allSurges[0].amount" /> </span>
          <span v-else> {{ allSurges[0].percentage }}% </span>
        </shared-custom-span>
      </div>
      <div
        v-for="(bothSurges, index) in [surges, returnSurges]"
        v-else
        :key="index"
      >
        <div
          v-if="bothSurges.length"
          class="pt-2"
        >
          <h3 class="text-error">
            Surges{{ !index ? "" : " on Return" }}:
          </h3>
        </div>
        <div
          v-for="(item, i) in bothSurges"
          :key="i"
        >
          <shared-custom-span :help-text="item.description">
            <strong>{{ item.name }}: </strong>
            <span v-if="+item.amount"> <shared-amount-value :amount="item.amount" /></span>
            <span v-else> {{ item.percentage }}% </span>
          </shared-custom-span>
        </div>
      </div>
    </v-col>
    <v-col
      v-if="allSurges.length > 1"
      cols="12"
      class="py-0"
    >
      <div v-if="surgePercentage">
        <span><strong> Total Surge Percentage: </strong>
          {{ surgePercentage }}%</span>
      </div>
      <div v-if="surgeAmount">
        <span><strong> Total Surge Amount: </strong><shared-amount-value :amount="surgeAmount" /></span>
      </div>
      <v-divider class="my-2" />
    </v-col>
  </div>
</template>

<script>
export default {
    name: 'SurgeCalculation',
    props: {
        surges: {
            type: Array,
            default: () => [],
        },
        returnSurges: {
            type: Array,
            default: () => [],
        },
    },

    data: () => ({
        count: 0,
        surgeAmount: null,
        surgePercentage: null,
    }),
    computed: {
        allSurges() {
            this.setAmount();
            return [...this.surges, ...this.returnSurges];
        }
    },
    created() {
        this.surgeTotalPercentage();
    },
    methods: {
        setAmount() {
            this.$emit( 'surgesCalculation', {
                amount : this.surgeAmount, 
                percentage : this.surgePercentage
            }); 
        },

        surgeTotalPercentage() {
            this.surgeAmountPercentageSum(this.surges);
            this.surgeAmountPercentageSum(this.returnSurges);
        },
        surgeAmountPercentageSum(surges) {
            return surges.forEach((obj) => {
                if (+obj.amount) {
                    this.surgeAmount = this.surgeAmount + +obj.amount;
                } else {
                    this.surgePercentage = this.surgePercentage + +obj.percentage;
                }
            });
        },
    },
};
</script>

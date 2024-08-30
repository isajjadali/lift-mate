<template>
  <div v-if="surges.length > 0">
    <v-tooltip
      top
      color="black"
    >
      <template #activator="{ props }">
        <v-icon
          v-bind="props"
          color="warning"
        >
          mdi-alert
        </v-icon>
      </template>
      <ul class="pb-2"> 
        <li
          v-for="(item, i) in surges"
          :key="i"
        >
          {{ item.description }}
        </li>
      </ul>
      <p>
        Due to the following reasons additional <span class="text-error">{{ surgePercentage }}%</span> will be added in your total bill.
      </p>
    </v-tooltip>
  </div>
</template>

<script>
export default {
    name: 'SurgeWarnings',
    props: {
        surges: {
            type: Array,
            default: () =>[],
        },
    },
    computed:{
        surgePercentage() {
            return this.surges.reduce((acc, surge) => {
                acc += +surge.percentage;
                return acc;
            }, 0);
        },
    },
};
</script>

<template>
  <span>${{ toFixed(amount) }}</span>
</template>

<script>
export default {
    name: 'AmountValue',
    props: {
        amount: {
            type: [String, Number],
            default: 0,
        },
    },
    methods: {
        toFixed(value) {
            if (`${value}`.includes('.')) {
                return Number(value).toFixed(2);
            }
            return value;
        },
    },
};
</script>

<template>
  <v-btn
    :id="id"
    v-bind="$attrs"
    rounded
    class="px-5"
  >
    <slot />
  </v-btn>
</template>

<script>
export default {
    name: 'CustomBtn',
    props: {
        id: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            default: '',
        },
    },
};
</script>

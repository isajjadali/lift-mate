<template>
  <v-btn
    :id="id"
    v-bind="$attrs"
    rounded
    color="primary"
    class="px-5"
  >
    <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
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

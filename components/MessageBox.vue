<template>
  <v-container v-if="messages.length">
    <v-row
      style="border-radius: 10px; border: 1px solid #d9bebe !important;"
      :class="types[type].classes"
    >
      <v-col cols="12">
        <h4 class="mb-1">
          <v-icon
            :color="types[type].color"
            class="mb-1"
          >
            {{ types[type].icon }}
          </v-icon>
          {{ types[type].heading }}
        </h4>
        <p v-if="description" class="mb-4">
          {{ description }}
        </p>
        <ul class="pl-8">
          <li
            v-for="(msg, index) in messages"
            :key="index"
          >
            {{ msg }}
          </li>
        </ul>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
    name: 'MessageBox',
    components: {},
    props: {
        messages: {
            type: [String, Array],
            default: () => [],
        },
        description: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            default: 'error',
        },
    },
    data: () => ({
        types: {
            error: {
                heading: 'Errors',
                color: 'error',
                classes: 'bg-deep-orange-lighten-4',
                icon: 'mdi-alert-circle-outline',
            },
            info: {
                heading: 'Info',
                color: 'info',
                classes: 'info-lighten-5',
                icon: 'bg-information-outline',
            },
            warning: {
                heading: 'Warnings',
                color: 'warning',
                classes: 'warning-lighten-5',
                icon: 'bg-alert-outline',
            },
            success: {
                heading: 'Success',
                color: 'primary',
                classes: 'primary-lighten-5',
                icon: 'bg-checkbox-marked-circle-outline',
            },
        },
    }),
};
</script>

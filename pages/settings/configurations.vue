<template>
  <nuxt-layout name="settings">
    <div>
      <v-card
        elevation="4"
        class="mb-4"
      >
        <v-card-title> Configurations </v-card-title>
      </v-card>
      <v-expansion-panels
        v-model="panel"
        multiple
      >
        <v-expansion-panel
          v-for="(item, index) in config"
          :key="index"
          :title="item.title"
        >
          <v-expansion-panel-text>
            <generic-form
              :fields-config="item.config"
              :data="$store.configurations[item.field]"
              :btns="{ show: ['submit'], submitLabel: 'Update' }"
              @onSubmit="
                (payload) => updateConfig(payload, item.field)
              "
            />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </nuxt-layout>
</template>
<script>
  import GenericForm from '@/shared/forms/GenericForm.vue';
  import { Messages } from '@/enums';
  import { Configs } from '@/enums/field-configurations/configurations.js';

  export default {
    name: 'ConFigs',
    components: {
      GenericForm,
    },
    data() {
      return {
        panel: [0],
      };
    },
    computed: {
      config() {
        return Configs.filter((config) =>
          this.hasPermission(config.permission)
        );
      },
    },
    methods: {
      updateConfig(payload, key) {
        this.$store.configurations[key] = payload;
        this.$store.setConfig(this.$store.configurations);
        this.$toast.success(
          Messages.success.configUpdatedSuccessfully
        );
      },
    },
  };
</script>

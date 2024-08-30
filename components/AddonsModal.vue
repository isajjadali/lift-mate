<template>
  <v-dialog
    v-model="dialogToggle"
    max-width="900"
    persistent
  >
    <v-card>
      <v-toolbar
        color="primary"
        dark
      >
        <v-toolbar-title class="text-center">
          Add Addons
        </v-toolbar-title>
        <template v-slot:append>
          <v-btn
            id="close-modal"
            icon
            @click="$emit('change', false) && reset()"
          >
            <v-icon> mdi-close </v-icon>
          </v-btn>
        </template>
      </v-toolbar>
      <v-container class="pa-7">
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <strong>Reservation No:</strong>
            <span class="text-primary ml-2"
              >{{ reservationNumber }}
            </span>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            :sm="addons.length ? 9 : 12"
          >
            <generic-form
              v-if="dialogToggle"
              :fields-config="fieldsConfig"
              :data="addon"
              :loading="isReservationUpdating"
              :btns="{ show: ['submit'], submitLabel: 'Add' }"
              @onSubmit="(payload) => $emit('onSubmit', payload)"
            />
          </v-col>
          <v-col
            v-if="addons.length"
            cols="12"
            sm="3"
          >
            <v-row>
              <v-col
                cols="12"
                class="pt-10 pb-0"
              >
                <shared-custom-field
                  id="static-page-search-field"
                  v-model="search"
                  color="primary"
                  placeholder="Search"
                  prepend-inner-icon="mdi-magnify"
                  clearable
                  @keyup="onChange()"
                  @click:clear="onClear()"
                />
              </v-col>
              <v-col class="pt-0 pa-0">
                <v-list
                  v-if="dialogToggle"
                  class="v-list"
                  height="250px"
                  overflow-y="auto"
                  scrollable
                  density="compact"
                  nav
                >
                  <v-list-subheader>Addons</v-list-subheader>
                  <v-list-item
                    v-for="(item, i) in filteredAddons"
                    color="primary"
                    :key="i"
                    scrollable
                    :value="item"
                    :title="item.name"
                    @click="() => onPageChange(i)"
                  />
                </v-list>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
  import _ from 'lodash';
  import GenericForm from '@/shared/forms/GenericForm.vue';

  export default {
    name: 'AddonsModal',
    components: {
      GenericForm,
    },
    props: {
      open: {
        type: Boolean,
        default: false,
        type: Boolean,
        default: false,
      },
      reservationNumber: {
        type: String,
        default: '',
      },
      isReservationUpdating: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        addons: [],
        addon: {},
        search: '',
        filteredAddons: [],
      };
    },
    computed: {
      fieldsConfig() {
        return [
          {
            id: 'Name',
            vModel: 'name',
            label: 'Name',
            sm: 12,
            cols: 12,
            required: true,
          },
          {
            id: 'amount',
            vModel: 'amount',
            type: 'number',
            label: 'Amount',
            requiredError: 'Amount or percentage is required',
            sm: 6,
            cols: 12,
            required: true,
            optionalIf: 'percentage',
          },
          {
            id: 'percentage',
            vModel: 'percentage',
            type: 'number',
            label: 'Percentage',
            requiredError: 'Amount or percentage is required',
            sm: 6,
            cols: 12,
            required: true,
            optionalIf: 'amount',
          },
          {
            id: 'comment',
            type: 'textarea',
            vModel: 'comments',
            label: 'Comments',
            sm: 12,
            cols: 12,
            required: true,
          },
        ];
      },
      addonsFromLS() {
        const value = this.$localStorage.getItem('addons');
        if (!value) return [];
        return JSON.parse(value);
      },
      dialogToggle: {
        get() {
          return this.open;
        },
        set(value) {
          this.$emit('toggle', value);
        },
      },
    },
    watch: {
      async open(newValue) {
        if (newValue) {
          this.addon = {};
          this.setAddons();
          return newValue;
        }
      },
    },
    methods: {
      async setAddons() {
        this.addons = this.addonsFromLS;
        this.filteredAddons = [...this.addons];
      },
      onPageChange(index) {
        this.addon = _.cloneDeep(this.addons[index]);
      },
      onChange() {
        if (!this.search) {
          return (this.filteredAddons = [...this.addons]);
        }
        this.filteredAddons = this.addons.filter((addon) =>
          addon.name.toLowerCase().includes(this.search)
        );
      },
      onClear() {
        this.search = '';
        this.filteredAddons = [...this.addons];
      },
    },
  };
</script>
<style scoped>
  .v-list {
    overflow-y: auto;
  }
</style>

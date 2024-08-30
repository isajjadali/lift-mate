<template>
  <v-dialog
    v-model="toggleDialog"
    scrollable
    max-width="600"
    min-width="500"
    persistent
  >
    <v-card :scrollable="false">
      <v-toolbar
        color="primary"
        dark
      >
        <v-spacer />
        <v-toolbar-title>
          {{ `Edit ${title}` }}
        </v-toolbar-title>
        <v-spacer />
        <v-icon @click="onCancel">
          mdi-close
        </v-icon>
      </v-toolbar>
      <shared-custom-field
        id="search-field-for-assign-deassign-modal"
        v-model="search"
        class="pa-2"
        color="primary"
        placeholder="Search"
        prepend-inner-icon="mdi-magnify"
        clearable
        single-line
        hide-details
        @keyup="onSearch"
      />
      <v-tabs v-model="tab">
        <v-tab
          v-for="(tb, index) in tabs"
          :key="index"
        >
          {{ tb.title }}
        </v-tab>
      </v-tabs>
      <v-card-text
        class="pa-0"
        style="height: 600px"
      >
        <v-tabs-window v-model="tab">
          <v-tabs-window-item
            v-for="(tb, index) in tabs"
            :key="index"
          >
            <shared-custom-data-table
              id="editpermissions"
              v-model="selectedItems"
              scrollable
              :headers="headers"
              :hide-default-footer="true"
              :items-per-page="-1"
              :items=" filteredItems.length ? filteredItems : getDesiredPayload(tab)"
              show-select
            />
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <shared-custom-btn
          id="generic-form-cancel-btn"
          class="mr-2"
          @click="onCancel"
        >
          Cancel
        </shared-custom-btn>
        <shared-custom-btn
          id="generic-form-submit-btn"
          class="float-right"
          color="primary"
          @click="onSubmit"
        >
          Submit
        </shared-custom-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import CrudMixin from '@/mixins/CrudMixin';

export default {
    name: 'AssignDeassignedModal',
    mixins: [CrudMixin],
    props: {
        open: {
            type: Boolean,
            default: false,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: 'Records',
        },
        items: {
            type: Array,
            default: () => [],
        },
        headers: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            tab: null,
            tabs: [
                {
                    title: 'All',
                },
                {
                    title: 'Assigned',
                },
                {
                    title: 'Unassigned',
                },
            ],
            search: '',
            filteredItems:[],
            payload: [],
        };
    },
    computed: {
        selectedItems: {
            get() {
                return this.items.filter(
                    (item) => item.isSelected === true
                );
            },
            set(value) {
                this.payload = value;
            },
        },
        toggleDialog: {
          get() {
            return this.open;
          },
          set(value) {
            this.$emit('change', value);
          },
        },
    },
    methods: {
        getDesiredPayload(tab) {
            let items=[];
            switch (tab) {
            case 0:
                items= this.items;
                break;
            case 1:
                items= this.items.filter(
                    (item) => item.isSelected === true
                );
                break;
            case 2:
                items= this.items.filter(
                    (item) => item.isSelected === false
                );
                break;
            default:
                items= [];
            }
            return items;
        }, 
        onCancel() {
            this.payload = [];
            this.$emit('onCancel');
        },
        onSubmit() {
            this.$emit(
                'onSubmit',
                this.payload.map((per) => per.id)
            );
            this.onCancel();
        },
        onSearch(){
            if(!this.search){
                return this.filteredItems=[];
            }
            this.filteredItems = this.getDesiredPayload(this.tab)
                .filter((a)=>a.name.includes(this.search));
        },
    },
};
</script>

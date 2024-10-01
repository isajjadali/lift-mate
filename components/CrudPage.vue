``<template>
  <v-container
    fluid
    class="crud-page"
  >
    <!-- <v-row>
      <v-col
        cols="12"
        sm="4"
        md="2"
      />
      <v-col
        cols="12"
        sm="8"
        md="10"
      >
        <v-row
          class="w-100 mx-0"
          justify="center"
        >
          <v-col
            sm="6"
            md="4"
            cols="12"
          >
            <shared-custom-date-range-picker
              :persist-data="false"
              label="Filter Date"
              persist-data-key="activities"
              @update="setRange"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row> -->
    <v-row>
      <!-- <v-col
        cols="12"
        sm="4"
        md="2"
      >
        <v-card
          rounded="lg"
          min-height="268"
        >
          <side-bar
            :title="meta.title"
            :url="url"
            :user="$store.user"
            :create-action="createAction"
            :status-key="meta.statusKey"
            :filters="meta.filters"
            :callbacks="meta.callbacks"
            :is-available-status="meta.isAvailableStatus"
            :headers="meta.headers"
            :query-params="meta.queryParams"
            @setReloadTableListFlag="setReloadTableListFlag"
            @onFilter="onFilter"
          />
        </v-card>
      </v-col> -->

      <v-col
        cols="12"
        sm="8"
        md="10"
      >
          <crud-table
            :title="meta.title"
            :user="$store.user"
            :url="url"
            :actions="actions"
            :callbacks="meta.callbacks"
            :headers="meta.headers"
            :show-select="meta.showSelect"
            :query-params="{ ...meta.queryParams, ...filters }"
            :should-reload-list="shouldReloadList"
            @setReloadTableListFlag="setReloadTableListFlag"
          />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { PERMISSIONS } from '@/enums';
import moment from 'moment';

export default {
    name: 'CrudPage',
    data() {
        return {
            items: [],
            shouldReloadList: false,
            filters: '',
            dates: ['', ''],
            PERMISSIONS,
        };
    },
    props: {
      meta: {
        type: Object,
        default: () => {}
      }
    },
    computed: {
        url() {
            return this?.meta?.backendPath || this.$route?.path;
        },
        createAction() {
            return (
                (this.meta.actions || []).find(
                    (action) =>
                        action.name === 'CREATE'// && this.hasPermission(action.permission)
                ) || {}
            );
        },
        actions() {
            const actions = (this.meta?.actions || []).filter(
                (action) =>
                    this.hasPermission(action.permission) && action.name !== 'CREATE'
            );
            return actions;
        },
    },
    methods: {
        setReloadTableListFlag(value) {
            this.shouldReloadList = value;
        },
        onFilter(filters) {
            this.filters = filters;
        },
        setRange(e) {
            this.dates = e.range;
            let fromDate = this.dates[0];
            let toDate = this.dates[1];
            const today = moment().format('YYYY-MM-DD');

            if (e.type === 1) {
                fromDate = moment(fromDate).startOf('day').format();
                toDate = moment(toDate).startOf('day').format();
            } else if (fromDate === today && toDate > today) {
                fromDate = moment(fromDate).endOf('day').format();
                toDate = moment(toDate).endOf('day').format();
            } else {
                fromDate = moment(fromDate).startOf('day').format();
                toDate = moment(toDate).endOf('day').format();
            }

            this.filters = {
                ...this.filters,
                fromDate,
                toDate,
            };
        },
    },
};
</script>
<style>
.crud-page {
  padding-left: 5% !important;
  padding-right: 5% !important;
}
</style>

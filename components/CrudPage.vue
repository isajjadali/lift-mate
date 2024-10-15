<template>
  <v-container fluid class="crud-page">
    <v-row justify="center">
      <v-col cols="10">
        <v-container fluid>
          <v-row>
            <v-col cols="12" class="pb-0">
              <h2>{{ meta.title }}</h2>
            </v-col>
            <v-col cols="6">
              <custom-banner
                :description="meta.description"
                :img-url="meta.imgUrl"
                :headers="meta.headers"
                :url="url"
                width="100"
                :user="$store.user"
                :create-action="createAction"
                :status-key="meta.statusKey"
                :callbacks="meta.callbacks"
                :is-available-status="meta.isAvailableStatus"
                :query-params="meta.queryParams"
                @setReloadTableListFlag="setReloadTableListFlag"
              />
            </v-col>
            <v-col cols="6" align-self="end">
              <custom-filters
                class="pa-0"
                :url="url"
                width="100"
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
                @update="setRange"
              />
            </v-col>
            <v-col cols="12">
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { PERMISSIONS } from "@/enums";
import moment from "moment";
import CustomFilters from "./shared/CustomFilters.vue";
import CustomDateRangePicker from "./shared/CustomDateRangePicker/CustomDateRangePicker.vue";

export default {
  components: { CustomFilters, CustomDateRangePicker },
  name: "CrudPage",
  data() {
    return {
      items: [],
      shouldReloadList: false,
      filters: "",
      dates: ["", ""],
      PERMISSIONS,
    };
  },
  props: {
    meta: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    url() {
      console.log(this.$route);
      return this?.meta?.backendPath || this.$route?.path;
    },
    createAction() {
      return (
        (this.meta.actions || []).find(
          (action) => action.name === "CREATE" // && this.hasPermission(action.permission)
        ) || {}
      );
    },
    actions() {
      const actions = (this.meta?.actions || []).filter((action) => {
        console.log(this.hasPermission(action.permission));
        return (
          this.hasPermission(action.permission) && action.name !== "CREATE"
        );
      });
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
      const today = moment().format("YYYY-MM-DD");

      if (e.type === 1) {
        fromDate = moment(fromDate).startOf("day").format();
        toDate = moment(toDate).startOf("day").format();
      } else if (fromDate === today && toDate > today) {
        fromDate = moment(fromDate).endOf("day").format();
        toDate = moment(toDate).endOf("day").format();
      } else {
        fromDate = moment(fromDate).startOf("day").format();
        toDate = moment(toDate).endOf("day").format();
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
  padding-left: 0% !important;
  padding-right: 0% !important;
}
</style>
<!-- NOTE: Design for card elevation -->
<!-- style="
        border-radius: 16px;
        padding: 1rem 2.5rem !important;
        background: white !important;
        box-shadow: 0 6px 32px rgba(44, 50, 169, 0.04) !important;
        border-radius: 20px !important;
      " -->
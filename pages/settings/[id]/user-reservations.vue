<template>
  <div>
    <v-card elevation="0" class="mb-4 body pa-5">
      <v-card-title> Jobs </v-card-title>
      <v-row>
        <v-col cols="12">
          <custom-expansion-panel title="Filters">
            <v-row>
              <v-col
                cols="12"
                md="3"
                :class="$vuetify.display.smAndDown ? 'px-0' : 'mt-2'"
              >
                <shared-custom-date-range-picker
                  :range="dates"
                  :persist-data="true"
                  persist-data-key="jobs-date-range"
                  label="Filter Date"
                  @update="setRange"
                />
              </v-col>
              <v-col v-if="!$vuetify.display.smAndDown" md="4" cols="12" />
              <v-col
                cols="12"
                md="5"
                :class="$vuetify.display.smAndDown ? 'px-7' : ''"
              >
                <shared-custom-field
                  id="custom-search-field"
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  placeholder="Search..."
                  hide-details
                  @keyup="onSearch"
                />
              </v-col>
              <v-col
                v-for="(item, index) in filterItems"
                :key="index"
                cols="12"
                md="3"
                sm="12"
                xs="12"
                :class="$vuetify.display.smAndDown ? 'py-0' : ''"
              >
                <v-treeview
                  v-model="treeFilter[index]"
                  :items="item"
                  selectable
                  selected-color="primary"
                  return-object
                  open-all
                  select-strategy="classic"
                  item-title="name"
                  @update:modelValue="(e) => onTreeChange(e, index)"
                />
              </v-col>
            </v-row>
          </custom-expansion-panel>
          <!-- <v-expansion-panels elevation="0" multiple>
          <v-expansion-panel>
            <v-expansion-panel-title>
              <h4>Filters</h4>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row>
                <v-col
                  cols="12"
                  md="3"
                  :class="$vuetify.display.smAndDown ? 'px-0' : 'mt-2'"
                >
                  <shared-custom-date-range-picker
                    :range="dates"
                    :persist-data="true"
                    persist-data-key="jobs-date-range"
                    label="Filter Date"
                    @update="setRange"
                  />
                </v-col>
                <v-col v-if="!$vuetify.display.smAndDown" md="4" cols="12" />
                <v-col
                  cols="12"
                  md="5"
                  :class="$vuetify.display.smAndDown ? 'px-7' : ''"
                >
                  <shared-custom-field
                    id="custom-search-field"
                    v-model="search"
                    prepend-inner-icon="mdi-magnify"
                    placeholder="Search..."
                    hide-details
                    @keyup="onSearch"
                  />
                </v-col>
                <v-col
                  v-for="(item, index) in filterItems"
                  :key="index"
                  cols="12"
                  md="2"
                  sm="12"
                  xs="12"
                  :class="$vuetify.display.smAndDown ? 'py-0' : ''"
                >
                  <v-treeview
                    v-model="treeFilter[index]"
                    :items="item"
                    selectable
                    selected-color="primary"
                    return-object
                    open-all
                    select-strategy="classic"
                    item-title="name"
                    @update:modelValue="(e) => onTreeChange(e, index)"
                  />
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels> -->
        </v-col>
        <v-col cols="12">
          <shared-custom-data-table
            id="user-reservations"
            v-model="selectedReservations"
            class="w-100 data-table"
            mobile-breakpoint="100"
            :headers="headers"
            :items="filteredReservations"
            :loading="isLoading"
            :items-per-page="limit"
            disable-pagination
            show-select
            hide-default-footer
            @toggle-select-all="onToggleSelectAll"
            @item-selected="onItemSelection"
          >
            <template #top>
              <v-toolbar flat>
                <v-spacer />
                <v-menu transition="slide-y-transition" bottom>
                  <template #activator="{ props }">
                    <v-btn
                      class="float-right mt-2"
                      text
                      v-bind="props"
                      :disabled="!filteredReservations.length"
                    >
                      <v-icon>mdi-wrench-outline</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      id="action-btn-delete"
                      block
                      dense
                      class="ma-0"
                      @click="exportData"
                    >
                      <span class="px-2">
                        <v-icon left> mdi-cloud-download </v-icon>
                        Download CSV
                      </span>
                    </v-list-item>
                    <v-list-item
                      v-if="$store.user.isAdmin && userDetails.isDriver"
                      id="action-btn-delete"
                      block
                      dense
                      class="ma-0"
                      :disabled="selectedReservations.length ? false : true"
                      @click="markSelectedItemAsPaid"
                    >
                      <span class="px-2">
                        <v-icon left> mdi-check </v-icon>
                        Mark Paid
                      </span>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-toolbar>
            </template>
            <template #item.$$boolean="{ item, header }">
              {{
                typeof header.getValue === "function"
                  ? header.getValue({ item, header })
                    ? "Yes"
                    : "No"
                  : "N/A"
              }}
            </template>
          </shared-custom-data-table>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script>
import moment from "moment";
import UserService from "@/services/user";
import Service from "@/services/index";
import CommonMixin from "@/mixins/CommonMixin";
import ReservationMixin from "@/mixins/ReservationMixin";
import { excelParser } from "@/common";
import { DateHeader, Header, CreatedAtHeader, PERMISSIONS } from "@/enums";

export default {
  name: "UserReservations",
  mixins: [ReservationMixin, CommonMixin],
  props: {
    // : {
    //     type: Object,
    //     default: () => {},
    // },
  },
  data() {
    return {
      PERMISSIONS,
      UserService: {},
      search: "",
      panel: true,
      userId: null,
      limit: 1000,
      userDetails: {},
      service: "",
      offset: 0,
      isLoading: false,
      items: [],
      isConfirmationModalOpen: false,
      filterItems: [
        [
          {
            id: 1,
            name: "Completed",
            backendKey: "isCompleted",
            children: [
              { id: 2, name: "Yes", value: true },
              { id: 3, name: "No", value: false },
            ],
          },
        ],
        [
          {
            id: 4,
            name: "Paid",
            backendKey: "isPaid",
            children: [
              { id: 5, name: "Yes", value: true },
              { id: 6, name: "No", value: false },
            ],
          },
        ],
      ],
      treeFilter: {},
      filters: {},
      selectedReservations: [],
      dates: [],
    };
  },
  computed: {
    headers() {
      return [
        {
          ...Header,
          title: "Reservation #",
          valueFrom: "reservation.number",
        },
        {
          ...DateHeader,
          title: "Pickup Time",
          valueFrom: "reservation.pickUpDateTime",
        },
        {
          ...Header,
          title: "Pickup Location",
          valueFrom: "reservation.pickUpLocation",
        },
        {
          ...Header,
          title: "Dropoff Location",
          valueFrom: "reservation.dropOffLocation",
        },
        {
          ...Header,
          title: "Miles",
          valueFrom: "reservation.miles",
        },
        {
          ...Header,
          title: "Amount Charged",
          value: "$$amount",
          valueFrom: "price",
        },
        {
          ...Header,
          title: "Completed",
          value: "$$boolean",
          getValue: ({ item }) => item.reservation.status === "completed",
        },
        {
          ...Header,
          title: "Paid",
          value: "$$boolean",
          getValue: ({ item }) => item.isPaid,
          preCondition: (user, userDetails) => !userDetails?.isCustomer,
        },
        CreatedAtHeader,
      ].filter((i) =>
        i.preCondition
          ? i.preCondition(this.$store.user, this.userDetails)
          : true
      );
    },
    filteredReservations() {
      return this.items;
    },
    isFilterBtnVisible() {
      return Object.values(this.filters).some((updatedfilter) => {
        if (typeof updatedfilter === "string") {
          return updatedfilter;
        }
        return ["boolean"].includes(typeof updatedfilter);
      });
    },
  },
  created() {
    this.userId = this.$route?.params?.id;
    this.service = new Service("/users");
    this.setFiltersFromQuery();
    this.fetch();
  },
  methods: {
    async fetch() {
      try {
        const response = await this.service.get(this.userId);
        this.userDetails = response.data;
        this.isLoading = false;
      } catch (e) {
        this.error = e;
        this.isLoading = false;
      }
      this.fetchDetails();
    },
    exportData() {
      let items = this.items.filter((i) => i.isSelected);

      items = (items.length ? items : this.items).map((item) => {
        const tempItem = {};
        this.headers.forEach((h) => {
          tempItem[h.text] = h.getValue
            ? h.getValue({ item })
              ? "Yes"
              : "No"
            : this.getNestedValueFromObject(item, h.valueFrom || h.value);
        });

        tempItem["Created At"] = this.formatDate(
          tempItem["Created At"],
          false,
          "L"
        );
        tempItem["Pickup Time"] = this.formatDate(
          tempItem["Pickup Time"],
          false,
          "L"
        );

        return tempItem;
      });

      excelParser().exportDataFromJSON(items, null, null);
    },
    setFiltersFromQuery() {
      let filters = this.$route?.query?.filters;
      if (filters) {
        filters = JSON.parse(filters);
        this.search = filters.search;
        this.filters = filters;

        const keys = ["isCompleted", "isPaid"];

        keys.forEach((key, index) => {
          if (filters[key] !== null) {
            this.treeFilter[index] = this.filterItems[index][0].children.filter(
              (i) => i.value === filters[key]
            );
          }
        });
      }
    },
    async fetchDetails() {
      this.isLoading = true;
      const response = await UserService.listUserReservation(
        this.userDetails.id,
        {
          limit: this.limit,
          offset: this.offset,
          ...this.filters,
        }
      );
      this.items = response.dataItems;
      this.isLoading = false;
    },
    setRange(e) {
      this.dates = e.range;
      let fromDate = e.range[0];
      let toDate = e.range[1];

      if (fromDate > toDate) {
        [fromDate, toDate] = [toDate, fromDate];
      }

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
      this.setQueryParams();
    },
    onSearch() {
      this.filters = {
        ...this.filters,
        search: this.search,
      };
      this.setQueryParams();
    },
    onTreeChange(selectedValues, index) {
      if (!selectedValues.length || selectedValues.length === 2) {
        this.filters[this.filterItems[index][0].backendKey] = null;
      } else {
        this.filters[this.filterItems[index][0].backendKey] =
          selectedValues[0].value;
      }
      this.filters = {
        ...this.filters,
      };
      this.setQueryParams();
    },
    onToggleSelectAll(obj) {
      obj.items.forEach((item) => (item.isSelected = obj.value));
    },
    onItemSelection(obj) {
      obj.item.isSelected = obj.value;
    },
    async markSelectedItemAsPaid() {
      const idsOfSelectedJobs = this.items
        .filter((i) => i.isSelected && !i.isPaid)
        .map((i) => i.id);
      const response = await UserService.markReservationsPaid(
        this.userDetails.id,
        idsOfSelectedJobs
      );
      this.$toast.success(response.message);
      this.fetchDetails();
    },
    resetFilter() {
      this.filters = {};
      this.treeFilter = {};
      this.search = "";
      this.setQueryParams(true);
    },
    onClear() {
      this.search = "";
      this.setQueryParams();
    },
    setQueryParams(empty = false) {
      let query = {
        filters: JSON.stringify(this.filters),
      };

      if (empty) query = {};

      this.fetchDetails();

      this.$router
        .replace({
          query,
        })
        .catch((e) => {});
    },
  },
};
</script>
<style scoped>
.body {
  background-color: #f6f6f6;
  border-radius: 15px;
}
::v-deep .data-table {
  background-color: #f6f6f6;
  border-radius: 15px;
}
::v-deep thead {
  background-color: white;
}
</style>
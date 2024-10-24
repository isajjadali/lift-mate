<template>
  <v-container class="pa-6 sidebar">
    <h3>
      {{ title }}
    </h3>
    <shared-custom-btn
      v-if="
        createAction?.name &&
          (createAction?.preCondition ? createAction.preCondition({}, user) : true)
      "
      id="add-btn-generic-modal"
      class="mt-5"
      :color="createAction.color"
      block
      @click="onAdd()"
    >
      {{ titleCase(createAction.title || createAction.name) || "+Add" }}
    </shared-custom-btn>
    <div
      align="center"
      class="mt-5"
    >
      <shared-custom-btn
        v-if="isFilterBtnVisible"
        id="add-btn-generic-modal"
        @click="resetFilter"
      >
        Clear Filter
      </shared-custom-btn>
    </div>
    <div class="mt-8">
      <shared-custom-field
        id="sidebar-search-field"
        v-model="search"
        color="primary"
        placeholder="Search"
        prepend-inner-icon="mdi-magnify"
        clearable
        @keyup="onChange()"
        @click:clear="onClear()"
      />
    </div>
    <div v-if="autoCompleteFilters.length">
      <shared-custom-autocomplete
        v-for="(acFilter, index) in autoCompleteFilters"
        v-if="acFilter?.preCondition ? acFilter.preCondition(user) : true"
        :id="acFilter.label"
        :key="index"
        :ref="`filter-${index}`"
        v-model="acFilter.event"
        :items="acFilter.values"
        item-title="label"
        item-value="value"
        :label="acFilter.label"
        :placeholder="acFilter.placeholder"
        clearable
        chips
        small-chips
        :multiple="!acFilter.singular"
        closable-chips
        hide-selected
        color="primary"
        @update:modelValue="(selected) => onTreeNodeSelection(selected, acFilter.key)"
      />
    </div>
    <create-update-modal
      v-if="isCreateModalOpen"
      :open="isCreateModalOpen"
      :fields-config="fieldsConfig"
      :is-editable="true"
      :loading="isLoading"
      :title="singularTitle"
      :query-params="queryParams"
      :error="error"
      @update:modelValue="(v) => isCreateModalOpen = v"
      @close="(isCreateModalOpen = false), (error = null)"
      @onSubmit="onSubmit"
    />
  </v-container>
</template>

<script>
import CrudMixin from '@/mixins/CrudMixin';
import ReservationMixin from '@/mixins/ReservationMixin';

export default {
    name: 'SideBar',
    mixins: [CrudMixin, ReservationMixin],
    props: {
        title: {
            type: String,
            required: true,
        },
        statusKey: {
            type: String,
            default: '',
        },
        headers: {
            type: Array,
            default: () => [],
        },
        filters: {
            type: Function,
            default: () => [],
        },
        createAction: {
            type: Object,
            default: () => {},
        },
        url: {
            type: String,
            required: true,
        },
        isAvailableStatus: {
            type: Boolean,
            default: false,
        },
        getDynamicPath: {
            type: Function,
            default: null,
        },
        queryParams: {
            type: Object,
            default: () => {},
        },
        callbacks: {
            type: Object,
            default: () => {},
        },
        user: {
            type: Object,
            default: () => {},
        },
    },
    data: () => ({
        isCreateModalOpen: false,
        search: '',
        service: {},
        selectedFilters: {},
        event: null,
        availableStatus: [],
        dates: ['', ''],
        isLoading: false,
        error: null,
    }),
    computed: {
        autoCompleteFilters() {
            const filters = this.filters(this.availableStatus);
            return filters || [];
        },
        updatedFilters() {
            return {
                ...this.selectedFilters,
                search: this.search,
                toDate: this.dates[0],
                fromDate: this.dates[1],
            };
        },
        isFilterBtnVisible() {
            return Object.values(this.updatedFilters).some(
                (updatedfilter) => updatedfilter
            );
        },
    },
    watch: {
        url(newValue, oldValue) {
            if (oldValue !== newValue) {
                this.createServiceInstance(newValue);
                this.resetFilter();
                if (this.statusKey) this.getStatus();
            }
        },
    },
    created() {
        this.createServiceInstance(this.url);
        this.getStatus();
        this.setFiltersFromQuery();
    },
    methods: {
        setFiltersFromQuery() {
            let filters = this.$route?.query?.filters;
            if (filters) {
                filters = JSON.parse(filters);
                this.search = filters.search;
                Object.entries(filters).forEach((filter) => {
                    this.autoCompleteFilters.forEach((innerFilter) => {
                        const filterValue = (filter[1] || '').split(',');
                        if (innerFilter.key === filter[0]) {
                            if (filter[0] === 'isActive') {
                                innerFilter.event = [];
                                filterValue.forEach((val) => {
                                    if (val === 'true') {
                                        innerFilter.event.push(true);
                                    } else if (val === 'false') {
                                        innerFilter.event.push(false);
                                    }
                                });
                                return;
                            }
                            innerFilter.event = filterValue;
                        }
                    });
                });
                this.selectedFilters = filters;
                this.$emit('onFilter', this.updatedFilters);
            }
        },
        async getStatus() {
            const statuses = this.getStatuses();
            this.availableStatus = statuses.filter(
                (status) => status.type.toLowerCase() === this.statusKey
            );
            this.availableStatus.forEach(
                (status) => (status.name = this.titleCase(status.name))
            );
        },
        getStatuses() {
            const value = this.$localStorage.getItem('statuses');
            if (!value) return [];
            return JSON.parse(value);
        },
        setRange(e) {
            this.dates = e.range;
            this.updateFilters();
        },
        async onSubmit(payload) {
            try {
                this.isLoading = true;
                const data = this.getAcuratePayload(payload);
                await this.service.create(data, this.queryParams);
                this.callbacks?.create && this.callbacks?.create(this.$store);
                this.$toast.success(
                    `${this.messageKey} has been created successfully!`
                );
                this.isCreateModalOpen = false;
                this.$emit('setReloadTableListFlag', true);
                this.error = null;
            } catch (e) {
                this.error = e;
            } finally {
                this.isLoading = false;
            }
        },
        onAdd() {
            if (this.createAction.redirectTo) {
                return this.$router.push(this.createAction.redirectTo());
            }
            this.isCreateModalOpen = true;
        },
        onChange() {
            this.updateFilters();
        },
        onClear() {
            this.search = '';
            this.updateFilters();
        },
        onTreeNodeSelection(selectedValues, backendKey) {
            if (backendKey === 'isActive') {
                if (!selectedValues.length || selectedValues.length === 2) {
                    selectedValues = [];
                }
            }

            if (!Array.isArray(selectedValues)) {
                selectedValues = [selectedValues];
            }

            this.selectedFilters = {
                ...this.selectedFilters,
                [backendKey]: selectedValues.join(','),
            };
            this.updateFilters();
        },
        updateFilters() {
            this.setQueryParams();
            this.$emit('onFilter', this.updatedFilters);
        },
        resetFilter() {
            this.selectedFilters = {};
            this.autoCompleteFilters.forEach((i) => (i.event = null));
            (this.search = ''), (this.dates = []);
            this.updateFilters();
            this.setQueryParams(true);
        },
        setQueryParams(empty = false) {
            let query = {
                filters: JSON.stringify(this.updatedFilters),
            };
            if (empty) query = {};

            this.$router
                .replace({
                    query,
                })
                .catch();
        },
    },
};
</script>
<style lang="scss">
.v-list {
  overflow-y: auto;
}

.v-select.v-input--dense .v-chip {
  margin: 6px 0px !important;
}
</style>

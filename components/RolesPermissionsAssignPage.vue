<template>
  <div>
    <v-card
      elevation="4"
      class="mb-4"
    >
      <v-card-title> {{ meta.title }} </v-card-title>
    </v-card>
    <shared-custom-data-table
      id="rolesTable"
      :headers="headers"
      :items="items"
      :loading="loadingItems"
      loading-text="Loading Data... Please wait!"
      class="elevation-1"
      :hide-default-footer="true"
      :items-per-page="-1"
      @action-performed="onClickActionBtn"
    >
      <template #top>
        <v-toolbar flat>
          <v-spacer />
          <shared-custom-btn
            id="addRole"
            v-model="isCreateModalOpen"
            color="primary"
            class="mb-2"
            @click="isCreateModalOpen = true"
          >
            +Add
          </shared-custom-btn>
        </v-toolbar>
      </template>
    </shared-custom-data-table>
    <create-update-modal
      :fields-config="fieldsConfig"
      :open="isCreateModalOpen"
      :title="meta.title"
      @close="isCreateModalOpen = false"
      @onSubmit="onSubmit"
    />
    <assign-deassigned-modal
      v-if="isEditPermissionModalOpen"
      :open="isEditPermissionModalOpen"
      :headers="asssignModalHeaders"
      :items="linkedItems"
      :title="meta.title"
      @update:modelValue="(v) => isEditPermissionModalOpen = v"
      @close="isEditPermissionModalOpen = false"
      @onCancel="isEditPermissionModalOpen = false"
      @onSubmit="assignOrUnassignRecord"
    />
  </div>
</template>

<script>
import CrudMixin from '@/mixins/CrudMixin';
import { NameHeader } from '@/enums/meta/default';

export default {
    name: 'RolesPermissionsAssignPage',
    mixins: [CrudMixin],
    data() {
        return {
            items: [],
            asssignModalHeaders: [NameHeader],
            linkedItems: [],
            isCreateModalOpen: false,
            isEditPermissionModalOpen: false,
            headers: [],
            selectedItem: {},
            loadingItems: false,
        };
    },
    props: {
        metaData: {
            type: Object,
            default: {}
        }
    },
    computed: {
        url() {
            return this.$route?.meta?.backendPath || this.$route?.path.slice(9);
        },
        meta() {
            // return this.$route.meta || {};
            return this.metaData;
        },
        actions() {
            const actions = (this.meta?.actions || []).filter(
                (action) =>
                    this.hasPermission(action.permission) && action.name !== 'CREATE'
            );
            return actions;
        },
    },
    watch: {
        url(newValue) {
            if (newValue) {
                this.onLoad();
            }
        },
    },

    created() {
        this.onLoad();
    },
    methods: {
        async fetch() {
            this.loadingItems = true;
            this.headers = this.meta.headers;
            const data = await this.$axios.get(this.meta.urls.fetch);
            this.items = data.dataItems;
            this.items.forEach((item) => {
                item.$$actions = this.actions.filter((action) => {
                    return action.preCondition
                        ? action.preCondition(item, this.$store.user)
                        : true;
                });
            });

            this.items = this.meta.joinRoles
                ? this.meta.joinRoles(this.items)
                : this.items;
            this.loadingItems = false;

            const linkedData = await this.$axios.get(this.meta.urls.fetchLinked);
            this.linkedItems = linkedData.dataItems;
            this.linkedItems.forEach((item) => {
                item.$$actions = item.actions
                    ? this.items.actions((action) => {
                        return action.preCondition
                            ? action.preCondition(item, this.$store.user)
                            : true;
                    })
                    : true;
            });
        },
        onLoad() {
            this.fetch();
        },
        async onSubmit(payload) {
            const data = this.getAcuratePayload(payload);
            const response = this.meta.createUserAssignRoles
                ? await this.$axios.post(this.meta.urls.createUserAndAssignRoles, data)
                : await this.$axios.post(this.meta.urls.createData, data);
            this.selectedItem = response.data;
            this.isCreateModalOpen = false;
            if (this.meta.createUserAssignRoles) {
                this.isEditPermissionModalOpen = true;
            } else {
                this.$toast.success(
                    `${this.messageKey} has been assigned successfully!`
                );
            }
            this.fetch();
        },
        async assignOrUnassignRecord(payload) {
            const url =
        typeof this.meta.urls.editData === 'function'
            ? this.meta.urls.editData(this.selectedItem.id)
            : this.meta.urls.assignData;
            await this.$axios.post(url, payload);
            this.$toast.success(`${this.messageKey} has been assigned successfully!`);
            this.fetch();
        },
        async onClickActionBtn({ item = {}, action = '' } = {}) {
            this.selectedItem = item;
            this.linkedItems = this.meta.onOpeningAssignModal(
                this.selectedItem,
                this.linkedItems
            );
            this.isEditPermissionModalOpen = true;
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

<template>
  <div>
    <shared-custom-data-table
      id="2"
      ref="dataTable"
      height="calc(100vh - 210px)"
      :headers="headers"
      fixed-header
      :items="items"
      :loading="loadingItems"
      :no-data-text="`No ${singularTitle.toLowerCase()} found!`"
      loading-text="Loading Data... Please wait!"
      :server-items-length="totalItemCount"
      :page="page"
      :items-per-page="limit"
      :footer-props="{ 'items-per-page-options': rowLimit }"
      mobile-breakpoint="100"
      :show-select="showSelect"
      :title="title"
      :user="user"
      :actions="actions"
      :data-table-setting="true"
      @pagination="onPagination"
      @toggle-select-all="onToggleSelectAll"
      @item-selected="onItemSelection"
      @action-performed="onClickActionBtn"
      @on-toggle="onToggleActive"
      @on-upload-image="fetch"
    />
    <confirmation-modal
      :open="isConfirmationModalOpen"
      :disable-confirm-button="disableConfirmButton"
      :title="confirmationTitle"
      @update:modelValue="(v) => (isConfirmationModalOpen = v)"
      @cancel="
        (isConfirmationModalOpen = false),
          (shouldSendRatingLink = false),
          (wantToRefund = false)
      "
      @confirm="onConfirm()"
    >
      <v-checkbox
        v-if="selectedAction.name === ActionDefaults.complete.name"
        v-model="shouldSendRatingLink"
        label="Send rating link?"
        color="primary"
      />
      <v-checkbox
        v-if="selectedAction.name === ActionDefaults.cancelled.name"
        v-model="notifyEmail"
        label="Notify Email!"
        color="primary"
      />
      <v-row>
        <v-col cols="12">
          <v-checkbox
            v-if="
              selectedAction.name === ActionDefaults.cancelled.name &&
              selectedItem.brainTreeId
            "
            v-model="wantToRefund"
            label="Do you want to refund?"
            color="primary"
          />
        </v-col>
        <v-col cols="12" class="pt-0 pb-0">
          <shared-custom-field
            v-if="wantToRefund"
            id="shouldRefund"
            v-model="selectedItemCopy.amount"
            :rules="[(val) => amountRule(val)]"
            label="Amount"
            prefix="$"
            required
          />
        </v-col>
      </v-row>
    </confirmation-modal>
    <create-update-modal
      :open="isUpdateModalOpen"
      :fields-config="fieldsConfig"
      :data="selectedItem"
      :loading="isRecordUpdating"
      :title="singularTitle"
      @update:modelValue="(v) => (isUpdateModalOpen = v)"
      @close="isUpdateModalOpen = false"
      @onSubmit="onUpdate"
    />
    <assign-driver
      :open="isAssignModelOpen"
      :reservation="reservationWithDetail"
      @update:modelValue="(v) => (isAssignModelOpen = v)"
      @close="isAssignModelOpen = false"
      @onAssign="fetch"
    />
    <addons-modal
      :reservation-number="(selectedItem || {}).number"
      :open="isAddonModalOpen"
      @update:modelValue="(v) => (isAddonModalOpen = v)"
      @close="isAddonModalOpen = false"
      @onSubmit="onAddingAddon"
    />
  </div>
</template>

<script>
import ConfirmationModal from "@/shared/modals/ConfirmationModal.vue";
import CrudMixin from "@/mixins/CrudMixin";
import CommonMixin from "@/mixins/CommonMixin";
import ReservationMixin from "@/mixins/ReservationMixin";
import ReservationService from "@/services/reservation";
import { RESERVATION_STATUSES, ActionDefaults } from "@/enums";
import pluralize from "pluralize";

export default {
  components: {
    ConfirmationModal,
  },
  mixins: [CrudMixin, ReservationMixin, CommonMixin],
  props: {
    title: {
      type: String,
      default: "Record",
    },
    url: {
      type: String,
      required: true,
    },
    actions: {
      type: Array,
      default: () => [],
    },
    headers: {
      type: Array,
      required: true,
    },
    shouldReloadList: {
      type: Boolean,
      default: false,
    },
    showSelect: {
      type: Boolean,
      default: false,
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
    isUpdateModalOpen: false,
    isRecordUpdating: false,
    isAddonModalOpen: false,
    dialog: false,
    isConfirmationModalOpen: false,
    selectedItem: null,
    selectedItemCopy: null,
    items: [],
    totalItemCount: 0,
    limit: 50,
    offset: 0,
    confirmationTitle: "",
    rowLimit: [25, 50, 100, -1],
    page: 1,
    disableConfirmButton: false,
    loadingItems: false,
    shouldSendRatingLink: false,
    notifyEmail: false,
    wantToRefund: false,
    selectedAction: {},
    actionIcons: {
      EDIT: "mdi-pencil",
      VIEW: "mdi-information",
      DELETE: "mdi-delete",
      DUPLICATE: "mdi-content-duplicate",
    },
    contorllers: [],
    isAssignModelOpen: false,
    reservationWithDetail: {},
    ActionDefaults,
  }),
  computed: {
    urlWithQueryParams() {
      return `${this.url}::||::${JSON.stringify(this.queryParams)}`;
    },
  },
  watch: {
    shouldReloadList(newValue) {
      if (newValue) {
        this.onLoad();
      }
    },
    urlWithQueryParams(newValue, oldValue) {
      const [newUrl, newQueryParams] = newValue.split("::||::");
      const [oldUrl, oldQueryParams] = oldValue.split("::||::");

      if (oldUrl !== newUrl || oldQueryParams !== newQueryParams) {
        this.contorllers.forEach((controller) => controller.abort());
        this.onLoad();
      }
    },
  },
  created() {
    this.onLoad();
  },
  methods: {
    onClickActionBtn({ item = {}, action = "" } = {}) {
      this.selectedAction = action;
      this.selectedItem = item;

      this.selectedItemCopy = { ...this.selectedItem };
      if (action.redirectTo) {
        return this.$router.push(action.redirectTo(item));
      }

      switch (action.name) {
        case ActionDefaults.edit.name:
          this.isUpdateModalOpen = true;
          break;
        case ActionDefaults.assignDriver.name:
          this.getRervationWithDetail();
          this.isAssignModelOpen = true;
          break;
        case ActionDefaults.addAddons.name:
          this.isAddonModalOpen = true;
          break;
      }

      let itemName = "";
      switch (this.url) {
        case "/reservations":
          itemName = item.number;
          break;
        case "/discount-codes":
          itemName = item.code;
          break;
        case "/users":
          itemName = item.fullName;
          break;
        default:
          itemName = item.name;
          break;
      }

      if (action.isConfirmationRequired) {
        this.confirmationTitle = `Do you really want to ${(
          action.title || ""
        ).toLowerCase()} this ${pluralize.singular(
          this.title.toLowerCase()
        )}(<strong>${itemName}</strong>)?`;
        this.isConfirmationModalOpen = true;
      }
    },
    async fetch() {
      const controller = new AbortController();
      const signal = controller.signal;
      this.contorllers.push(controller);

      this.loadingItems = true;
      const response = await this.service.get(
        "",
        {
          limit: this.limit,
          offset: this.offset,
          ...this.queryParams,
        },
        signal
      );
      this.loadingItems = false;
      this.items = response.dataItems;
      this.items.forEach((item) => {
        item.$$actions = this.actions.filter((action) => {
          return action.preCondition
            ? action.preCondition(item, this.user)
            : true;
        });
      });
      this.totalItemCount = response.count;
      this.$emit("setReloadTableListFlag", false);
    },
    async delete() {
      await this.service.delete(this.selectedItem.id, {
        ids: this.items.filter((i) => i.isSelected).map((i) => i.id),
      });
      this.fetch(this.url);
      this.$toast.success(`${this.messageKey} has been deleted successfully!`);
    },
    onToggleSelectAll(obj) {
      obj.items.forEach((item) => (item.isSelected = obj.value));
    },
    onItemSelection(obj) {
      obj.item.isSelected = obj.value;
    },
    async onConfirm() {
      this.isConfirmationModalOpen = false;

      switch (this.selectedAction.name) {
        case ActionDefaults.delete.name:
          return this.onDelete();
        case ActionDefaults.complete.name:
          await ReservationService.changeStatus(
            this.selectedItem.id,
            RESERVATION_STATUSES.completed,
            { shouldSendRatingLink: this.shouldSendRatingLink }
          );
          this.shouldSendRatingLink = false;
          this.fetch(this.url);
          return;
        case ActionDefaults.cancelled.name:
          if (this.wantToRefund) {
            const responce = await this.paymentRefundService(
              this.selectedItem.id
            );
            if (responce.message === "success") {
              try {
                await ReservationService.changeStatus(
                  this.selectedItem.id,
                  RESERVATION_STATUSES.cancelled,
                  { notifyEmail: this.notifyEmail }
                );
                this.notifyEmail = false;
                this.$toast.success(
                  `${this.selectedItem.number} payment has been refunded successfully!`
                );
              } catch (err) {
                this.$toast.error(err);
              }
            }
          } else {
            await ReservationService.changeStatus(
              this.selectedItem.id,
              RESERVATION_STATUSES.cancelled,
              { notifyEmail: this.notifyEmail }
            );
            this.$toast.success(
              `${this.selectedItem.number} has been cancelled successfully!`
            );
          }
          this.fetch(this.url);
          return;
      }
    },
    async onDelete() {
      await this.delete({ url: this.url, id: this.selectedItem.id });
      this.fetch(this.url);
      this.callbacks?.delete && this.callbacks?.delete(this.$store);
    },
    async onUpdate(payload) {
      this.isRecordUpdating = true;
      const data = this.getAcuratePayload(payload);
      const res = await this.service.update(payload.id, data);

      this.$toast.success(`${this.messageKey} has been updated successfully!`);
      this.isRecordUpdating = false;
      this.isUpdateModalOpen = false;
      this.fetch(this.url);
      this.callbacks?.update && this.callbacks?.update(this.$store);
    },
    async onToggleActive(isActive, item) {
      this.selectedItem = item;
      const data = this.getAcuratePayload({ ...item, isActive });
      await this.service.update(data.id, data);
      this.callbacks?.update && this.callbacks?.update(this.$store);
      this.fetch(this.url);
      this.$toast.success(
        `${this.messageKey} ${
          isActive ? "activated" : "de-activated"
        } successfully!`
      );
    },
    onLoad() {
      this.limit = 50;
      this.offset = 0;
      this.page = 1;
      this.items = [];
      this.createServiceInstance();
      this.fetch(this.url);
    },
    onPagination(pagination) {
      if (
        this.limit !== pagination.itemsPerPage ||
        this.offset !== pagination.pageStart
      ) {
        this.offset = pagination.pageStart;
        this.limit = pagination.itemsPerPage;
        this.page = pagination.page;
        this.fetch();
      }
    },
    amountRule(val) {
      if (val <= this.selectedItem.amount && val > 0) {
        this.disableConfirmButton = false;
        return true;
      }
      this.disableConfirmButton = true;
      return `Amount should be in between 1 and ${this.selectedItem.amount} !`;
    },
    async paymentRefundService() {
      try {
        const responce = await ReservationService.refundPayment(
          this.selectedItem.id,
          { amount: this.selectedItem.amount }
        );
        return responce;
      } catch (err) {
        this.$toast.error(err);
      }
    },
    async getRervationWithDetail() {
      const response = await ReservationService.get(this.selectedItem.id);
      this.reservationWithDetail = response.data;
    },
    async onAddingAddon(payload) {
      this.isAddonModalOpen = false;
      await ReservationService.addAddon(this.selectedItem.id, {
        percentage: +payload.percentage,
        amount: +payload.amount,
        comments: payload.comments,
        name: payload.name,
        reservationDetailId: this.reservationDetailId,
      });
      this.$toast.success(
        `Addon Added Successfully at ${this.selectedItem.number}!`
      );
      this.fetch();
    },
  },
};
</script>
<style lang="scss">
.data-table__is-active {
  .is-active {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.action-class {
  // min-width: 255px;
}

.truncate {
  width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

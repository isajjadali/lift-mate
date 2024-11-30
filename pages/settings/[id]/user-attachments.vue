<template>
  <div>
    <v-card elevation="0" class="mb-4 body pa-5" title="User Attachments">
      <confirmation-modal
        :open="isConfirmationModalOpen"
        :title="confirmationTitle"
        @update:modelValue="(v) => (isConfirmationModalOpen = v)"
        @cancel="isConfirmationModalOpen = false"
        @confirm="onDelete"
      />
      <v-form ref="userAttachments" v-model="valid">
        <v-row class="mt-3 px-5">
          <v-col :sm="6" cols="12" class="py-0">
            <shared-custom-select
              id="dropdown"
              v-model="payload.documentType"
              label="Document Type"
              :items="attrs"
              placeholder="Select Document's Category"
              :required="true"
            />
          </v-col>
          <v-col :sm="6" cols="12" class="py-0">
            <shared-custom-date-picker
              id="dateandTime"
              v-model="payload.expDate"
              label="Expiry Date"
              placeholder="Select Expiry Date"
              color="primary"
              :required="true"
              clearable
              :allowed-dates="
                $store.user.isAdmin ? () => true : pickUpAllowedDates
              "
            />
          </v-col>
          <v-col cols="12" :sm="6" class="py-0">
            <shared-custom-upload-field
              id="fileInput"
              v-model="fileEvent"
              label="Select File"
              :required="true"
              @update:modelValue="(e) => (file = e)"
            />
          </v-col>
          <v-col :sm="12" class="mt-2">
            <shared-custom-btn
              id="custom-auth-modal-btn"
              class="float-right"
              color="primary"
              :loading="loading"
              @click="proceed()"
            >
              Upload
            </shared-custom-btn>
          </v-col>
        </v-row>
        <v-row class="mt-1">
          <v-col cols="6" />
          <v-col cols="12" :sm="6">
            <shared-custom-field
              id="custom-search-field"
              v-model="search"
              class="my-2"
              prepend-inner-icon="mdi-magnify"
              placeholder="Search..."
              hide-details
            />
          </v-col>
        </v-row>
      </v-form>
      <v-row>
        <shared-custom-data-table
          id="3"
          class="w-100 data-table"
          mobile-breakpoint="100"
          :headers="headers"
          :items="items"
          :loading="loadingItems"
          :search="search"
          :actions="actions"
          @action-performed="onClickActionBtn"
        />
      </v-row>
    </v-card>
  </div>
</template>
<script>
import UserService from "@/services/user";
import ReservationMixin from "@/mixins/ReservationMixin";
import ConfirmationModal from "@/shared/modals/ConfirmationModal.vue";
import {
  ActionDefaults,
  DateHeader,
  Header,
  ActionHeader,
} from "@/enums/meta/default";
import { PERMISSIONS } from "@/enums";

export default {
  name: "UserAttachments",
  components: {
    ConfirmationModal,
  },
  mixins: [ReservationMixin],
  props: {
    btnLabel: {
      type: String,
      default: "Update",
    },
  },
  data() {
    return {
      PERMISSIONS,
      valid: false,
      userId: "",
      UserService: {},
      attrs: ["Passport", "Liecence", "CNIC", "Picture"],
      search: "",
      file: null,
      actions: [
        { ...ActionDefaults.viewImage, title: "View" },
        { ...ActionDefaults.delete },
      ],
      fileEvent: null,
      showAttachment: false,
      loading: false,
      selectedItem: {},
      loadingItems: false,
      confirmationTitle: "",
      payload: {
        expDate: null,
        documentType: null,
      },
      headers: [
        {
          ...Header,
          title: "Type",
          valueFrom: "type",
        },
        {
          ...DateHeader,
          title: "Expires On",
          valueFrom: "expiresOn",
          isDateOnly: true,
        },
        {
          ...ActionHeader,
          showUploadField: false,
        },
      ],
      items: [],
      isConfirmationModalOpen: false,
    };
  },
  computed: {
    isFormValid() {
      return this.valid && this.file;
    },
  },
  created() {
    this.userId = this.$route?.params?.id;
    this.fetchDetails();
    this.showAttachment = false;
  },
  methods: {
    async onSubmit() {
      const formData = new FormData();
      formData.append("image", this.file, this.file.name);
      this.loading = true;

      await UserService.addAttachment(this.userId, formData, this.payload);

      this.loading = false;
      this.file = null;
      this.fileEvent = null;
      this.reset();
      this.fetchDetails();
    },
    async fetchDetails() {
      this.loadingItems = true;

      const response = await UserService.listAttachments(this.userId, {});
      this.items = response.dataItems;

      this.items.forEach((item) => {
        item.$$actions = this.actions.filter((action) => {
          return action.preCondition
            ? action.preCondition(item, this.$store.user)
            : true;
        });
      });

      this.loadingItems = false;
    },
    async onDelete() {
      await this.$axios.delete(
        `/users/user-attachments/${this.selectedItem.id}/${this.selectedItem.Key}`
      );
      this.isConfirmationModalOpen = false;
      this.fetchDetails();
    },
    async onConfirm(item) {
      this.isConfirmationModalOpen = true;
      this.selectedItem = item;
    },
    reset() {
      this.$refs.userAttachments.reset();
    },
    validate() {
      return this.$refs.userAttachments.validate();
    },
    proceed() {
      if (this.validate() && this.file) {
        return this.onSubmit();
      }
    },
    onClickActionBtn({ item = {}, action = "" } = {}) {
      this.selectedItem = item;

      if (action.isConfirmationRequired) {
        this.confirmationTitle = `Do you really want to ${action.title.toLowerCase()} this user attachment(${
          item.type
        })?`;
      }

      switch (action.name) {
        case ActionDefaults.delete.name:
          this.onConfirm(item);
          break;
      }
    },
  },
};
</script>
<style scoped lang="scss">
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
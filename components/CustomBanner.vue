<template>
  <div>
    <v-card
      style="background-color: #f6f6f6"
      class="d-flex align-center rounded-lg pa-2"
      elevation="0"
    >
      <v-row class="pa-1 pb-0">
        <v-col cols="7" class="pa-2 d-flex align-center pb-1">
          <div class="text-body-2 mx-5 text-justify">
            <p>{{ description }}</p>
          </div>
        </v-col>
        <v-col cols="5" class="pb-1">
          <v-img :src="imgUrl" max-width="180"></v-img>
        </v-col>
        <v-col class="d-flex justify-center pa-0 pb-3">
          <v-btn
            color="primary"
            rounded="lg"
            @click="onAdd"
            width="90"
            elevation="0"
          >
            Add
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <create-update-modal
      v-if="isCreateModalOpen"
      :open="isCreateModalOpen"
      :fields-config="fieldsConfig"
      :is-editable="true"
      :loading="isLoading"
      :query-params="queryParams"
      :error="error"
      @update:modelValue="(v) => (isCreateModalOpen = v)"
      @close="(isCreateModalOpen = false), (error = null)"
      @onSubmit="onSubmit"
    />
  </div>
</template>

<script>
import CustomBtn from "./shared/CustomBtn.vue";
import CrudMixin from "@/mixins/CrudMixin";
export default {
  name: "CustomBanner",
  components: { CustomBtn },
  mixins: [CrudMixin],
  props: {
    url: {
      type: String,
      required: true,
    },
    createAction: {
      type: Object,
      default: () => {},
    },
    statusKey: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    imgUrl: {
      type: String,
      default: "",
    },
    headers: {
      type: Array,
      default: () => [],
    },
    callbacks: {
      type: Object,
      default: () => {},
    },
    queryParams: {
      type: Object,
      default: () => {},
    },
    showButton: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    isCreateModalOpen: false,
    service: {},
    isLoading: false,
    error: null,
  }),
  computed: {
    fieldsConfig() {
      const field = this.headers
        .filter((header) => header.fieldConfig)
        .map((header) => header.fieldConfig);
      return field;
    },
  },
  watch: {
    url(newValue, oldValue) {
      if (oldValue !== newValue) {
        this.createServiceInstance(newValue);
        if (this.statusKey) this.getStatus();
      }
    },
  },
  created() {
    this.createServiceInstance(this.url);
    this.getStatus();
  },
  methods: {
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
      const value = this.$localStorage.getItem("statuses");
      if (!value) return [];
      return JSON.parse(value);
    },
    onAdd() {
      this.isCreateModalOpen = true;
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
        this.$emit("setReloadTableListFlag", true);
        this.error = null;
      } catch (e) {
        this.error = e;
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
</style>

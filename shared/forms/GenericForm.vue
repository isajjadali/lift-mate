<template>
  <v-form ref="genericForm" v-model="valid">
    <v-row class="mt-1">
      <v-col
        v-for="(field, index) in fieldsConfig"
        :key="index"
        :cols="field.cols || 6"
        class="py-0"
        :sm="field.sm"
        :xs="field.xs"
        :md="field.md"
        :lg="field.lg"
      >
        <shared-google-place-dropdown
          v-if="field.type === 'googlePlaceDropDown'"
          v-bind="{ ...field }"
          v-model="payload[field.vModel]"
        />
        <shared-custom-date-picker
          v-else-if="field.type === 'datePicker'"
          v-bind="{ ...field }"
          v-model="payload[field.vModel]"
          :allowed-dates="(val) => onAllowedDates(val, field)"
          color="primary"
        />
        <shared-custom-date-time-picker
          v-else-if="field.type === 'dateTimePicker'"
          v-bind="{ ...field }"
          v-model="payload[field.vModel]"
          color="primary"
        />
        <shared-custom-select
          v-else-if="field.type === 'select'"
          v-bind="{ ...field }"
          v-model="payload[field.vModel]"
          color="primary"
        />
        <!-- <shared-custom-ck-editor
          v-else-if="field.type === 'ck-editor'"
          v-bind="{ ...field }"
          v-model="payload[field.vModel]"
          color="primary"
        /> -->
        <shared-custom-date-range-picker
          v-else-if="field.type === 'dateRangePicker'"
          :persist-data="false"
          label="Filter Date"
          persist-data-key="activities"
          @update="setRange"
        />
        <shared-custom-field
          v-else
          v-model="payload[field.vModel]"
          color="primary"
          v-bind="{ ...field }"
        />
      </v-col>
    </v-row>
    <v-row v-if="(btns.show || []).length">
      <v-col>
        <shared-custom-btn
          v-if="cancelBtn.shouldDisplay"
          id="generic-form-cancel-btn"
          class="mr-2"
          :disabled="loading"
          @click="onCancel"
        >
          {{ cancelBtn.label }}
        </shared-custom-btn>
        <shared-custom-btn
          id="generic-form-submit-btn"
          class="float-right"
          color="primary"
          :loading="loading"
          @click="onSubmit"
        >
          {{ submitBtn.label }}
        </shared-custom-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <div v-if="ifNoChangeDetected" class="text-error">
        <strong>No changes are detected to update!</strong>
      </div>
    </v-row>
  </v-form>
</template>
<script>
import _ from "lodash";
import { mask } from "vue-the-mask";

export default {
  name: "GenericForm",
  directives: {
    mask,
  },
  props: {
    fieldsConfig: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Object,
      default: () => {},
    },
    btnLabels: {
      type: Object,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    btns: {
      type: Object,
      default: () => {
        return {
          show: ["all"],
          cancelLabel: "Cancel",
          submitLabel: "Submit",
        };
      },
    },
  },
  data() {
    return {
      valid: false,
      payload: {},
      previousPayload: {},
      ifNoChangeDetected: false,
    };
  },
  computed: {
    disableSubmitBtn() {
      return !this.valid || !this.isFormDirty;
    },
    isFormDirty() {
      return this.fieldsConfig
        .filter((fc) => fc.vModel)
        .map((fc) => fc.vModel)
        .some((key) => this.payload[key] != this.previousPayload[key]);
    },
    cancelBtn() {
      const btn = {};
      if (["all", "cancel"].find((btn) => this.btns?.show?.includes(btn))) {
        btn.label = this.btns.cancelLabel || "Cancel";
        btn.shouldDisplay = true;
      }
      return btn;
    },
    submitBtn() {
      const btn = {};
      if (["all", "submit"].find((btn) => this.btns?.show?.includes(btn))) {
        btn.label = this.btns.submitLabel || "Submit";
        btn.shouldDisplay = true;
      }
      return btn;
    },
  },
  watch: {
    data(newValue) {
      if (newValue) {
        this.createPayload();
      }
    },
    payload: {
      handler(val) {
        this.fieldsConfig.forEach((field) => {
          if (field.optionalIf) {
            field.required = !val[field.optionalIf];
          }
        });
        this.$emit("onChange", {
          payload: val,
          isDirty: this.isFormDirty,
          isValid: this.valid,
          isDisabled: this.disableSubmitBtn,
        });
      },
      deep: true,
    },
  },
  created() {
    this.createPayload();
  },
  methods: {
    onAllowedDates(val, field) {
      if (!field["allowed-dates"]) return val;

      return field["allowed-dates"](val, field, this.payload);
    },
    createPayload() {
      this.payload = _.cloneDeep(this.data || {});
      this.previousPayload = _.cloneDeep(this.data || {});
    },
    validate() {
      return this.$refs.genericForm.validate();
    },
    onSubmit() {
      if (this.validate()) {
        if (this.isFormDirty) {
          this.$emit("onSubmit", this.payload);
        }
        this.ifNoChangeDetected = !this.isFormDirty;
      }
    },
    onCancel() {
      this.$emit("onCancel");
      this.ifNoChangeDetected = false;
    },
    setRange(e) {
      this.$emit("update", e);
    },
  },
};
</script>

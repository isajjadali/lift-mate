<template>
  <v-row>
    <v-col>
      <v-card class="body pa-5" elevation="0">
        <v-card-title>Profile Info</v-card-title>
        <v-card-text>
          <generic-form
            :fields-config="
              user.isDriver
                ? fieldsConfig
                : fieldsConfig.filter((header) => !header.isDriverSpecific)
            "
            :data="user"
            :btns="{ show: ['submit'], submitLabel: 'Update' }"
            @onSubmit="updateProfile"
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import Service from "@/services/index";
import GenericForm from "@/shared/forms/GenericForm.vue";
import { MDI_ICONS } from "@/enums";
import { PERMISSIONS } from "@/enums";
import CommonMixin from "@/mixins/CommonMixin";
export default {
  name: "ProfileInfo",
  components: {
    GenericForm,
  },
  mixins: [CommonMixin],
  props: {},
  data: () => {
    return {
      user: {},
      userService: {},
      service: {},
      userId: "",
      tab: null,
      error: "",
      show: false,
      MDI_ICONS,
      selectedItem: {},
      PERMISSIONS,
    };
  },
  computed: {
    currentUser() {
      return this.$store.user;
    },

    fieldsConfig() {
      return [
        {
          id: "firstName",
          vModel: "firstName",
          name: "firstName",
          label: "First Name",
          placeholder: "First Name",
          sm: 6,
          cols: 12,
          md: 6,
          required: true,
          "prepend-inner-icon": MDI_ICONS.username,
        },
        {
          id: "lastName",
          vModel: "lastName",
          name: "lastName",
          label: "Last Name",
          placeholder: "Last Name",
          sm: 6,
          cols: 12,
          md: 6,
          "prepend-inner-icon": MDI_ICONS.username,
        },
        {
          id: "email",
          vModel: "email",
          name: "email",
          label: "Email",
          type: "email",
          disabled: !this.currentUser?.isAdmin,
          placeholder: "Email",
          sm: 6,
          cols: 12,
          md: 6,
          required: true,
        },
        {
          id: "dob",
          vModel: "dob",
          name: "dob",
          label: "Date of Birth",
          type: "datePicker",
          placeholder: "Date of Birth",
          sm: 6,
          cols: 12,
          md: 6,
        },
        {
          id: "phoneNumber",
          vModel: "phoneNumber",
          name: "phoneNumber",
          label: "Phone Number",
          type: "phoneNumber",
          placeholder: "Phone Number",
          required: true,
          sm: 6,
          cols: 12,
          md: 6,
        },
        {
          id: "phoneType",
          type: "select",
          label: "Phone No Type",
          placeholder: "Select Type",
          vModel: "phoneType",
          required: true,
          items: [
            { label: "@txt.att.net", value: "@txt.att.net" },
            { label: "@tmomail.net", value: "@tmomail.net" },
            { label: "@vtext.com", value: "@vtext.com" },
            { label: "@smtext.com", value: "@smtext.com" },
          ],
          "item-title": "label",
          "item-value": "value",
          sm: 6,
          cols: 12,
        },

        {
          id: "socialSecurityNumber",
          vModel: "socialSecurityNumber",
          name: "socialSecurityNumber",
          isDriverSpecific: true,
          label: "Social Security Number",
          placeholder: "Social Security Number",
          sm: 6,
          cols: 12,
          md: 6,
          "prepend-inner-icon": MDI_ICONS.socialSecurityNumber,
        },
        {
          id: "address",
          type: "googlePlaceDropDown",
          label: "Address",
          placeholder: "Type to select address",
          vModel: "address",
          cols: 12,
          "prepend-inner-icon": MDI_ICONS.address,
        },
      ];
    },
  },
  async created() {
    this.userId = this.$route?.params?.id;
    this.createServiceInstance();
    await this.fetch();
  },
  methods: {
    createServiceInstance() {
      this.service = new Service("/users");
    },
    async fetch() {
      try {
        const response = await this.service.get(this.userId);
        this.user = response.data;
      } catch (e) {
        this.error = e;
      }
    },
    async updateProfile(payload) {
      await this.service.update(this.userId, payload);
      this.fetch();
      this.$store.fetchDrivers();
      this.$toast.success(
        `${this.user.fullName} has been updated successfully!`
      );
    },
  },
};
</script>
<style>
.body {
  background-color: #f6f6f6;
  border-radius: 15px;
}
</style>
<template>
  <v-dialog
    v-model="toggleDriver"
    max-width="900"
    persistent
  >
    <v-card class="assign-driver-modal">
      <v-toolbar
        color="primary"
        dark
      >
        <v-toolbar-title class="text-center">
          Assign Drivers
        </v-toolbar-title>
        <template v-slot:append>
          <v-btn icon @click="$emit('close')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-toolbar>
      <v-container class="pa-7">
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <strong>Reservation No:</strong>
            <span class="text-primary ml-2">{{ reservation.number }} </span>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            v-for="(reservationDetail, index) in reservation.ReservationDetails"
            :key="index"
            cols="12"
          >
            <v-row align="center">
              <v-col
                cols="6"
                sm="4"
                class="pb-0 d-flex align-center justify-center"
              >
                <span>{{ reservationDetail.car.name.toUpperCase() }}</span>
              </v-col>
              <v-col
                cols="6"
                sm="2"
                class="pb-0 d-flex align-center justify-center"
              >
                <span><shared-amount-value :amount="reservationDetail.price" /></span>
              </v-col>
              <v-col
                v-if="$store.user.isAdmin"
                cols="12"
                sm="4"
                class="pb-0 d-flex align-center justify-center"
              >
                <shared-custom-autocomplete
                  id="Driver"
                  v-model="reservationDetail.user"
                  :items="drivers"
                  item-title="fullName"
                  placeholder="Select Driver"
                  return-object
                  hide-details
                  class="w-100"
                  @update:modelValue="reservationDetail.changed = true"
                />
              </v-col>
            </v-row>
            <hr
              v-if="
                $vuetify.display.xs &&
                  reservation.ReservationDetails[index + 1]
              "
              class="mt-10"
            >
          </v-col>
        </v-row>
        <v-row class="mt-6">
          <v-col cols="12" class="pb-1">
            <shared-custom-btn
              id="generic-form-submit-btn-btn"
              class="float-right mt-3"
              color="primary"
              @click="onConfirm()"
            >
              Submit
            </shared-custom-btn>
            <v-checkbox
              v-model="shouldSendEmail"
              color="primary"
              label="Notify Email"
              class="float-right mt-1 mr-3"
              hide-details
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script>
import ReservationService from '@/services/reservation';

export default {
    name: 'AssignDriver',
    props: {
        open: {
            type: Boolean,
            default: false,
        },
        reservation: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            loadingItems: false,
            isModalOpen: false,
            isAssignModelOpen: false,
            isConfirmationModalOpen: false,
            reservationDetailId: null,
            reservationDetailAddonId: null,
            shouldSendEmail: false,
            drivers_list: [],
        };
    },
    computed: {
        url() {
            return this.$route.meta.url;
        },
        drivers() {
            return this.drivers_list ?? [];
        },
        toggleDriver: {
          get() { return this.open },
          set(value) { this.$emit('change', value) },
        },
    // isAnyDriverChanged() {
    //     return (
    //         this.user.isAdmin &&
    // this.reservation?.ReservationDetails?.some(
    //     (reservationDetail) =>
    //         reservationDetail.user &&
    //     reservationDetail.changed &&
    //     reservationDetail.alreadyAssigned
    // )
    //     );
    // },
    },
    watch: {
    // reservation() {
    //     this.reservation?.ReservationDetails?.forEach((rd) => {
    //         if (rd.driverId) {
    //             rd.alreadyAssigned = true;
    //         }
    //     });
    // },
        open(newValue) {
            if (newValue) {
                this.shouldSendEmail = false;
                const value = this.$localStorage.getItem('drivers');
                if (!value) return [];
                this.drivers_list = JSON.parse(value);
            }
        },
    },
    methods: {
        openAddonModal(id) {
            this.reservationDetailId = id;
            this.isModalOpen = true;
        },
        async onConfirm() {
            const reservationDetails = this.reservation.ReservationDetails.filter(
                (obj) => obj.user
            );
            await ReservationService.assignDriver(
                this.reservation.id,
                reservationDetails,
                this.shouldSendEmail
            );
            this.$emit('close');
            this.$emit('onAssign');
            this.$toast.success('Drivers assigned Successfully!');
        },
    },
};
</script>
<style lang="scss">
.assign-driver-modal {
  .v-text-field__details {
    display: none !important;
  }

  .v-messages {
    display: none !important;
  }
}
</style>

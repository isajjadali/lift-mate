<template>
  <v-container class="reservation-details">
    <custom-loader-reservation-detail-page-loader v-if="isLoading" />
    <v-row v-if="reservation.id && !isLoading">
      <v-col sm="8">
        <v-card elevation="4">
          <v-card-title>
            <v-row>
              <v-col
                v-if="!$vuetify.display.smAndDown"
                cols="12"
                md="6"
              >
                Reservation No:
                <span class="text-primary ml-2"
                  >{{ reservation.number }}
                </span>
              </v-col>
              <v-col
                v-if="$vuetify.display.smAndDown"
                cols="12"
                md="6"
              >
                Reservation No:
                <span class="text-primary ml-2"
                  >{{ reservation.number }}
                </span>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <shared-custom-key-value-pair
              :config="detailConfig"
              class="details"
            />
          </v-card-text>
        </v-card>
        <v-card
          class="mt-5"
          elevation="4"
        >
          <v-card-title>Details</v-card-title>
          <v-tabs v-model="tab">
            <v-tab> Ordered Cars </v-tab>
            <v-tab v-if="!$store.user?.isDriver"> Addons </v-tab>
          </v-tabs>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item>
              <shared-custom-data-table
                id="assigned_driver"
                class="w-100"
                mobile-breakpoint="100"
                :headers="carHeaders"
                :items="reservation.ReservationDetails"
              >
                <template #item.assignedDriver="{ item }">
                  {{ (item.user || {}).fullName || 'Not Assigned' }}
                </template>
              </shared-custom-data-table>
            </v-tabs-window-item>
            <v-tabs-window-item>
              <shared-custom-data-table
                id="addons"
                class="w-100"
                mobile-breakpoint="100"
                :headers="addonHeaders"
                :items="reservation.ReservationAddons"
              />
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card>
      </v-col>
      <v-col sm="4">
        <car-calculation
          :miles="`${miles}`"
          :cars="cars"
          :status="reservation.status"
          :extra-stops="extraStops"
          :surges="surges"
          :extra-miles-amount="extraMilesAmount"
          :payload="setPayload"
          :is-create-page="false"
          :reservation-addons="reservation.ReservationAddons"
        />
      </v-col>
    </v-row>
    <assign-driver
      :open="isAssignModelOpen"
      :reservation="reservation"
      @close="isAssignModelOpen = false"
      @onAssign="fetch"
    />
    <addons-modal
      v-if="hasPermission(PERMISSIONS.reservationsAddAddon)"
      :open="isAddonModalOpen"
      :reservationNumber="reservation.number"
      :isReservationUpdating="isReservationUpdating"
      @toggle="(v) => (isAddonModalOpen = v)"
      @onSubmit="onSubmit"
    />
    <v-speed-dial
      v-model="fab"
      transition="slide-y-reverse-transition"
      location="bottom center"
      right
      class="speed-dial"
    >
      <template #activator="{ props }">
        <v-btn
          v-model="fab"
          color="primary"
          dark
          icon
          size="large"
          v-bind="props"
          class="float-right speed-dial"
        >
          <v-icon v-if="fab"> mdi-close </v-icon>
          <v-icon v-else> mdi-dots-vertical </v-icon>
        </v-btn>
      </template>
      <template
        v-for="(btn, index) in buttons"
        :key="index"
      >
        <div class="speed-dial-btns">
          <span class="btn-label">{{ btn.title }}</span>
          <v-btn
            icon
            dark
            small
            :color="btn.color"
            @click="btn.action"
          >
            <v-icon>{{ btn.icon }}</v-icon>
          </v-btn>
        </div>
      </template>
    </v-speed-dial>
  </v-container>
</template>

<script>
  import ReservationService from '@/services/reservation';
  import { RESERVATION_STATUSES } from '@/enums';
  import ReservationMixin from '@/mixins/ReservationMixin';
  import {
    Header,
    AmountHeader,
    PercentageHeader,
    PERMISSIONS,
  } from '@/enums';

  export default {
    name: 'ReservationDetailsPage',
    mixins: [ReservationMixin],
    props: {
      reservationDetailId: {
        type: String,
        default: () => null,
      },
    },
    data() {
      return {
        PERMISSIONS,
        fab: false,
        tab: null,
        isAddonModalOpen: false,
        isReservationUpdating: false,
        miles: null,
        gratuity: null,
        meetAndGreet: null,
        extraMilesAmount: null,
        cars: [],
        reservation: {},
        calculations: {},
        selectedDriver: '',
        drivers: [],
        extraStops: [],
        customGratuity: 0,
        discounts: [],
        surges: [],
        isBagsChecked: false,
        isAssignModelOpen: false,
        reservationDetailAddonId: null,
        isLoading: false,
        carHeaders: [
          {
            ...Header,
            title: 'Name',
            valueFrom: 'car.name',
          },
          {
            ...Header,
            title: 'Assigned Driver',
            valueFrom: 'user.fullName',
          },
        ],
        addonHeaders: [
          {
            ...Header,
            title: 'Name',
            valueFrom: 'name',
          },
          {
            ...Header,
            title: 'Comments',
            valueFrom: 'comments',
          },
          AmountHeader,
          PercentageHeader,
        ],
      };
    },
    computed: {
      reservationId() {
        return this.$route.params.id;
      },
      buttons() {
        return [
          {
            color: 'primary',
            title: 'Edit',
            icon: 'mdi-pencil',
            action: () =>
              this.$router.push(
                `/reservation/update/${this.reservation.id}`
              ),
            permission: PERMISSIONS.reservationsEdit,
          },
          {
            color: 'primary',
            title: 'Add Addons',
            icon: 'mdi-alarm-plus',
            action: () => (this.isAddonModalOpen = true),
            permission: PERMISSIONS.reservationsAddAddon,
          },
          {
            color: 'primary',
            title: 'Assign Driver',
            icon: 'mdi-hand-pointing-right',
            action: () => (this.isAssignModelOpen = true),
            permission: PERMISSIONS.reservationsAssign,
          },
        ].filter((item) =>
          this.isActionButtonVisible(item.permission)
        );
      },
      showActionButtons() {
        return ![
          RESERVATION_STATUSES.draft,
          RESERVATION_STATUSES.cancelled,
          RESERVATION_STATUSES.completed,
        ].includes(this.reservation.status);
      },
      setPayload() {
        return {
          gratuity: this.gratuity,
          customGratuity: this.customGratuity,
          discounts: this.discounts,
          meetAndGreet: this.meetAndGreet,
          isBagsChecked: this.isBagsChecked,
        };
      },
      detailConfig() {
        const config = [
          {
            title: 'Affiliate Name',
            value: this.reservation?.affiliateName,
          },
          {
            title: 'Name',
            value:
              this.reservation?.name ||
              this.reservation?.user?.fullName,
          },
          {
            title: 'Phone#',
            value:
              this.reservation?.phoneNumber ||
              this.reservation?.user?.phoneNumber,
          },

          {
            title: 'International Phone#',
            value: this.reservation?.internationalPhoneNumber,
          },
          {
            title: 'Email',
            value:
              this.reservation.email || this.reservation?.user?.email,
          },
          {
            title: 'Pick up Location',
            value: this.reservation.pickUpLocation,
          },
          {
            title: 'Drop Off Location',
            value: this.reservation.dropOffLocation,
          },
          {
            title: 'Pick up Date and Time',
            value: this.formatDate(this.reservation.pickUpDateTime),
          },
          {
            title: 'Number of Passengers',
            value: this.reservation.noOfPassenger,
          },
          {
            title: 'Flight#',
            value: this.reservation.flightNumber,
          },
          {
            title: 'Comments',
            value: this.reservation.comments,
          },
        ];

        if (this.reservation.parentOf) {
          config.push({
            title: 'Return Trip',
            value: `A${this.reservation.parentOf}`,
            redirectTo: {
              path: `/reservation/details/${this.reservation.parentOf}`,
              newTab: false,
            },
          });
        }
        if (this.reservation.childOf) {
          config.push({
            title: 'Return Trip Off',
            value: `A${this.reservation.childOf}`,
            redirectTo: {
              path: `/reservation/details/${this.reservation.childOf}`,
              newTab: false,
            },
          });
        }

        if (this.extraStops.length) {
          config.push({
            title: 'Extra Stops',
            value: this.formattedExtraStops(this.extraStops),
          });
        }
        return config;
      },
    },
    watch: {
      $route(to, from) {
        if (to.path !== from.path) {
          this.onLoad();
        }
      },
    },
    async created() {
      this.onLoad();
    },
    destroyed() {
      ['calculations', 'surges'].forEach((i) =>
        this.$localStorage.removeItem(i)
      );
    },
    methods: {
      async onLoad() {
        await this.fetch();
        this.updateStatus();
      },
      async onSubmit(payload) {
        this.isReservationUpdating = true;
        await ReservationService.addAddon(this.reservation.id, {
          percentage: +payload.percentage,
          amount: +payload.amount,
          comments: payload.comments,
          name: payload.name,
          reservationDetailId: this.reservationDetailId,
        });
        this.$toast.success('Addon Added Successfully!');
        this.isReservationUpdating = false;
        this.isAddonModalOpen = false;
        this.fetch();
      },
      updateStatus() {
        if (
          this.hasPermission(PERMISSIONS.reservationsChangeStatus) &&
          this.reservation.status === RESERVATION_STATUSES.created
        ) {
          ReservationService.changeStatus(
            this.reservation.id,
            RESERVATION_STATUSES.viewed
          );
        }
      },
      async deleteAddon() {
        this.isConfirmationModalOpen = false;
        await ReservationService.deleteAddon(
          this.reservationDetailAddonId
        );
        this.fetch();
        this.$toast.success('Addon Delete Successfully!');
      },
      async fetch() {
        try {
          this.isLoading = true;
          const response = await ReservationService.get(
            this.$route.params.id
          );
          if (!response) throw 'Not Found!!';
          this.isLoading = false;
          this.reservation = response.data;
        } catch (error) {}
        if (this.$store.user?.isDriver) {
          this.reservation.ReservationDetails =
            this.reservation?.ReservationDetails.filter(
              (rd) => rd.user.id === this.$store.user.id
            );
        }

        this.miles = this.reservation.miles;
        this.gratuity = this.reservation?.gratuity;
        this.customGratuity = this.reservation?.customGratuity;
        this.discounts = this.reservation.ReservationDiscountCodes;
        this.surges = this.reservation.ReservationSurges;
        this.extraStops = this.reservation.ReservationExtraStops;
        (this.isBagsChecked = this.reservation?.isBagsChecked),
          (this.meetAndGreet = this.reservation?.isMeetAndGreet
            ? this.reservation?.meetAndGreet
            : null),
          (this.extraMilesAmount = this.reservation.extraMilesAmount),
          (this.cars = this.getExpectedCars(
            this.reservation?.ReservationDetails
          ));
      },
      getExpectedCars(cars = []) {
        const requiredCars = [];
        cars.forEach((car) => {
          const existingCar = requiredCars.find(
            (c) => c.name === car.name
          );
          if (existingCar) {
            existingCar.requiredCars += 1;
          } else {
            requiredCars.push({ ...car, requiredCars: 1 });
          }
        });
        return requiredCars;
      },
      isActionButtonVisible(permission) {
        return (
          this.showActionButtons && this.hasPermission(permission)
        );
      },
    },
  };
</script>
<style lang="scss">
  .reservation-details {
    .v-expansion-panel-header__icon {
      .v-icon {
        position: absolute;
        top: 16px;
        right: 12px;
      }
    }

    .v-text-field__details {
      display: none;
    }

    .v-expansion-panel-header {
      .col {
        display: flex;
        align-items: center;
      }
    }

    .details {
      .key-value {
        font-size: 16px;
        padding: 10px 15px;
      }
    }

    .speed-dial {
      position: sticky;
      bottom: 30px;
      margin-right: -120px;

      @media (max-width: 1130px) {
        margin-right: 0;
      }
    }
  }
  .speed-dial-btns {
    position: relative;

    .btn-label {
      position: absolute;
      text-align: end;
      right: 60px;
      top: 13px;
      min-width: 150px;
      font-weight: bold;
      font-size: 1em;
    }
  }
</style>

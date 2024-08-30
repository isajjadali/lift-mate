<template>
  <v-card class="car-calculation">
    <v-container class="pa-5">
      <v-row>
        <v-col cols="12">
          <h3>
            Reservation Summary:
            <v-chip
              v-if="status"
              class="float-right"
              :class="$vuetify.display.mdAndDown ? 'mt-2' : ''"
              :color="getStatusColor(status)"
            >
              {{ titleCase(status) }}
            </v-chip>
          </h3>
        </v-col>
        <v-col
          v-if="cars.length > 1 || isRequiredCars"
          class="pt-0"
          cols="12"
        >
          <h4 class="text-info">
            Multiple Vehicles have been selected!
          </h4>
        </v-col>
        <v-col v-if="!cars.length">
          <h4>No car selected yet!</h4>
        </v-col>
        <v-col v-else>
          <v-row justify="center">
            <v-col
              cols="12"
              :class="{ 'pb-0': roundTrip }"
            >
              <strong>
                <span>
                  {{ roundTrip ? 'First Trip' : '' }} Miles:</span
                >
                <span class="text-error">
                  {{ parentMiles || miles }}
                </span>
              </strong>
            </v-col>
            <v-col
              v-if="roundTrip"
              cols="12"
              class="pt-0"
            >
              <strong>
                <span>
                  {{ roundTrip ? 'Round Trip' : '' }} Miles:</span
                >
                <span class="text-error">
                  {{ childMiles }}
                </span>
              </strong>
            </v-col>
            <v-col
              v-for="(car, index) in cars"
              :key="index"
              :md="cars.length > 1 ? 6 : 8"
            >
              <v-card
                v-if="car.requiredCars"
                elevation="5"
                :color="
                  !isDarkMode ? 'grey-lighten-3' : '#424242'
                "
              >
                <v-img
                  height="100"
                  contain
                  :src="car.imageUrl"
                  :lazy-src="car.compressedImageUrl"
                />
                <v-card-title>
                  {{ car.name }}
                </v-card-title>
                <v-divider class="mx-4" />
                <v-card-text>
                  <div>
                    <strong>Selected Cars:</strong>
                    {{ car.requiredCars }}
                  </div>
                  <div>
                    <strong
                      >Amount {{ roundTrip ? '(First Trip)' : '' }}:
                    </strong>
                    <shared-amount-value
                      :amount="
                        carTotalAmount(car, parentMiles || miles)
                      "
                    />
                  </div>
                  <div v-if="roundTrip">
                    <strong>Amount(Return Trip): </strong>
                    <shared-amount-value
                      :amount="carTotalAmount(car, childMiles)"
                    />
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>

        <v-col
          v-if="
            oneWayTripPayload.sumOfTotalCars &&
            (isCreatePage ? true : !$store.user.isDriver)
          "
          cols="12"
        >
          <v-card
            flat
            max-width="444"
          >
            <v-card-text>
              <v-row>
                <v-col
                  cols="8"
                  md="12"
                  sm="12"
                  class="pt-0 pr-0"
                  :class="isCreatePage ? 'pb-2' : 'pb-0'"
                >
                  <v-radio-group
                    v-if="isCreatePage"
                    v-model="isBagsChecked"
                    :error-messages="bagsCheckedErrorMessage"
                    :error="!!bagsCheckedErrorMessage"
                    inline
                    @update:modelValue="$emit('onBagsChecked', isBagsChecked)"
                  >
                    <template v-slot:label>
                      <div>
                        <strong
                          :class="
                            bagsCheckedErrorMessage
                              ? 'text-error'
                              : ''
                          "
                        >
                          Checking-in Bag(s) ?
                          <span class="text-red">*</span>
                        </strong>
                      </div>
                    </template>
                    <template
                      v-for="(possibility, index) in possibilities"
                      :key="index"
                    >
                      <v-radio
                        color="primary"
                        class="my-2"
                        :label="possibility.label"
                        :value="possibility.value"
                      />
                    </template>
                  </v-radio-group>
                  <span v-else>
                    <strong>Checking-in Bag(s) ? </strong>
                    <span v-if="isBagsChecked">
                      Yes
                      <v-icon color="primary"
                        >mdi-check-outline</v-icon
                      >
                    </span>
                    <span v-else>
                      No
                      <v-icon color="error">mdi-close-outline</v-icon>
                    </span>
                  </span>
                </v-col>
                <v-col cols="12">
                  <h2 class="text-black">Calculations</h2>
                </v-col>
                <v-col
                  v-if="
                    isCreatePage &&
                    currentStep < 4 &&
                    (checkingLocation !== 'toAirport'
                      ? true
                      : roundTrip
                      ? true
                      : false)
                  "
                  class="py-0"
                >
                  <v-checkbox
                    v-model="isMeetAndGreet"
                    :label="`Meet and Greet (${
                      meetAndGreet.amount
                        ? `$${meetAndGreet.amount}`
                        : `${meetAndGreet.percentage}%`
                    })`"
                    color="primary"
                    hide-details
                  />
                </v-col>
                <v-col
                  v-if="isCreatePage && currentStep < 4"
                  cols="12"
                  class="pb-0"
                >
                  <v-form ref="gratuityForm">
                    <shared-custom-select
                      id="gratuity-select"
                      v-model="gratuity"
                      class="gratuity-select"
                      :required="true"
                      :items="gratuityOptions"
                      label="Gratuity"
                      placeholder="Please select from the list"
                      aria-required="true"
                      @update:modelValue="
                        $emit('onGratuityChange', { gratuity })
                      "
                      @click="customGratuity = 0"
                    />
                    <shared-custom-field
                      v-if="gratuity === 'custom'"
                      id="custom-gratuity"
                      v-model="customGratuity"
                      class="custom-gratuity mt-2"
                      type="number"
                      label="Custom Gratuity"
                      prefix="$"
                      required
                      @keyup="
                        $emit('onCustomChange', {
                          gratuity,
                          customGratuity,
                        })
                      "
                    />
                  </v-form>
                </v-col>
                <v-col
                  v-if="isCreatePage && currentStep < 4"
                  cols="12"
                  class="pt-0"
                >
                  <shared-custom-field
                    id="test"
                    v-model="discountCode"
                    label="Discount Code"
                  />
                </v-col>
                <v-col
                  v-if="isCreatePage && currentStep < 4"
                  cols="12"
                  class="pt-0"
                >
                  <p
                    v-if="discountConfig.message"
                    class="d-inline"
                  >
                    <span :class="`text-${discountConfig.color}`">
                      {{ discountConfig.message }}
                    </span>
                  </p>
                  <shared-custom-btn
                    id="validate-btn"
                    color="primary"
                    class="float-right"
                    :disabled="!discountCode"
                    :loading="isDiscountCodeLoading"
                    @click="onDiscountCodeApplied"
                  >
                    Apply
                  </shared-custom-btn>
                  <shared-custom-btn
                    v-if="discounts.length"
                    id="clear-btn"
                    color="error"
                    class="float-right mr-1"
                    @click="clearDiscountCode"
                  >
                    clear
                  </shared-custom-btn>
                </v-col>
                <v-col
                  v-if="roundTrip"
                  cols="12"
                >
                  <h3>First Trip:</h3>
                </v-col>
                <v-col
                  cols="12"
                  class="py-1"
                >
                  <strong>Amount: </strong>
                  <shared-amount-value
                    :amount="oneWayTripPayload.sumOfTotalCars"
                  />
                </v-col>

                <v-col
                  v-if="discounts.length"
                  cols="12"
                  class="py-0"
                >
                  <div class="py-1">
                    <strong class="text-primary">
                      <span
                        >{{
                          `Discount${
                            oneWayTripPayload.discountedAmount === 0
                              ? `(${oneWayTripPayload.percentage}%)`
                              : ''
                          }: `
                        }}
                      </span>
                    </strong>
                    <span
                      v-if="oneWayTripPayload.discountedPercentage"
                    >
                      <shared-amount-value
                        :amount="
                          oneWayTripPayload.discountedPercentage
                        "
                      />
                    </span>
                    <span v-else>
                      <shared-amount-value
                        :amount="oneWayTripPayload.discountedAmount"
                      />
                    </span>
                  </div>
                  <div
                    v-if="oneWayTripPayload.discountedPrice"
                    class="py-1"
                  >
                    <strong> Discounted Amount: </strong>
                    <shared-amount-value
                      :amount="oneWayTripPayload.discountedPrice"
                    />
                  </div>
                </v-col>

                <surge-calculation
                  :surges="surges"
                  @surgesCalculation="onChangeSurge"
                />

                <v-col
                  v-if="totalExtraStopCharges"
                  cols="12"
                  class="py-1"
                >
                  <strong>Extra Stop Charges: </strong>
                  <shared-amount-value
                    :amount="totalExtraStopCharges"
                  />
                </v-col>

                <v-col
                  v-if="oneWayTripPayload.gratuity"
                  cols="12"
                  class="py-1"
                >
                  <strong>Gratuity: </strong>
                  <shared-amount-value
                    :amount="oneWayTripPayload.gratuity"
                  />
                </v-col>

                <v-col
                  v-if="
                    oneWayTripPayload.meetAndGreetAssigned &&
                    isMeetAndGreet
                  "
                  cols="12"
                  class="py-1"
                >
                  <strong> Meet And Greet Charges: </strong>
                  <shared-amount-value
                    :amount="oneWayTripPayload.meetAndGreetAmount"
                  />
                </v-col>
                <v-col
                  v-if="oneWayTripPayload.totalAddonAmount"
                  cols="12"
                  class="py-1"
                >
                  <shared-custom-span :help-text="addonHelpText">
                    <strong> Addons: </strong>
                    <shared-amount-value
                      :amount="oneWayTripPayload.totalAddonAmount"
                    />
                  </shared-custom-span>
                </v-col>
                <v-col
                  v-if="roundTrip"
                  cols="12"
                  class="py-1"
                >
                  <div>
                    <h3>
                      <span> Bill: </span>
                      <shared-amount-value
                        :amount="oneWayTripPayload.tripBill"
                      />
                    </h3>
                  </div>
                </v-col>

                <template v-if="roundTrip">
                  <v-divider class="mx-4 mt-3" />
                  <v-col cols="12">
                    <h3>Return Trip:</h3>
                  </v-col>

                  <v-col
                    cols="12"
                    class="py-1"
                  >
                    <strong>Amount: </strong>
                    <shared-amount-value
                      :amount="roundTripPayload.sumOfTotalCars"
                    />
                  </v-col>

                  <v-col
                    v-if="discounts.length"
                    cols="12"
                    class="py-0"
                  >
                    <div class="py-1">
                      <strong class="text-primary">
                        <span>
                          {{
                            `Discount${
                              roundTripPayload.discountedAmount === 0
                                ? `(${roundTripPayload.percentage}%)`
                                : ''
                            }: `
                          }}
                        </span>
                      </strong>
                      <span
                        v-if="roundTripPayload.discountedPercentage"
                      >
                        <shared-amount-value
                          :amount="
                            roundTripPayload.discountedPercentage
                          "
                        />
                      </span>
                      <span v-else>
                        <shared-amount-value
                          :amount="roundTripPayload.discountedAmount"
                        />
                      </span>
                    </div>
                    <div
                      v-if="roundTripPayload.discountedPrice"
                      class="py-1"
                    >
                      <strong> Discounted Amount: </strong>
                      <shared-amount-value
                        :amount="roundTripPayload.discountedPrice"
                      />
                    </div>
                  </v-col>

                  <surge-calculation
                    :surges="returnSurges"
                    @surgesCalculation="onChangeSurge"
                  />

                  <v-col
                    v-if="totalReturnExtraStopCharges"
                    cols="12"
                    class="py-1"
                  >
                    <strong>Extra Stop Charges: </strong>
                    <shared-amount-value
                      :amount="totalReturnExtraStopCharges"
                    />
                  </v-col>
                  <v-col
                    v-if="roundTripPayload.gratuity"
                    cols="12"
                    class="py-1"
                  >
                    <strong>Gratuity: </strong>
                    <shared-amount-value
                      :amount="roundTripPayload.gratuity"
                    />
                  </v-col>

                  <v-col
                    v-if="
                      roundTripPayload.meetAndGreetAssigned &&
                      isMeetAndGreet
                    "
                    cols="12"
                    class="py-1"
                  >
                    <strong> Meet And Greet Charges: </strong>
                    <shared-amount-value
                      :amount="roundTripPayload.meetAndGreetAmount"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    class="py-1"
                  >
                    <div>
                      <h3>
                        <span> Bill: </span>
                        <shared-amount-value
                          :amount="roundTripPayload.tripBill"
                        />
                      </h3>
                    </div>
                  </v-col>

                  <v-divider class="mx-4 my-3" />
                </template>

                <v-col
                  cols="12"
                  class="py-1"
                >
                  <div
                    @blur="
                      $emit('totalBill', {
                        totalBill: reservationsTotalBill.totalBill,
                      })
                    "
                  >
                    <h3>
                      <span class="text-error"> Total Bill: </span>
                      <shared-amount-value
                        :amount="reservationsTotalBill.totalBill"
                      />
                    </h3>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
  import ReservationMixin from '@/mixins/ReservationMixin';
  import ReservationService from '@/services/reservation';
  import { ReservationCalculation } from '~/utils';

  export default {
    mixins: [ReservationMixin],
    props: {
      miles: {
        type: String,
        default: '',
      },
      childMiles: {
        type: String,
        default: '',
      },
      parentMiles: {
        type: String,
        default: '',
      },
      status: {
        type: String,
        default: '',
      },
      isCreatePage: {
        type: Boolean,
        default: true,
      },
      checkingLocation: {
        type: String,
        default: '',
      },
      extraMilesAmount: {
        type: Number,
        default: null,
      },
      currentStep: {
        type: Number,
        default: 1,
      },
      payload: {
        type: Object,
        default: () => {},
      },
      surges: {
        type: Array,
        default: () => [],
      },
      cars: {
        type: Array,
        default: () => [],
      },
      returnSurges: {
        type: Array,
        default: () => [],
      },
      extraStops: {
        type: Array,
        default: () => [],
      },
      returnExtraStops: {
        type: Array,
        default: () => [],
      },
      roundTrip: {
        type: Boolean,
        default: false,
      },
      reservationAddons: {
        type: Array,
        default: () => [],
      },
      bagsCheckedErrorMessage: {
        type: String,
        default: '',
      },
    },
    data: () => ({
      discountCode: null,
      isBagsChecked: null,
      discountConfig: {},
      isMeetAndGreet: false,
      isDiscountCodeLoading: false,
      surgeAmount: 0,
      discountAppliedInPercentage: 0,
      surgePercentage: 0,
      discountedAmount: 0,
      discountedPercentage: 0,
      discountedPrice: 0,
      discounts: [],
      gratuity: null,
      customGratuity: null,
      gratuityOptions: [
        { title: "No thanks / i'll take care of Driver", value: 1 },
        { title: '15%', value: 15 },
        { title: '20%', value: 20 },
        { title: '25%', value: 25 },
        { title: '30%', value: 30 },
        { title: 'Custom', value: 'custom' },
      ],
      possibilities: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
    }),
    computed: {
      addonHelpText() {
        return `To see more details click on the Addons Tab in the Details section${
          this.$vuetify.display.xs ? ' above.' : ' on the left.'
        }`;
      },
      isRequiredCars() {
        return this.cars.some((car) => car.requiredCars > 1);
      },
      totalExtraStopCharges() {
        return (
          this.extraStops.length *
          (this.$store.configurations?.extraStopCharges?.amount || 0)
        );
      },
      totalReturnExtraStopCharges() {
        return (
          this.returnExtraStops.length *
          (this.$store.configurations?.extraStopCharges?.amount || 0)
        );
      },
      reservationsTotalBill() {
        const totalBill =
          this.oneWayTripPayload.tripBill +
          (this.roundTripPayload?.tripBill || 0);
        return {
          oneWayTotalBill: this.oneWayTripPayload.tripBill,
          roundTripTotalBill: this.roundTripPayload.tripBill,
          totalBill,
        };
      },
      meetAndGreet() {
        const { configurations } = this.$store;
        return this.isCreatePage
          ? configurations?.meetAndGreet || {}
          : this.payload.meetAndGreet;
      },
      addonsAmount() {
        let amount = 0;
        let percentage = 0;

        this.reservationAddons.forEach((addon) => {
          let addonAmount = +addon.amount;
          let addonPercentage = +addon.percentage;
          if (addonAmount) {
            amount += addonAmount;
          } else if (addonPercentage) {
            percentage += addonPercentage;
          }
        });
        percentage =
          +this.reservationsTotalBill.totalBill * (percentage / 100);

        amount = amount + percentage;
        return amount;
      },
      oneWayTripPayload() {
        const { oneWayPayload } = this.calculateReservationAmount();
        return oneWayPayload;
      },
      roundTripPayload() {
        const { roundTripPayload } =
          this.calculateReservationAmount();
        return roundTripPayload;
      },
    },
    watch: {
      url(newValue, oldValue) {
        if (oldValue !== newValue) {
          this.onLoad();
        }
      },
    },
    created() {
      if (this.isCreatePage) {
        this.setDataFromLocalStorage();
      } else {
        this.discounts = this.payload?.discounts || [];
      }
      this.gratuity = this.gratuity || +this.payload?.gratuity || null;
      this.customGratuity =
        this.customGratuity || this.payload?.customGratuity || null;
      this.isMeetAndGreet =
        this.isMeetAndGreet ||
        this.payload?.meetAndGreet?.amount ||
        this.payload?.meetAndGreet?.percentage
          ? true
          : false;
      this.isBagsChecked =
        this.isBagsChecked || this.payload?.isBagsChecked || 0;
    },
    methods: {
      clearDiscountCode() {
        this.discountCode = '';
        this.discounts = [];
        this.updatingValue();
        this.discountedPrice = 0;
        this.discountConfig = {};
      },
      onCalculationChange(totalBill) {
        const payload = JSON.parse(
          this.$localStorage.getItem('payload')
        );

        if ((payload || {}).step2) {
          payload.step2.customGratuity = this.customGratuity;
          payload.step2.discounts = this.discounts || [];
          payload.step2.isMeetAndGreet = this.isMeetAndGreet;
          payload.step2.selectedGratuity = this.gratuity;
          payload.step2.isBagsChecked = this.isBagsChecked;
          this.$localStorage.setItem(
            'payload',
            JSON.stringify(payload)
          );
        }

        this.$emit('onChange', {
          totalBill: totalBill,
        });
      },
      setDataFromLocalStorage() {
        const payload = JSON.parse(
          this.$localStorage.getItem('payload')
        );

        if ((payload || {}).step2) {
          this.discounts = payload.step2.discounts || [];
          this.gratuity = payload.step2.selectedGratuity || null;
          this.customGratuity = payload.step2.customGratuity || null;
          this.isMeetAndGreet = payload.step2.isMeetAndGreet;
          this.isBagsChecked = payload.step2.isBagsChecked;
          this.discountCode = ((this.discounts || [])[0] || {}).code;
          if (this.discountCode) {
            this.discountConfig = {
              message: 'Discount Applied!',
              color: 'primary',
            };
          }
        }
      },
      onChangeSurge(e) {
        this.surgeAmount = e.amount;
        this.surgePercentage = e.percentage;
      },
      async onDiscountCodeApplied() {
        this.discounts = [];
        try {
          this.isDiscountCodeLoading = true;
          const response =
            await ReservationService.verifyDiscountCode(
              this.discountCode
            );
          this.discounts[0] = response?.data;
          this.discounts = JSON.parse(JSON.stringify(this.discounts));
          this.discountConfig = {};
          this.discountConfig = {
            message: 'Discount Applied!',
            color: 'primary',
          };
          this.isActiveDiscountCode = true;
        } catch (e) {
          this.discountConfig = {
            message: 'Invalid Discount Code',
            color: 'error',
          };
        } finally {
          this.isDiscountCodeLoading = false;
        }
      },
      updatingValue() {
        this.discountedAmount = 0;
        this.discountedPercentage = 0;
      },
      calculateReservationAmount() {
          let roundTripPayload = {};
          if (this.roundTrip) {
              const CHECKING_LOCATIONS = {
                  toAirport: 'fromAirport',
                  fromAirport: 'toAirport',
              };
              roundTripPayload = ReservationCalculation({
                  cars: this.cars,
                  gratuity: this.gratuity,
                  customGratuity: this.customGratuity,
                  extraStopsAmount: this.$store.configurations?.extraStopCharges?.amount || 0,
                  extraMilesAmount: this.extraMilesAmount || 0,
                  isMeetAndGreet: this.isMeetAndGreet,
                  meetAndGreet: this.meetAndGreet,
                  discounts: this.discounts,
                  isRoundTrip: this.roundTrip,
                  isCreatePage: this.isCreatePage,
                  addons: this.reservationAddons,

                  checkingLocation: CHECKING_LOCATIONS[this.checkingLocation],
                  miles: this.childMiles,
                  surges: this.returnSurges,
                  eStops: this.returnExtraStops,
              });
          }
          const oneWayPayload = ReservationCalculation({
              cars: this.cars,
              gratuity: this.gratuity,
              customGratuity: this.customGratuity,
              extraStopsAmount: this.$store.configurations?.extraStopCharges?.amount || 0,
              extraMilesAmount: this.extraMilesAmount || 0,
              isMeetAndGreet: this.isMeetAndGreet,
              meetAndGreet: this.meetAndGreet,
              discounts: this.discounts,
              isRoundTrip: this.roundTrip,

              checkingLocation: this.checkingLocation,
              miles: this.parentMiles || this.miles,
              surges: this.surges,
              eStops: this.extraStops,
              isCreatePage: this.isCreatePage,
              addons: this.reservationAddons,
          });

          const totalBill =
      oneWayPayload.tripBill + (roundTripPayload.tripBill || 0);
          this.onCalculationChange(totalBill);
          return {
              oneWayPayload,
              roundTripPayload,
              totalBill,
          };
      },
      carTotalAmount(car, miles) {
          const calculations = {
              cars: [car],
              miles,
              extraMilesAmount: this.extraMilesAmount,
              roundTrip: this.roundTrip,
              isCreatePage: true,
              actualAmount: true,
          };

          const { tripBill } = ReservationCalculation(calculations);
          return tripBill;
      },
    },
  };
</script>
<style lang="scss">
  .car-calculation {
    .v-text-field__details {
      display: none !important;
    }

    .custom-gratuity {
      .v-text-field__details {
        display: block !important;
      }
    }

    .gratuity-select {
      .v-text-field__details {
        display: block !important;
      }
    }

    .break-word {
      word-break: break-word;
    }
  }
</style>

<template>
  <v-container
    float
  >
    <reservation-update-page-loader v-if="isLoading" />
    <v-row
      v-else
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
      >
        <v-card>
          <v-card-title><h3>Edit Reservation</h3></v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <generic-form
                    :fields-config="detailConfig"
                    :data="reservation"
                    :btns="{ show: [] }"
                    @onChange="getPayloadFromGenericForm"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <shared-custom-btn
                    id="onSubmit"
                    :disabled="disabled"
                    color="primary"
                    class="float-right mt-4"
                    @click="update()"
                  >
                    Submit
                  </shared-custom-btn>
                  <v-checkbox
                    v-if="$store.user.isAdmin"
                    v-model="checkbox"
                    label="Notify Email"
                    class="float-right mr-4 mt-5"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <alert-modal
      :open="showAlertModal"
      v-bind="{ ...alertModalProps }"
      @update:modelValue="(v) => showAlertModal = v"
      @onConfirm="onAlertModalConfirm"
      @close="showAlertModal = false"
    />
  </v-container>
</template>

<script>
import ReservationService from '@/services/reservation';
import GenericForm from '@/shared/forms/GenericForm.vue';
import ReservationMixin from '@/mixins/ReservationMixin';
import AlertModal from '@/shared/modals/AlertModal.vue';
import moment from 'moment';
import { RoutesConfig } from '@/enums';
import ReservationUpdatePageLoader from '@/components/CustomLoader/ReservationUpdatePageLoader.vue';


export default {
    name: 'ReservationUpdatePage',
    components: {
        GenericForm,
        AlertModal,
        ReservationUpdatePageLoader
    },
    mixins: [ReservationMixin],
    props: {
        reservationDetailId: {
            type: String,
            default: () => null,
        },
    },
    data: () => {
        return {
            reservation: {},
            payload: {},
            disabled: true,
            checkbox: false,
            isLoading: true,
            showAlertModal: false,
            alertModalProps: {},
            onAlertModalConfirm: () => {},
        };
    },
    computed: {
        reservationId() {
          return this.$route.params.id;
        },
        detailConfig() {
            return [
                {
                    id: 'name',
                    label: 'Name',
                    placeholder: 'Name',
                    vModel: 'name',
                    cols: 12,
                    sm: 12,
                    required: true,
                },
                {
                    id: 'phoneNumber',
                    label: 'Phone#',
                    placeholder: 'Enter Phone#',
                    type: 'phoneNumber',
                    vModel: 'phoneNumber',
                    cols: 12,
                    sm: 12,
                    optionalIf: 'internationalPhoneNumber',
                    requiredError: 'PhoneNumber or International PhoneNumber is required',
                },
                {
                    id: 'internationalPhoneNumber',
                    label: 'International Phone#',
                    placeholder: 'Enter International Phone#',
                    vModel: 'internationalPhoneNumber',
                    cols: 12,
                    sm: 12,
                    optionalIf: 'phoneNumber',
                    requiredError: 'International PhoneNumber or PhoneNumber is required',
                },
                {
                    id: 'email',
                    label: 'Email',
                    placeholder: 'Enter Email',
                    type: 'email',
                    vModel: 'email',
                    cols: 12,
                    sm: 12,
                    required: true,
                },
                {
                    id: 'dateTimePicker',
                    label: 'Pick up Date and Time',
                    placeholder: 'Enter Pick Up Date and Time',
                    type: 'dateTimePicker',
                    vModel: 'pickUpDateTime',
                    cols: 12,
                    sm: 12,
                    required: true,
                    'date-picker-props': {
                        'allowed-dates': this.$store.user.isAdmin
                            ? () => true
                            : this.pickUpAllowedDates,
                    },
                },
                {
                    id: 'flightNo',
                    label: 'Flight Info',
                    placeholder: 'Flight Info',
                    vModel: 'flightNumber',
                    cols: 12,
                    sm: 12,
                    required: false,
                },
                {
                    id: 'comments',
                    label: 'Comments',
                    type:'textarea',
                    placeholder: 'Comments',
                    vModel: 'comments',
                    cols: 12,
                    sm: 12,
                },
                {
                    id: 'pickUpLocation',
                    label: 'Pick up Location',
                    placeholder: 'Enter Pick Up Location',
                    disabled: true,
                    vModel: 'pickUpLocation',
                    cols: 12,
                    sm: 12,
                },
                {
                    id: 'dropUpLocation',
                    label: 'Drop Off Location',
                    placeholder: 'Enter Drop Off Location',
                    disabled: true,
                    vModel: 'dropOffLocation',
                    cols: 12,
                    sm: 12,
                },
                {
                    id: 'noOfPassenger',
                    label: 'Number of Passengers',
                    disabled: true,
                    vModel: 'noOfPassenger',
                    cols: 12,
                    sm: 12,
                },
            ];
        },
    },
    async created() {
        await this.fetch();
    },
    methods: {
        async fetch() {
            this.loadingItems = true;
            try {
                const response = await ReservationService.get(
                    this.reservationId
                );
                this.reservation = response.data;
                this.isLoading = false;
            } catch (err) {
                console.error(err);
                this.$toast.error(err);
                this.isLoading = false;
            }
        },
        getPayloadFromGenericForm(payload) {
            this.payload = payload.payload;
            this.disabled = payload.isDisabled;
        },
        async update() {
            this.payload.gratuity = +this.payload.gratuity;
            this.payload.miles = +this.payload.miles;
            try {
                const hoursDifference = this.getHoursDiffFromCurrentTime(
                    this.payload.pickUpDateTime
                );

                if (this.$store.user.isAdmin || hoursDifference > 6) {
                    await ReservationService.update(this.reservationId, {
                        ...this.payload,
                        shouldSendEmail: this.checkbox,
                    });

                    this.alertModalProps = {
                        type: 'success',
                        title: 'Reservation Updated Successfully!',
                        okBtnLabel: this.$store.user.id ? 'Check Details' : 'Go to Home',
                        hideCancelBtn: true,
                    };

                    if (!this.$store.user.isAdmin && hoursDifference <= 24) {
                        this.alertModalProps = {
                            ...this.alertModalProps,
                            type: 'warning',
                            message: `Your reservation date time is in under 24 Hours. kindly contact us on this number ${this.$store.configurations.home.contactNumber}`,
                        };
                    }

                    this.onAlertModalConfirm = this.redirectToReservations.bind(this);
                } else {
                    this.alertModalProps = {
                        type: 'error',
                        title: 'Reservation can\'t be updated!',
                        message: 'You cannot update a Reservation within 6 hours!',
                        hideCancelBtn: true,
                    };
                    this.onAlertModalConfirm = function () {
                        this.showAlertModal = false;
                        this.shouldClearDateTime = true;
                    }.bind(this);
                }
                this.showAlertModal = true;
            } catch (err) {
                console.error(err);
                this.$toast.error(err);
            }
        },
        redirectToReservations() {
            if (this.$store.user.id) {
                return this.$router.push(
                    `/reservation/details/${this.reservationId}`
                );
            }
            this.$router.push(RoutesConfig.default.path);
        },
    },
};
</script>

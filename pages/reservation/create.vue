<template>
  <v-container
    float
    class="create-reservatiion"
  >
    <v-overlay
      :absolute="false"
      :value="isCheckoutBraintree"
      :opacity="0.9"
    >
      <v-progress-circular
        :size="80"
        class="my-8"
        color="white"
        indeterminate
        :width="8"
      />
      <div class="text-white">Please Wait...</div>
    </v-overlay>
    <reservation-create-page-loader
      v-if="isLoading"
      :current-step="currentStep"
    />
    <v-row
      v-else
      justify="center"
    >
      <v-col
        cols="12"
        :sm="currentStep > 1 ? 8 : 10"
        :md="8"
      >
        <v-card rounded="lg">
          <v-container class="pa-5">
            <v-row>
              <v-col class="text-right">
                <shared-custom-btn
                  v-if="!isGettingAQuote && currentStep > 3"
                  id="save-as-draft"
                  color="primary"
                  :class="$vuetify.display.xs ? 'mb-2' : ''"
                  @click="onDraft"
                >
                  Save As Draft
                </shared-custom-btn>
                <shared-custom-btn
                  v-if="
                    hasPermission(
                      PERMISSIONS.reservationsCreateWithoutPayment
                    ) &&
                    payload.step3.selectedAffiliate?.id &&
                    currentStep >= 3
                  "
                  id="save-reservation-without-payment"
                  color="primary"
                  class="ml-2"
                  @click="create((status = 'unpaid'))"
                >
                  Create Without Payment
                </shared-custom-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="text-center">
                <h1 class="text-primary">
                  {{ reservationHeader }}
                </h1>
                <p>
                  This Information will let us know more about you.
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <client-only>
                  <v-stepper
                    v-model="currentStep"
                    rounded
                    :vertical="
                      $vuetify.display.smAndDown ? true : false
                    "
                  >
                    <v-stepper-header
                      v-if="!$vuetify.display.smAndDown"
                    >
                      <template
                        v-for="(step, index) in steps"
                        :key="`${index + 1}-step`"
                      >
                        <v-stepper-item
                          :complete="currentStep > index + 1"
                          :value="index + 1"
                          color="primary"
                        >
                          {{ step.title }}
                        </v-stepper-item>
                        <v-divider
                          v-if="index + 1 !== steps.length"
                          :key="index + 1"
                        />
                      </template>
                    </v-stepper-header>

                    <!-- <template
                        v-for="(step, index) in steps"
                        :key="`${index + 1}-step`"
                        v-else
                      >
                        <v-stepper-item
                          :complete="currentStep > index + 1"
                          :value="index + 1"
                        >
                          {{ step.title }}
                        </v-stepper-item>
                        <v-divider
                          v-if="index + 1 <= steps.length"
                          :key="index + 1"
                        />
                      </template> -->

                    <v-stepper-window>
                      <v-stepper-window-item
                        key="content-1"
                        :value="1"
                      >
                        <v-form
                          ref="step1"
                          v-model="payload.step1.valid"
                        >
                          <v-container
                            v-if="currentStep === 1"
                            :class="
                              $vuetify.display.xs
                                ? ''
                                : 'px-10 stepper-container'
                            "
                          >
                            <v-row>
                              <v-col
                                align="center"
                                sm="12"
                              >
                                <div
                                  class="mb-1"
                                  v-dompurify-html="
                                    (
                                      (configurations || {})
                                        .messages || {}
                                    ).reservationAlert
                                  "
                                />
                                <h3
                                  class="text-decoration-underline text-primary"
                                >
                                  Please Enter Pickup & Drop Off
                                  Information
                                </h3>
                              </v-col>
                            </v-row>
                            <p
                              v-if="!payload.step1.checkingLocation"
                              class="text-error text-center mt-2"
                            >
                              <strong
                                >Please select one of the
                                following</strong
                              >
                            </p>
                            <v-radio-group
                              v-model="payload.step1.checkingLocation"
                              column
                              @update:modelValue="onCheckingLocationChange"
                            >
                              <v-row
                                justify="center"
                                class="mb-2"
                              >
                                <v-col
                                  v-for="(
                                    location, index
                                  ) in locations"
                                  :key="index"
                                  cols="6"
                                  md="3"
                                >
                                  <v-radio
                                    color="primary"
                                    :label="location.label"
                                    :value="location.value"
                                  />
                                </v-col>
                              </v-row>
                            </v-radio-group>
                            <div
                              :class="
                                !payload.step1.checkingLocation
                                  ? 'postion-relative'
                                  : ''
                              "
                            >
                              <v-overlay
                                class="step1-overlay"
                                :absolute="true"
                                :model-value="
                                  !payload.step1.checkingLocation
                                "
                                persistent
                                :opacity="0.3"
                                contained
                              />
                              <v-row>
                                <v-col
                                  cols="12"
                                  sm="12"
                                  class="py-0"
                                  required
                                >
                                  <shared-custom-select
                                    v-if="
                                      ['fromAirport'].includes(
                                        payload.step1.checkingLocation
                                      )
                                    "
                                    id="pickup_location"
                                    v-model="
                                      payload.step1
                                        .airportLocationDetails
                                    "
                                    label="Airport Name"
                                    placeholder="Select Airport Name"
                                    :items="predefinedLocations"
                                    hint="Click for more options"
                                    persistent-hint
                                    item-title="title"
                                    required
                                    return-object
                                    prepend-inner-icon="mdi-map-marker"
                                    @update:modelValue="
                                      onLocationChange
                                    "
                                  />
                                  <shared-google-place-dropdown
                                    v-else
                                    id="google-search-pickup"
                                    v-model="
                                      payload.step1.pickUpLocation
                                    "
                                    label="Pickup Location"
                                    placeholder="Enter Pickup Location"
                                    no-data-text="Type to search location..."
                                    required
                                    prepend-inner-icon="mdi-map-marker"
                                  />
                                </v-col>
                                <v-col
                                  v-if="
                                    payload.step1.checkingLocation ===
                                      'fromAirport' &&
                                    payload.step1
                                      .airportLocationDetails &&
                                    payload.step1
                                      .airportLocationDetails.children
                                      .length
                                  "
                                  cols="12"
                                >
                                  <shared-custom-select
                                    id="pickup_location_child"
                                    v-model="
                                      payload.step1.pickUpLocation
                                    "
                                    label="Pickup Location at Airport"
                                    placeholder="Enter Pickup Location"
                                    :items="
                                      payload.step1
                                        .airportLocationDetails
                                        .children
                                    "
                                    :hint="airportLocationFieldHint"
                                    persistent-hint
                                    item-title="description"
                                    item-value="value"
                                    required
                                    prepend-inner-icon="mdi-map-marker"
                                  />
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="12"
                                >
                                  <extra-stops
                                    v-model="payload.step1.extraStops"
                                  />
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="12"
                                  class="py-0"
                                  required
                                >
                                  <shared-custom-select
                                    v-if="
                                      ['toAirport'].includes(
                                        payload.step1.checkingLocation
                                      )
                                    "
                                    id="dropoff_location"
                                    v-model="
                                      payload.step1
                                        .airportLocationDetails
                                    "
                                    label="Airport Name"
                                    placeholder="Select Airport Name"
                                    :items="predefinedLocations"
                                    hint="Click for more options"
                                    persistent-hint
                                    item-title="title"
                                    required
                                    return-object
                                    prepend-inner-icon="mdi-map-marker"
                                    @update:modelValue="
                                      onLocationChange
                                    "
                                  />
                                  <shared-google-place-dropdown
                                    v-else
                                    id="google-search-dropoff"
                                    v-model="
                                      payload.step1.dropOffLocation
                                    "
                                    label="Dropoff Location"
                                    placeholder="Enter Dropoff Location"
                                    no-data-text="Type to search location..."
                                    required
                                    prepend-inner-icon="mdi-map-marker"
                                  />
                                </v-col>
                                <v-col
                                  v-if="
                                    payload.step1.checkingLocation ===
                                      'toAirport' &&
                                    payload.step1
                                      .airportLocationDetails &&
                                    payload.step1
                                      .airportLocationDetails.children
                                      .length
                                  "
                                  cols="12"
                                >
                                  <shared-custom-select
                                    id="dropoff_location_child"
                                    v-model="
                                      payload.step1.dropOffLocation
                                    "
                                    label="Dropoff Location at Airport"
                                    placeholder="Enter DropOff Location"
                                    :items="
                                      payload.step1
                                        .airportLocationDetails
                                        .children
                                    "
                                    :hint="airportLocationFieldHint"
                                    persistent-hint
                                    item-title="description"
                                    item-value="value"
                                    required
                                    prepend-inner-icon="mdi-map-marker"
                                  />
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="12"
                                  class="pickup-date py-0"
                                >
                                  <shared-custom-date-time-picker
                                    id="pickup"
                                    v-model="
                                      payload.step1.pickDateTime
                                    "
                                    label="Pickup Date Time"
                                    placeholder="Enter Pickup Date Time"
                                    value="Enter Date & Time"
                                    :clear-date-time="
                                      shouldClearDateTime
                                    "
                                    required
                                    :date-picker-props="{
                                      'allowed-dates': $store.user
                                        .isAdmin
                                        ? () => true
                                        : pickUpAllowedDates,
                                    }"
                                    @updateClearDateTimeFlag="
                                      shouldClearDateTime = false
                                    "
                                    @update:modelValue="
                                      onPickUpDateTimeChange(),
                                        fetchSurgeDetails()
                                    "
                                  />
                                  <surge-warnings
                                    :surges="payload.step1.surges"
                                  />
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="12"
                                  class="py-0"
                                >
                                  <shared-custom-field
                                    id="noOfPassenger"
                                    v-model="
                                      payload.step1.noOfPassenger
                                    "
                                    type="number"
                                    label="Passenger Count"
                                    :value="
                                      payload.step1.noOfPassenger
                                    "
                                    required
                                    prepend-inner-icon="mdi-account-multiple"
                                  />
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="12"
                                  class="pt-0"
                                  :class="
                                    payload.step1.isRoundTrip
                                      ? 'mb-10'
                                      : ''
                                  "
                                >
                                  <v-checkbox
                                    v-model="
                                      payload.step1.isRoundTrip
                                    "
                                    label="Round Trip"
                                    color="primary"
                                    :disabled="disabledRountTrip"
                                    hide-details
                                  />
                                  <h5
                                    v-if="roundTripDiscountCode.id"
                                    class="pt-5"
                                  >
                                    <strong class="mb-1">
                                      Note:
                                    </strong>
                                    <span class="text-error">{{
                                      +roundTripDiscountCode.amount
                                        ? `$${roundTripDiscountCode.amount}`
                                        : `${roundTripDiscountCode.percentage}%`
                                    }}</span>
                                    Discount on round trip
                                    <span class="text-info">
                                      (Limited Time Offer)
                                    </span>
                                  </h5>
                                </v-col>
                              </v-row>
                            </div>
                            <v-row v-if="payload.step1.isRoundTrip">
                              <v-col
                                cols="12"
                                sm="12"
                                class="py-0"
                              >
                                <shared-custom-field
                                  v-if="
                                    [
                                      'fromAirport',
                                      'toAirport',
                                    ].includes(
                                      payload.step1.checkingLocation
                                    )
                                  "
                                  id="return-pickup-location"
                                  v-model="
                                    payload.step1.dropOffLocation
                                  "
                                  disabled
                                  :label="
                                    payload.step1.checkingLocation ===
                                    'fromAirport'
                                      ? 'Pickup Location'
                                      : 'Pickup Location at Airport'
                                  "
                                  required
                                  prepend-inner-icon="mdi-map-marker"
                                />
                                <shared-custom-field
                                  v-else
                                  id="return-pickup-location-point-to-point"
                                  v-model="
                                    payload.step1.dropOffLocation
                                  "
                                  disabled
                                  label="Pickup Location"
                                  required
                                  prepend-inner-icon="mdi-map-marker"
                                />
                              </v-col>
                              <v-col
                                cols="12"
                                sm="12"
                              >
                                <extra-stops
                                  v-model="
                                    payload.step1.returnExtraStops
                                  "
                                />
                              </v-col>
                              <v-col
                                cols="12"
                                sm="12"
                                class="pickup-date py-0"
                              >
                                <shared-custom-date-time-picker
                                  id="pickupdatetime"
                                  v-model="
                                    payload.step1.returnPickDateTime
                                  "
                                  label="Pickup Date Time"
                                  placeholder="Enter Pickup Date Time"
                                  value="Enter Date & Time"
                                  :clear-date-time="
                                    shouldClearReturnDateTime
                                  "
                                  required
                                  :date-picker-props="{
                                    'allowed-dates':
                                      returnTripPickUpAllowedDates,
                                  }"
                                  @updateClearDateTimeFlag="
                                    shouldClearReturnDateTime = false
                                  "
                                  @update:modelValue="fetchSurgeDetails(true)"
                                />
                                <surge-warnings
                                  :surges="payload.step1.returnSurges"
                                />
                              </v-col>
                              <v-col
                                cols="12"
                                sm="12"
                                class="py-0"
                              >
                                <shared-custom-field
                                  v-if="
                                    [
                                      'fromAirport',
                                      'toAirport',
                                    ].includes(
                                      payload.step1.checkingLocation
                                    )
                                  "
                                  id="return-dropoff-location"
                                  v-model="
                                    payload.step1.pickUpLocation
                                  "
                                  disabled
                                  :label="
                                    payload.step1.checkingLocation ===
                                    'fromAirport'
                                      ? 'Dropoff Location at Airport'
                                      : 'Dropoff Location'
                                  "
                                  required
                                  prepend-inner-icon="mdi-map-marker"
                                />
                                <shared-custom-field
                                  v-else
                                  id="return-dropoff-location-point-to-point"
                                  v-model="
                                    payload.step1.pickUpLocation
                                  "
                                  disabled
                                  label="Drop Off Location"
                                  required
                                  prepend-inner-icon="mdi-map-marker"
                                />
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-form>
                      </v-stepper-window-item>
                      <v-stepper-window-item
                        key="content-2"
                        :value="2"
                        :class="$vuetify.display.xs ? 'px-2' : ''"
                      >
                        <v-form
                          ref="step2"
                          v-model="payload.step2.valid"
                        >
                          <v-container
                            v-if="currentStep === 2"
                            class="stepper-container"
                            :class="$vuetify.display.xs ? 'px-0' : ''"
                          >
                            <v-row class="text-center">
                              <v-col
                                cols="12"
                                class="py-1"
                              >
                                <span>
                                  <strong
                                    >{{
                                      `Distance in miles${
                                        payload.step1.isRoundTrip
                                          ? '(First Trip)'
                                          : ''
                                      }: `
                                    }}
                                  </strong>
                                  <strong class="text-error">
                                    {{
                                      payload.step1.parentMiles ||
                                      payload.step1.miles
                                    }}</strong
                                  >
                                </span>
                              </v-col>
                              <v-col
                                v-if="payload.step1.isRoundTrip"
                                cols="12"
                                class="py-1"
                              >
                                <span>
                                  <strong
                                    >Distance in miles(Return Trip):
                                  </strong>
                                  <strong class="text-error">{{
                                    payload.step1.childMiles
                                  }}</strong>
                                </span>
                              </v-col>
                              <!-- <v-col
                                  v-if="isAnyCarSelected && !isCarSelectionValid"
                                  cols="12"
                                  class="text-error"
                                >
                                  <strong>Selected cars will not accommodate
                                    {{ payload.step1.noOfPassenger }}
                                    passengers. <br>Please select different or
                                    multiple cars.</strong>
                                </v-col> -->
                            </v-row>
                            <v-row justify="center">
                              <v-col
                                v-for="(item, index) in payload.step2
                                  .cars"
                                :key="index"
                                cols="12"
                                md="12"
                                class="py-0"
                              >
                                <v-card
                                  class="mx-auto my-2"
                                  elevation="5"
                                  :color="
                                    item.isSelected
                                      ? 'primary'
                                      : !isDarkMode
                                      ? 'grey-lighten-3'
                                      : ''
                                  "
                                >
                                  <!-- <v-checkbox
                                      v-model="item.isSelected"
                                      :color="item.isSelected ? 'white' : 'primary'"
                                      class="mt-1 mr-1 float-right"
                                      hide-details
                                    /> -->
                                  <v-card-title class="car-select">
                                    <shared-custom-btn
                                      id="select-deselect-btn"
                                      :color="
                                        item.isSelected
                                          ? !isDarkMode
                                            ? 'grey lighten-3'
                                            : ''
                                          : 'primary'
                                      "
                                      @click="otherCarSelection(item)"
                                    >
                                      {{
                                        item.isSelected
                                          ? 'Deselect'
                                          : 'Select'
                                      }}
                                    </shared-custom-btn>
                                  </v-card-title>

                                  <v-card-text class="pa-0">
                                    <v-container class="pt-5">
                                      <v-row
                                        align="center"
                                        class="mx-0 my-1"
                                      >
                                        <v-col
                                          cols="12"
                                          md="5"
                                        >
                                          <v-img
                                            height="150"
                                            contain
                                            :src="item.imageUrl"
                                            :lazy-src="
                                              item.compressedImageUrl
                                            "
                                          />
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          md="7"
                                        >
                                          <v-row>
                                            <v-col
                                              class="pt-0"
                                              cols="12"
                                              :class="
                                                item.isSelected
                                                  ? 'text-white'
                                                  : ''
                                              "
                                            >
                                              <h2>{{ item.name }}</h2>
                                            </v-col>
                                            <v-col
                                              class="text-subtitle-1 pt-0"
                                              :class="{
                                                'text-white':
                                                  item.isSelected,
                                                'py-0':
                                                  payload.step1
                                                    .isRoundTrip,
                                              }"
                                              cols="12"
                                            >
                                              <strong>
                                                {{
                                                  `Price${
                                                    payload.step1
                                                      .isRoundTrip
                                                      ? '(First Trip)'
                                                      : ''
                                                  }:`
                                                }}
                                                <shared-amount-value
                                                  :amount="
                                                    calculateCarRate(
                                                      item,
                                                      payload.step1
                                                        .parentMiles ||
                                                        payload.step1
                                                          .miles
                                                    )
                                                  "
                                                />
                                              </strong>
                                              <br />
                                            </v-col>
                                            <v-col
                                              v-if="
                                                payload.step1
                                                  .isRoundTrip
                                              "
                                              class="text-subtitle-1 pt-0"
                                              :class="
                                                item.isSelected
                                                  ? 'text-white'
                                                  : ''
                                              "
                                              cols="12"
                                            >
                                              <strong>
                                                Price(Return Trip):
                                                <shared-amount-value
                                                  :amount="
                                                    calculateCarRate(
                                                      item,
                                                      payload.step1
                                                        .childMiles
                                                    )
                                                  "
                                                />
                                              </strong>
                                              <br />
                                            </v-col>
                                            <v-col
                                              cols="12"
                                              class="py-0"
                                            >
                                              <v-icon
                                                class="mr-3"
                                                :color="
                                                  item.isSelected
                                                    ? 'white'
                                                    : 'primary'
                                                "
                                              >
                                                mdi-arrow-right-bold-circle
                                              </v-icon>
                                              <span
                                                :class="
                                                  item.isSelected
                                                    ? 'text-white'
                                                    : ''
                                                "
                                              >
                                                Max Passengers:
                                                {{
                                                  item.maxPassenger
                                                }}
                                              </span>
                                            </v-col>
                                            <v-col
                                              cols="12"
                                              class="py-0 mt-1"
                                            >
                                              <v-icon
                                                class="mr-3"
                                                :color="
                                                  item.isSelected
                                                    ? 'white'
                                                    : 'primary'
                                                "
                                              >
                                                mdi-arrow-right-bold-circle
                                              </v-icon>
                                              <span
                                                :class="
                                                  item.isSelected
                                                    ? 'text-white'
                                                    : ''
                                                "
                                              >
                                                Max Bags:
                                                {{ item.maxBags }}
                                              </span>
                                            </v-col>
                                            <v-divider
                                              class="mx-4 mt-3"
                                            />
                                            <v-col
                                              cols="12"
                                              class="pb-0"
                                            >
                                              <v-checkbox
                                                v-model="
                                                  item.multiSelect
                                                "
                                                :color="
                                                  item.isSelected
                                                    ? 'white'
                                                    : 'primary'
                                                "
                                                :class="
                                                  item.isSelected
                                                    ? 'multiple-car'
                                                    : ''
                                                "
                                                :disabled="
                                                  !item.isSelected
                                                "
                                                label="You can also select multiple cars."
                                                class="mb-3 mt-0"
                                                hide-details
                                                @click="
                                                  item.multiSelect
                                                    ? clicked(item)
                                                    : ((item.multiSelect = 0),
                                                      (item.requiredCars = 1))
                                                "
                                              />
                                            </v-col>
                                            <v-col
                                              cols="12"
                                              xl="2"
                                              lg="4"
                                              md="6"
                                              sm="4"
                                              class="py-0"
                                            >
                                              <shared-custom-select
                                                v-show="
                                                  item.multiSelect
                                                "
                                                :id="`car-no-${index}`"
                                                v-model="
                                                  item.requiredCars
                                                "
                                                class="car-selection"
                                                :show-label="false"
                                                :disabled="
                                                  !item.isSelected
                                                "
                                                label="Quantity"
                                                :items="
                                                  setCarQuantity(item)
                                                "
                                              />
                                            </v-col>
                                          </v-row>
                                        </v-col>
                                      </v-row>
                                    </v-container>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-form>
                      </v-stepper-window-item>
                      <v-stepper-window-item
                        key="content-3"
                        :value="3"
                      >
                        <v-form
                          ref="step3"
                          v-model="payload.step3.valid"
                        >
                          <v-container
                            v-if="currentStep === 3"
                            class="stepper-container"
                          >
                            <v-row class="mt-8">
                              <v-col
                                v-if="
                                  hasPermission(
                                    PERMISSIONS.reservationsSearchUser
                                  )
                                "
                                cols="12"
                                sm="12"
                                md="12"
                                class="py-0"
                              >
                                <shared-custom-search-field
                                  v-model="payload.step3.user"
                                  label="Search User"
                                  placeholder="Search User by Email"
                                  no-data-text="No user found!"
                                  search-on="user"
                                  @update:modelValue="setUser"
                                />
                              </v-col>
                              <v-col
                                v-if="
                                  hasPermission(
                                    PERMISSIONS.reservationsSearchAffiliate
                                  )
                                "
                                cols="12"
                                sm="12"
                                md="12"
                                class="py-0"
                              >
                                <shared-custom-search-field
                                  v-model="
                                    payload.step3.selectedAffiliate
                                  "
                                  id="search-affiliate"
                                  label="Search Affiliate"
                                  placeholder="Search Affiliate by Name"
                                  no-data-text="No Affiliate found!"
                                  item-title="name"
                                  search-on="getAffiliates"
                                  @update:modelValue="affiliateChange"
                                />
                              </v-col>
                              <v-col
                                cols="12"
                                sm="6"
                                md="6"
                                class="py-0"
                              >
                                <shared-custom-field
                                  id="name"
                                  v-model="payload.step3.name"
                                  label="Name"
                                  required
                                />
                              </v-col>
                              <v-col
                                cols="12"
                                :sm="
                                  payload.step1.checkingLocation !==
                                  'pointToPoint'
                                    ? 6
                                    : 12
                                "
                                class="py-0"
                              >
                                <shared-custom-field
                                  id="email"
                                  v-model="payload.step3.email"
                                  type="email"
                                  required
                                  label="Email"
                                />
                              </v-col>
                              <v-col
                                cols="12"
                                sm="12"
                                md="6"
                                class="py-0"
                              >
                                <shared-custom-field
                                  id="phoneNumber"
                                  v-model="payload.step3.phoneNumber"
                                  type="phoneNumber"
                                  required-error="Phone number or International Phone number is required"
                                  :required="
                                    payload.step3
                                      .internationalPhoneNumber
                                      ? false
                                      : true
                                  "
                                  label="US Phone #"
                                />
                              </v-col>
                              <v-col
                                cols="12"
                                sm="12"
                                md="1"
                                class="d-flex align-center justify-center"
                                :class="
                                  $vuetify.display.mdAndDown
                                    ? 'pt-0 pb-4'
                                    : ''
                                "
                              >
                                <strong style="color: #ff0000"
                                  >OR</strong
                                >
                              </v-col>

                              <v-col
                                cols="12"
                                sm="12"
                                md="5"
                                class="py-0"
                              >
                                <shared-custom-field
                                  id="internationalPhoneNumber"
                                  v-model="
                                    payload.step3
                                      .internationalPhoneNumber
                                  "
                                  prepend-inner-icon="mdi-cellphone"
                                  required-error="Phone number or International Phone number is required"
                                  type="number"
                                  :required="
                                    payload.step3.phoneNumber
                                      ? false
                                      : true
                                  "
                                  label="International Phone #"
                                />
                              </v-col>
                              <v-col
                                v-if="
                                  payload.step1.checkingLocation !==
                                  'pointToPoint'
                                "
                                cols="12"
                                sm="6"
                                md="6"
                                class="py-0"
                              >
                                <shared-custom-field
                                  id="flightNumber"
                                  v-model="payload.step3.flightNumber"
                                  :required="
                                    payload.step1.checkingLocation !==
                                    'toAirport'
                                  "
                                  label="Flight Info"
                                />
                              </v-col>
                              <v-col
                                v-if="
                                  payload.step1.isRoundTrip &&
                                  payload.step1.checkingLocation !==
                                    'pointToPoint'
                                "
                                cols="12"
                                sm="6"
                                md="6"
                                class="py-0"
                              >
                                <shared-custom-field
                                  id="flight"
                                  v-model="
                                    payload.step3.returnFlightNo
                                  "
                                  required
                                  label="Return Flight Info"
                                />
                              </v-col>
                              <v-col
                                v-if="
                                  payload.step1.pickUpLocation ===
                                  'BWI Business District, Linthicum Heights, MD, USA, 21090'
                                "
                                cols="12"
                                sm="12"
                                md="12"
                              >
                                <shared-custom-field
                                  id="hotel"
                                  v-model="payload.step3.hotelName"
                                  label="Hotel Name"
                                  required
                                  @blur="
                                    (e) => storeDataOnLocalStorage()
                                  "
                                />
                              </v-col>
                              <v-col cols="12">
                                <shared-custom-field
                                  id="comments"
                                  v-model="payload.step3.comments"
                                  type="textarea"
                                  no-resize
                                  label="Comments"
                                  hint="Optional"
                                />
                              </v-col>
                              <v-col
                                v-if="payload.step1.isRoundTrip"
                                cols="12"
                              >
                                <shared-custom-field
                                  id="return-trip-comments"
                                  v-model="
                                    payload.step3.returnComments
                                  "
                                  type="textarea"
                                  no-resize
                                  label="Return Trip Comments"
                                  hint="Optional"
                                />
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-form>
                      </v-stepper-window-item>
                      <v-stepper-window-item
                        key="content-4"
                        :value="4"
                      >
                        <v-container class="stepper-container">
                          <v-row>
                            <v-col
                              align="center"
                              cols="12"
                            >
                              <h3 class="text-decoration-underline">
                                Reservation Details Confirmation
                              </h3>
                            </v-col>
                            <v-col>
                              <shared-custom-key-value-pair
                                class="confirmation-step"
                                :config="detailConfig"
                              />
                            </v-col>
                          </v-row>
                          <v-row
                            v-if="!isGettingAQuote"
                            class="py-0"
                          >
                            <v-col cols="12">
                              <v-form
                                ref="step4"
                                v-model="payload.step4.validation"
                              >
                                <div
                                  v-if="currentStep === 4"
                                  class="d-flex"
                                >
                                  <v-checkbox
                                    v-model="payload.step4.valid"
                                    :rules="[
                                      (v) =>
                                        !!v ||
                                        'You must agree to the terms and conditions to continue!',
                                    ]"
                                    color="primary"
                                    class="mt-0"
                                    required
                                  >
                                    <template #label>
                                      <div class="mt-1">
                                        I understand & accept
                                        <a
                                          target="_blank"
                                          href="/privacy-policy"
                                          class="text-primary"
                                          @click.stop
                                        >
                                          <strong
                                            >Privacy Policy</strong
                                          >
                                        </a>
                                        and
                                        <a
                                          target="_blank"
                                          href="/terms-and-conditions"
                                          class="text-primary"
                                          @click.stop
                                        >
                                          <strong
                                            >Terms and
                                            conditions</strong
                                          >
                                        </a>
                                      </div>
                                    </template>
                                  </v-checkbox>
                                </div>
                              </v-form>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-stepper-window-item>
                      <v-stepper-window-item
                        key="content-5"
                        :value="5"
                      >
                        <v-container class="stepper-container">
                          <v-row justify="center">
                            <!-- <v-col
                                v-if="braintreeToken"
                                cols="12"  
                                xl="4"
                                lg="6"
                              >
                                <v-braintree
                                  btn-text=""
                                  class="btn btn-primary"
                                  :authorization="braintreeToken"
                                  :three-d-secure="false"
                                  :three-d-secure-parameters="{
                                    amount: totalBill,
                                  }"
                                  @success="onSuccess"
                                  @load="onLoad"
                                  @loadFail="onLoadFail"
                                  @error="onError"
                                >
                                  <template #button="slotProps">
                                    
                                  </template>
                                </v-braintree>
                                <div class="d-flex justify-center align-center">
                                  <v-btn
                                    id="btnBrainTree"
                                    v-model="payload.step5.valid"
                                    class="d-flex justify-center align-center"
                                    width="200px"
                                    color="primary"
                                    :disabled="!isBraintreeLoaded"
                                    rounded
                                    @click="() => {
                                      slotProps.submit();
                                      isCheckoutBraintree = true;
                                    }
                                    "
                                  >
                                    {{
                                      !isBraintreeLoaded
                                        ? "Loading braintree..."
                                        : "Checkout"
                                    }}
                                  </v-btn>
                                </div>
                              </v-col> -->
                            <!-- <v-col
                                cols="12"
                                class="d-flex justify-center align-center"
                              >
                                <p class="mb-0">
                                  OR
                                </p>
                              </v-col> -->
                            <v-col
                              cols="12"
                              class="d-flex justify-center align-center pt-0"
                            >
                              <div
                                id="paypal-checkout"
                                class="w-50"
                              ></div>
                              <!-- <PayPal
                                  :amount="`${totalBill}`"
                                  currency="USD"
                                  :client="credentials"
                                  :item="myItems"
                                  :braintree="braintreeSdk"
                                  :env="paypalEnvironment"
                                  :button-style="{
                                    size: $vuetify.display.xs
                                      ? 'small'
                                      : 'medium', // small | medium | large | responsive
                                    color: 'blue', // gold | blue | silver | black
                                  }"
                                  @payment-authorized="paypalPaymentAuthorized"
                                  @payment-completed="paypalPaymentCompleted"
                                  @payment-cancelled="cancelPayments"
                                /> -->
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-stepper-window-item>
                    </v-stepper-window>
                  </v-stepper>
                </client-only>
              </v-col>
            </v-row>
            <v-row v-if="!$vuetify.display.xs">
              <v-col
                v-if="errors.length"
                cols="12"
                class="px-5 py-0"
              >
                <message-box
                  description="Please resolve following issues to move forward:"
                  :messages="errors"
                />
              </v-col>
              <v-col>
                <next-back-btn
                  :is-back-btn-visible="currentStep > 1"
                  :is-next-btn-visible="showNextBtn"
                  :is-proceed-btn-visible="
                    isGettingAQuote && currentStep === 4
                  "
                  :is-next-btn-disabled="
                    !payload.step1.checkingLocation
                  "
                  @onBack="onBack()"
                  @onNext="onNext()"
                  @onProceed="proceedToReservation"
                />
                <!-- <shared-custom-btn
                    v-if="currentStep === 5"
                    id="reservation-payment"
                    class="float-right"
                    color="primary"
                    :disabled="disableSubmitBtn"
                    @click="
                      (disableSubmitBtn = true), $refs.btnBrainTree.$el.click()
                    "
                  >
                    Submit
                  </shared-custom-btn> -->
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col
        v-if="currentStep > 1"
        cols="12"
        sm="4"
        md="4"
      >
        <car-calculation
          ref="carCalculation"
          :cars="payload.step2.cars.filter((car) => car.isSelected)"
          :miles="`${payload.step1.miles}`"
          :child-miles="`${payload.step1.childMiles}`"
          :parent-miles="`${payload.step1.parentMiles}`"
          :extra-stops="payload.step1.extraStops"
          :return-extra-stops="payload.step1.returnExtraStops"
          :surges="payload.step1.surges"
          :extra-miles-amount="
            !payload.step1.isRoundTrip ? extraMilesAmount : 0
          "
          :round-trip="payload.step1.isRoundTrip"
          :checking-location="payload.step1.checkingLocation"
          :return-surges="
            payload.step1.isRoundTrip
              ? payload.step1.returnSurges
              : []
          "
          :payload="calculationData"
          :bags-checked-error-message="
            payload.step2.isBagsChecked
              ? ''
              : 'Checking-in Bag(s) is required'
          "
          :current-step="currentStep"
          @onChange="onCalculationChange"
          @onCustomChange="onCustomChange"
          @onGratuityChange="onCustomChange"
          @onBagsChecked="
            (isBagsChecked) =>
              (payload.step2.isBagsChecked = isBagsChecked)
          "
        />
      </v-col>
    </v-row>
    <alert-modal
      :open="showAlertModal"
      v-bind="{ ...alertModalProps }"
      @update:modelValue="(v) => (showAlertModal = v)"
      @onConfirm="onAlertModalConfirm"
      @close="showAlertModal = false"
    />
    <sign-up-modal
      :open="isSignUpModalOpen"
      @close="isSignUpModalOpen = false"
    />
    <confirmation-modal
      :open="isConfirmationModalOpen"
      color="info"
      :title="
        multiSelectCheck
          ? `Do you want to select more then 1 ${selectedItem.name}?`
          : 'Do you want to Add an other Vehicle?'
      "
      @cancel="
        () =>
          multiSelectCheck ? cancel() : cancelOtherCarSelection()
      "
      @confirm="
        (isConfirmationModalOpen = false), (multiSelectCheck = false)
      "
    />
    <v-row v-if="$vuetify.display.xs">
      <v-col
        v-if="errors.length"
        cols="12"
        class="px-5"
      >
        <message-box
          description="Please resolve following issues to move forward:"
          :messages="errors"
        />
      </v-col>
      <v-col>
        <next-back-btn
          :is-back-btn-visible="currentStep > 1"
          :is-next-btn-visible="showNextBtn"
          :is-proceed-btn-visible="
            isGettingAQuote && currentStep === 4
          "
          :is-next-btn-disabled="!payload.step1.checkingLocation"
          @onBack="onBack()"
          @onNext="onNext()"
          @onProceed="proceedToReservation"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  import moment from 'moment';
  import ReservationService from '@/services/reservation';
  import { RoutesConfig, RESERVATION_STATUSES } from '@/enums';
  import AlertModal from '@/shared/modals/AlertModal.vue';
  import ReservationMixin from '@/mixins/ReservationMixin';
  import ConfirmationModal from '@/shared/modals/ConfirmationModal.vue';
  import ReservationCreatePageLoader from '@/components/CustomLoader/ReservationCreatePageLoader.vue';
  import { PERMISSIONS } from '@/enums';
  import { loadScript } from '@paypal/paypal-js';
  import braintree from 'braintree-web';

  const DEFAULT_PAYLOAD = {
    step1: {
      checkingLocation: null,
      pickUpLocation: null,
      dropOffLocation: null,
      pickDateTime: null,
      returnPickDateTime: null,
      noOfPassenger: null,
      valid: false,
      miles: 0,
      isRoundTrip: false,
      surges: [],
      returnSurges: [],
      roundTripDiscountCode: {},
      extraStops: [],
      returnExtraStops: [],
      airportLocationDetails: null,
    },
    step2: {
      numOfSuv: 0,
      numOfSedan: 0,
      selectedGratuity: 0,
      customGratuity: null,
      discountCode: 0,
      isBagsChecked: null,
      cars: [
        {
          awsObjectKey: 'continental-sedan-removebg-preview.png',
          compressedImageUrl: '0',
          createdAt: '2023-01-25T09:48:51.000Z',
          deletedAt: '1970-01-01T00:00:00.000Z',
          id: 1,
          imageUrl:
            'https://the-95-star.s3.amazonaws.com/continental-sedan-removebg-preview.png',
          isActive: true,
          isSelected: false,
          maxBags: 2,
          maxPassenger: 3,
          minimumRate: 59,
          name: 'Lux. Sedan',
          quantity: 6,
          requiredCars: 1,
          toAdd: 12,
          toMultiply: 2.94,
          updatedAt: '2023-06-29T14:59:31.000Z',
        },
        {
          awsObjectKey: 'main-PhotoRoom.png-PhotoRoom.png',
          compressedImageUrl: '0',
          createdAt: '2023-01-25T09:48:51.000Z',
          deletedAt: '1970-01-01T00:00:00.000Z',
          id: 2,
          imageUrl:
            'https://the-95-star.s3.amazonaws.com/main-PhotoRoom.png-PhotoRoom.png',
          isActive: true,
          isSelected: false,
          maxBags: 4,
          maxPassenger: 6,
          minimumRate: 69,
          name: 'SUV',
          quantity: 6,
          requiredCars: 1,
          toAdd: 21,
          toMultiply: 3.37,
          updatedAt: '2023-09-14T18:29:58.000Z',
        },
      ],
      discounts: [],
      isMeetAndGreet: false,
      valid: false,
    },
    step3: {
      name: null,
      email: null,
      phoneNumber: null,
      internationalPhoneNumber: null,
      flightNumber: null,
      returnFlightNo: null,
      comments: null,
      hotelName: null,
      returnComments: null,
      user: null,
      selectedAffiliate: null,
      valid: false,
    },
    step4: {
      valid: false,
    },
    step5: {
      valid: false,
    },
  };

  export default {
    name: 'ReservationCreatePage',
    components: {
      AlertModal,
      // PayPal,
      ConfirmationModal,
      ReservationCreatePageLoader,
    },
    mixins: [ReservationMixin],
    data: () => ({
      header: 'ReservationCreatePage',
      extraMilesAmount: null,
      isCheckoutBraintree: false,
      isPaypalBtnsAdded: false,
      isEditing: false,
      isCustomChange: false,
      isDraft: false,
      totalBill: null,
      braintreeToken: null,
      calculationData: null,
      isLoading: false,
      reservationId: null,
      showAlertModal: false,
      onAlertModalConfirm: () => {},
      isSignUpModalOpen: false,
      shouldClearReturnDateTime: false,
      shouldClearDateTime: false,
      extraCarSelect: false,
      multiSelectCheck: false,
      errors: [],
      predefinedLocations: [
        {
          title: 'BWI Airport',
          airportName: 'BWI',
          children: [
            {
              value:
                'Baltimore/Washington International Thurgood Marshall Airport (BWI), Baltimore, MD, USA, 21240',
              description:
                "BWI - Baltimore-Washington Int'l Airport.",
            },
            {
              value:
                'BWI Airport Rail Station, Amtrak Way, BWI Airport, MD, USA, 21240',
              description:
                'BWI Airport Rail Station, Amtrak Way, BWI Airport, MD, USA, 21240',
            },
            {
              value:
                'BWI Airport Rental Car Return, Stoney Run Road, Hanover, MD, USA, 21076',
              description:
                'BWI Airport Rental Car Return, Stoney Run Road, Hanover, MD, USA, 21076',
            },
            {
              value:
                'Signature Flight Support BWI - Baltimore Washington Intl Airport, Aaronson Drive, Glen Burnie, MD, USA, 21061',
              description:
                'Signature Flight Support BWI - Baltimore Washington Intl Airport, Aaronson Drive, Glen Burnie, MD, USA, 21061',
            },
            {
              value: 'BWI Hotel District, 21090',
              description:
                'BWI Business District, Linthicum Heights, MD, USA, 21090',
            },
          ],
        },
        {
          title: 'DCA - Reagan National Airport',
          airportName: 'DCA',
          children: [
            {
              value:
                '2401 Ronald Reagan Washington National Airport Access Rd, Arlington, VA 22202',
              description: 'DCA - Reagan National Airport ',
            },
            {
              value:
                'Washington National Airport, Hangar 1, General Aviation Dr #7, Washington, VA 20001',
              description: 'DCA - Signature Flight Support',
            },
            {
              value:
                '2401 Ronald Reagan Washington National Airport Access Rd, Arlington, VA 22202 ',
              description: 'DCA Car Rental',
            },
            {
              value: '2600 Crystal Dr, Arlington, VA 22202',
              description: 'DCA Hotel District',
            },
          ],
        },
        {
          title: 'IAD - Dulles Airport',
          airportName: 'IAD',
          children: [
            {
              value: '1 Saarinen Cir, Dulles, VA 20166',
              description: "IAD - Dulles Int'l Airport",
            },
            {
              value:
                "Washington Dulles Int'l Airport, 23950 Windsock Dr Suite 2000, Sterling, VA 20166",
              description: 'Signature Flight Support IAD',
            },
            {
              value: '23480 Autopilot Dr, Sterling, VA 20166',
              description: 'IAD Car Rental',
            },
            {
              value: '1 Saarinen Cir, Dulles, VA 20166 ',
              description: 'IAD-Dulles Hotel District',
            },
          ],
        },
      ],
      airportLocationFieldHint: '',
      serviceReservationCreate: {},
      serviceDiscount: {},
      discountCode: '',
      credentials: {
        // sandbox: process.env.VUE_APP_PAYPAL_CLIENT_ID,
        // production: process.env.VUE_APP_PAYPAL_PRODUCTION_CLIENT_ID,
        [process.env.VUE_APP_PAYPAL_ENVIRONMENT || 'sandbox']:
          process.env.VUE_APP_PAYPAL_CLIENT_ID,
      },
      myItems: [
        {
          name: 'Reservation',
          currency: 'USD',
        },
      ],
      // braintreeSdk: window.braintree,
      braintreeSdk: '',
      paypalEnvironment:
        process.env.VUE_APP_PAYPAL_ENVIRONMENT || 'sandbox',
      valueFields: {
        cardName: '',
        cardNumber: '',
        cardMonth: '',
        cardYear: '',
        cardCvv: '',
      },
      currentStep: 1,
      isGettingAQuote: true,
      steps: [
        { title: 'Pick & Drop off' },
        { title: 'Car Selection & Rates' },
        { title: 'About Yourself' },
        { title: 'Confirmation' },
        { title: 'Payment' },
      ],
      payload: JSON.parse(JSON.stringify(DEFAULT_PAYLOAD)),
      alertModalProps: {},
      newReservation: {},
      disableSubmitBtn: false,
      isConfirmationModalOpen: false,
      selectedItem: {},
      overlay: false,
      isBraintreeLoaded: false,
      PERMISSIONS,
    }),
    computed: {
      configurations() {
        return {};
      },
      locations() {
        const values = [
          { label: 'From Airport', value: 'fromAirport' },
          { label: 'To Airport', value: 'toAirport' },
        ];
        if (
          this.hasPermission(PERMISSIONS.reservationsPointToPoint)
        ) {
          values.push({
            label: 'Point To Point',
            value: 'pointToPoint',
          });
        }
        return values;
      },
      reservationHeader() {
        let header = 'Get a Quote';
        if (!this.isGettingAQuote) {
          header = this.isDraft
            ? 'Proceed to Reservation'
            : 'Make a Reservation';
        }
        return header;
      },
      getMeetAndGreet() {
        if (this.payload.step2.isMeetAndGreet) {
          return this.$store.configurations.meetAndGreet;
        }
        return null;
      },
      roundTripDiscountCode() {
        return this.payload?.step1?.roundTripDiscountCode || {};
      },
      isCarSelectionValid() {
        return (
          this.payload.step1.noOfPassenger <=
          this.payload.step2.cars
            .filter((car) => car.isSelected && car.requiredCars)
            .map((car) => car.requiredCars * car.maxPassenger)
            .reduce((acc, item) => {
              acc += item;
              return acc;
            }, 0)
        );
      },
      disabledRountTrip() {
        return [
          'pickDateTime',
          'pickUpLocation',
          'dropOffLocation',
        ].some((key) => !this.payload.step1[key]);
      },
      isAnyCarSelected() {
        return this.payload.step2.cars.some((car) => car.isSelected);
      },
      isStep2Valid() {
        return (
          this.payload.step2.valid &&
          this.isCarSelectionValid &&
          this.isAnyCarSelected
        );
      },
      isNextBtnDisabled() {
        if (this.currentStep === 2) {
          let isInvalid = !this.isStep2Valid;
          if (this.payload.step2.selectedGratuity === 0) {
            isInvalid = true;
          }
          if (
            this.payload.step2.selectedGratuity === 'custom' &&
            !this.payload.step2.customGratuity
          ) {
            isInvalid = true;
          }
          return isInvalid;
        }
        return !this.payload[`step${this.currentStep}`].valid;
      },
      showNextBtn() {
        return this.currentStep < this.steps.length;
      },
      // gratuity() {
      //     return this.payload.step2.selectedGratuity === 'custom'
      //         ? this.payload.step2.customGratuity
      //         : this.payload.step2.selectedGratuity;
      // },
      detailConfig() {
        let details = [
          {
            title: 'Name',
            value: this.payload.step3.name,
          },
          {
            title: 'Email',
            value: this.payload.step3.email,
          },
          {
            title: 'Phone No',
            value: this.payload.step3.phoneNumber,
          },
          {
            title: 'Pickup Address',
            value: this.payload.step1.pickUpLocation,
          },
          {
            title: 'Extra Stops',
            value: this.formattedExtraStops(
              this.payload.step1.extraStops
            ),
          },
          {
            title: 'Drop off Address',
            value: this.payload.step1.dropOffLocation,
          },
          {
            title: 'Date & Time',
            value: this.formatDate(this.payload.step1.pickDateTime),
          },
          {
            title: 'Return Pickup Address',
            value: this.payload.step1.dropOffLocation,
          },
          {
            title: 'Return Extra Stops',
            value: this.formattedExtraStops(
              this.payload.step1.returnExtraStops
            ),
          },
          {
            title: 'Return Drop off Address',
            value: this.payload.step1.pickUpLocation,
          },
          {
            title: 'Return Date & Time',
            value: this.formatDate(
              this.payload.step1.returnPickDateTime
            ),
          },
          {
            title: 'Number of Passengers',
            value: this.payload.step1.noOfPassenger,
          },
          {
            title: 'Flight Info',
            value: this.payload.step3.flightNumber,
          },
          {
            title: 'Return Flight Info',
            value: this.payload.step3.returnFlightNo,
          },
          {
            title: 'Hotel Name',
            value: this.payload.step3.hotelName,
          },
          {
            title: 'Comments',
            value: this.payload.step3.comments,
          },
          {
            title: 'Return Comments',
            value: this.payload.step3.returnComments,
          },
          {
            title: 'Vehicle',
            value: this.filterCars(
              this.payload.step2.cars.filter((car) => car.isSelected)
            ),
          },
          {
            title: 'Miles',
            value: this.payload.step1.miles,
          },
          {
            title: 'Total Amount',
            value: `$${this.totalBill}`,
          },
        ];
        if (!this.payload.step1.isRoundTrip) {
          details = details.filter(
            (d) =>
              ![
                'Return Flight Info',
                'Return Date & Time',
                'Return Drop off Address',
                'Return Pickup Address',
                'Return Comments',
              ].includes(d.title)
          );
        }
        return details;
      },
    },
    watch: {
      payload: {
        handler() {
          this.storeDataOnLocalStorage();
          this.setErrors();
        },
        deep: true,
      },
    },
    beforeMount() {
      if (this.currentStep === 5) {
        this.isEditing = true;
        // window.addEventListener('beforeunload', (event) => {
        //     if (!this.isEditing) return;
        //     event.preventDefault();
        //     event.returnValue = '';
        // });
      }
    },
    created() {
      if (this.$route.query.id) {
        this.removeDataFromLocalStorage();
        this.reservationId = this.$route.query.id;
        this.isDraft = this.$route.query.draft;
        this.proceedToReservation();
        this.fetchReservationDetail(this.reservationId);
      }
      this.getClientsToken();
      this.fetchReturnTripDiscounts();
      const currentStepInQuery = this.$route.query.currentStep || 1;
      this.currentStep = +currentStepInQuery;
      this.loadDataFromLocalStorage();

      this.fetchCars();
      let payload =
        this.$localStorage.getItem('payload') || '{"step1":{}}';
      payload = JSON.parse(payload);
      this.setExtraMilesAmount();
      if (this.currentStep !== 1 && !payload.step1.dropOffLocation) {
        this.currentStep = 1;
        this.isGettingAQuote = false;
        this.updateQueryParams();
      }
      if (this.$route.query.isGettingAQuote === 'false') {
        this.isGettingAQuote = false;
        this.proceedToReservation();
      }
      if (!this.hasPermission(PERMISSIONS.usersProfileInfo)) {
        this.payload.step1 = {
          ...this.payload.step1,
          dropOffLocation:
            this.payload.step1.dropOffLocation ||
            this.$store.user?.address,
        };
        this.payload.step3 = {
          ...this.payload.step3,
          name: this.payload.step3.name || this.$store.user?.fullName,
          email: this.payload.step3.email || this.$store.user?.email,
          phoneNumber:
            this.payload.step3.phoneNumber ||
            this.$store.user?.phoneNumber,
        };
      }
    },
    beforeUnmount() {
      this.removeDataFromLocalStorage();
    },
    mounted() {
      setTimeout(() => {
        this.initializeAndSetPaypal();
      }, 1500);
    },
    methods: {
      initializeBraintreeComponent() {
        const braintreeBtn = document.getElementById('btnBrainTree');

        console.log(braintree, 'braintree');

        braintree.client.create(
          {
            authorization: this.braintreeToken,
            selector: '#dropinContainer',
          },
          (err, dropinInstance) => {
            if (err) {
              console.log(err, 'error in initialization');
              return;
            }

            braintreeBtn?.addEventListener('click', () => {
              dropinInstance.requestPaymentMethod((err, payload) => {
                if (err) {
                  console.error('error in payment', err);
                }
              });
            });
          }
        );
      },
      initializeAndSetPaypal() {
        if (!this.isPaypalBtnsAdded && process.client) {
          let paypalContainer =
            document.getElementById('paypal-checkout');
          if (!paypalContainer) return;
          loadScript({
            'client-id':
              'ARwS3i8Yy3Fy3vvyPjUh0GXmLumOvUesGs9xk9Ed7G3Z3BQVIjMgfWlb9vHRVXQYW5wJQvmm4hiCfQvl',
          })
            .then((paypal) => {
              this.isPaypalBtnsAdded = true;
              paypal
                .Buttons({
                  message: {
                    align: 'center',
                    color: 'black',
                    position: 'top',
                  },
                  createOrder: (data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: this.totalBill,
                          },
                        },
                      ],
                    });
                  },
                  onApprove: (data, actions) => {
                    return actions.order.capture().then((details) => {
                      this.create(RESERVATION_STATUSES.created, {
                        transactionId: details.id,
                        ...details,
                      });
                    });
                  },
                })
                .render(paypalContainer);
            })
            .catch((err) => {
              this.isPaypalBtnsAdded = false;
              console.error('Failed to load PayPal SDK', err);
            });
        }
      },
      onLocationChange() {
        const { airportLocationDetails, checkingLocation } =
          this.payload.step1;
        if (airportLocationDetails?.children?.length) {
          if (checkingLocation === 'fromAirport') {
            this.payload.step1.pickUpLocation =
              airportLocationDetails.children[0].value;
            if (!this.payload.step1.dropOffLocation)
              this.payload.step1.dropOffLocation = null;
          } else if (checkingLocation === 'toAirport') {
            if (!this.payload.step1.pickUpLocation)
              this.payload.step1.pickUpLocation = null;
            this.payload.step1.dropOffLocation =
              airportLocationDetails.children[0].value;
          }
          this.airportLocationFieldHint = `Click for more ${
            airportLocationDetails.airportName || ''
          } Airport options`;
        }
      },
      test(pro) {
        console.log(pro, 'pro');
      },
      affiliateChange(item) {
        this.payload.step3.selectedAffiliate = item || {};
      },
      storeDataOnLocalStorage() {
        this.$localStorage.setItem(
          'payload',
          JSON.stringify(this.payload)
        );
      },
      async getClientsToken() {
        const response = await ReservationService.getClientToken();
        this.braintreeToken = response.data.token;
      },
      loadDataFromLocalStorage() {
        const payload = this.$localStorage.getItem('payload');
        this.payload = payload
          ? JSON.parse(payload)
          : JSON.parse(JSON.stringify(DEFAULT_PAYLOAD));
      },
      removeDataFromLocalStorage() {
        this.$localStorage.removeItem('payload');
      },
      filterCars(carsArray) {
        let bookedCars = [];
        carsArray.forEach((item) => {
          bookedCars.push(`${item.name}: ${item.requiredCars}`);
        });
        return bookedCars.join(', ');
      },
      calculateCarRate(car, miles) {
        const calculations = {
          cars: [car],
          miles,
          extraMilesAmount: this.extraMilesAmount,
          roundTrip: this.payload.step1.isRoundTrip,
          isCreatePage: true,
        };
        const payload = ReservationCalculation(calculations);
        return payload.sumOfTotalCars;
      },
      onCalculationChange(payload) {
        this.totalBill = payload.totalBill.toFixed(2);
      },
      onCustomChange(payload) {
        this.payload.step2.selectedGratuity = payload?.gratuity;
        this.payload.step2.customGratuity = payload?.customGratuity;
        this.isCustomChange = payload.valid;
      },
      setUser(payload) {
        this.payload.step3.user = payload;
        this.payload.step3.name = payload.fullName;
        this.payload.step3.phoneNumber = payload.phoneNumber;
        this.payload.step3.email = payload.email;
      },
      onDraft() {
        if (this.$store.user.id)
          return this.create(RESERVATION_STATUSES.draft);
        this.alertModalProps = {
          type: 'info',
          title: 'Want to save as Draft?',
          message: 'Just signup for free and avail this feature.',
          okBtnLabel: 'Sign Up',
        };
        this.onAlertModalConfirm =
          this.redirectToSignUpModal.bind(this);
        this.showAlertModal = true;
      },
      paypalPaymentAuthorized(data) {
        // console.log('on Paypal authorization', data);
      },
      paypalPaymentCompleted(payload) {
        // console.log('on Paypal Success', payload);
        // braintree.dropin.create({

        //     authorization: CLIENT_TOKEN_FROM_SERVER,
        //     container: '#dropin-container'
        // }).then((dropinInstance) => {

        // }).catch((error) => {});
        this.create(RESERVATION_STATUSES.created, payload);
      },
      cancelPayments(data) {
        // console.log('on Paypal Cancel Payment', data);
      },
      onSuccess(payload) {
        this.isCheckoutBraintree = true;
        // console.log('on Braintree Success', payload);
        this.create(RESERVATION_STATUSES.created, payload);
      },
      onLoad(instance) {
        console.log(instance, 'instance');
        this.isBraintreeLoaded = true;
        // console.log('on Braintree Load', instance);
      },
      onLoadFail(instance) {
        console.log('on Braintree Fail', instance);
      },
      onError(error) {
        this.isCheckoutBraintree = false;
        // let message = error.message;
        // console.log(message, 'message', error, 'error');
        this.disableSubmitBtn = false;
      },
      onCheckingLocationChange() {
        if (this.payload.step1.checkingLocation !== 'pointToPoint') {
          const tempLocation = this.payload.step1.pickUpLocation;
          this.payload.step1.pickUpLocation =
            this.payload.step1.dropOffLocation;
          this.payload.step1.dropOffLocation = tempLocation;
        } else {
          this.payload.step1.dropOffLocation = null;
          this.payload.step1.pickUpLocation = null;
          this.payload.step1.isRoundTrip = false;
        }
      },
      async fetchCars() {
        if (
          !this.payload.step2.cars.length ||
          this.payload.step2.cars.length !== this.$store.cars.length
        ) {
          if (!this.$store.cars.length) await this.$store.fetchCars();
          this.payload.step2.cars = JSON.parse(
            JSON.stringify(this.$store.cars)
          );
          this.setCarPrices(this.payload.step2.cars);
        }
      },
      setCarPrices(cars) {
        cars.forEach((car) => {
          this[car?.name?.toLowerCase()] = {
            minimumRate: car.minimumRate,
            totalCount: Array(car.quantity)
              .fill()
              .map((x, i) => ++i),
          };
        });
      },
      setCarQuantity(car) {
        return Array(car.quantity)
          .fill()
          .map((x, i) => ++i);
      },
      proceedToReservation() {
        this.steps = [
          { title: 'Pick & Drop off' },
          { title: 'Car Selection & Info' },
          { title: 'About Yourself' },
          { title: 'Confirmation' },
          { title: 'Payment' },
        ];
        if (this.isGettingAQuote) {
          if (this.currentStep === 4) {
            this.currentStep = this.currentStep - 1;
          }
          this.isGettingAQuote = false;
          this.updateQueryParams();
        }
      },
      onBack() {
        this.errors = [];
        if (this.isGettingAQuote && this.currentStep === 4) {
          this.currentStep -= 2;
        } else {
          this.currentStep -= 1;
        }

        this.loadDataFromLocalStorage();
        this.updateQueryParams();
        this.$vuetify.display.xs && this.onTop();
        this.payload.step4.valid = false;
      },
      async validateSteps() {
        if (this.currentStep === 2) {
          const isGratuityFormValid = await this.$refs?.carCalculation?.$refs?.gratuityForm?.validate();
          return (
            isGratuityFormValid &&
            !this.isNextBtnDisabled &&
            this.payload.step2.isBagsChecked
          );
        }
        const { valid } = await this.$refs[
          `step${this.currentStep}`
        ].validate();
        return valid;
      },
      setErrors() {
        setTimeout(() => {
          this.errors = [];

          const elements = Array.from(
            document.getElementsByClassName('v-messages')
          );

          if (this.currentStep === 2) {
            if (!this.isAnyCarSelected) {
              const error = 'You must  select  one car to  continue!';
              if (!this.errors.includes(error))
                this.errors.push(error);
            } else if (!this.isCarSelectionValid) {
              const error = `Selected cars will not accommodate
                                  ${this.payload.step1.noOfPassenger}
                                  passengers. Please select different or
                                  multiple cars.`;
              if (!this.errors.includes(error))
                this.errors.push(error);
            }
          }

          elements.forEach((element) => {
            const parentClass =
              element?.parentElement?.parentElement?.className;
            if (
              parentClass &&
              parentClass.includes('v-input--error')
            ) {
              const error = element.firstElementChild.innerHTML;
              if (!this.errors.includes(error))
                this.errors.push(error);
            }
          });
        }, 0);
      },
      async onNext() {
        this.setErrors();
        if (await this.validateSteps()) {
          if (this.currentStep === 1) {
            await this.getDistanceInMiles();

            if (
              this.payload.step1.isRoundTrip &&
              this.payload.step1.roundTripDiscountCode?.id
            ) {
              this.setReturnTripDiscountCode();
            } else {
              this.filterRoundTripDiscount();
            }
          }

          if (this.isGettingAQuote && this.currentStep === 2) {
            this.currentStep += 2;
          } else {
            this.currentStep += 1;
          }
          if (this.currentStep === 5) {
            setTimeout(() => {
              this.initializeAndSetPaypal();
              // this.initializeBraintreeComponent();
            }, 1500);
          }
          this.loadDataFromLocalStorage();
          this.updateQueryParams();
          this.$vuetify.display.xs && this.onTop();
        }
      },
      setReturnTripDiscountCode() {
        const date = moment(
          this.payload.step1.returnPickDateTime
        ).format('yyyy-MM-DD');
        if (
          this.payload.step1.roundTripDiscountCode.to >= date &&
          this.payload.step1.roundTripDiscountCode.from <= date
        ) {
          if (this.payload.step2.discounts.length === 0) {
            this.payload.step2.discounts.push(
              this.payload.step1.roundTripDiscountCode
            );
          }
          this.storeDataOnLocalStorage();
          return;
        }
        this.filterRoundTripDiscount();
      },
      filterRoundTripDiscount() {
        this.payload.step2.discounts =
          this.payload.step2?.discounts?.filter(
            (obj) => obj.type !== 'round trip'
          );
        this.storeDataOnLocalStorage();
      },
      async fetchReturnTripDiscounts() {
        this.isLoading = true;
        const response = await ReservationService.getDiscountCodes();
        this.payload.step1.roundTripDiscountCode = response.data;
        this.isLoading = false;
      },
      async create(
        status = RESERVATION_STATUSES.created,
        paymentDetails = {}
      ) {
        this.alertModalProps = {
          type: 'loading',
          title: 'Your details are verified, Please wait...',
          message: 'Creating the reservation',
          hideBtns: true,
        };
        this.showAlertModal = true;
        // Todo: Need to upgrade the logic of calculating amount
        const reservationDetails = {
          name: this.payload.step3.name,
          phoneNumber: this.payload.step3.phoneNumber,
          internationalPhoneNumber:
            this.payload.step3.internationalPhoneNumber,
          email: this.payload.step3.email,
          userId: this.$store.user.isAdmin
            ? this.payload.step3.user.id || null
            : this.$store.user.id,
          pickUpLocation: this.payload.step1.pickUpLocation,
          dropOffLocation: this.payload.step1.dropOffLocation,
          noOfPassenger: +this.payload.step1.noOfPassenger,
          affiliateId:
            this.payload.step3.selectedAffiliate?.id || undefined,
          affiliateName:
            this.payload.step3.selectedAffiliate?.name || undefined,
          hotelName: this.payload.step3.hotelName,
          pickUpDateTime: this.payload.step1.pickDateTime,
          checkingLocation: this.payload.step1.checkingLocation,
          comments: this.payload.step3.comments,
          flightNumber: this.payload.step3.flightNumber,
          status,
          returnFlightNumber: this.payload.step3.returnFlightNo,
          returnFlightComments: this.payload.step3.returnComments,
          returnPickUpDateTime: this.payload.step1.isRoundTrip
            ? this.payload.step1.returnPickDateTime
            : null,
          cars: this.payload.step2.cars.filter(
            (car) => car.isSelected
          ),
          isRoundTrip: this.payload.step1.isRoundTrip,
          isMeetAndGreet: this.payload.step2.isMeetAndGreet,
          parentMiles: +this.payload.step1.parentMiles,
          childMiles: +this.payload.step1.childMiles,
          miles: +this.payload.step1.miles,
          discounts: this.payload.step2.discounts,
          surges: this.payload.step1.surges,
          returnSurges: this.payload.step1.returnSurges,
          extraStops: this.payload.step1.extraStops,
          returnExtraStops: this.payload.step1.returnExtraStops,
          isBagsChecked: this.payload.step2.isBagsChecked === 'yes',
          gratuity: +this.payload.step2.customGratuity
            ? 0
            : this.payload.step2.selectedGratuity === 1
            ? 0
            : this.payload.step2.selectedGratuity,
          customGratuity: +this.payload.step2.customGratuity || null,
          paymentDetails,
          draftId: this.payload.step1.draftId,
        };

        if (status === RESERVATION_STATUSES.draft) {
          delete this.payload.step2.discounts;
          this.payload.step4.valid = false;
          this.payload.step4.validation = false;
          reservationDetails.draftPayload = {
            ...this.payload,
            totalBill: this.totalBill,
            selectedAffiliate: this.payload.step3.selectedAffiliate,
          };
        }

        reservationDetails.id = this.reservationId;
        try {
          const response = await ReservationService[
            this.isDraft && status === RESERVATION_STATUSES.created
              ? 'proceedToReservation'
              : 'create'
          ](reservationDetails);
          this.newReservation = response.data.reservation;
          this.alertModalProps = {
            type: 'success',
            title: 'Reservation Created Successfully!',
            okBtnLabel: this.$store.user.id
              ? status === RESERVATION_STATUSES.draft
                ? 'Go to Reservation'
                : 'Check Details'
              : 'Go to Home',
            hideCancelBtn: true,
          };
          const hoursDifference = this.getHoursDiffFromCurrentTime(
            this.payload.step1.pickDateTime
          );

          if (
            !this.hasPermission(
              PERMISSIONS.reservationsCreateWithInTwentyFourHours
            ) &&
            hoursDifference <= 24
          ) {
            this.alertModalProps = {
              ...this.alertModalProps,
              type: 'warning',
              message: `Your reservation date time is in under 24 Hours. kindly contact us on this number ${this.$store.configurations.home.contactNumber}`,
            };
          }

          if (status === RESERVATION_STATUSES.draft) {
            this.isDraft = true;
            this.alertModalProps = {
              ...this.alertModalProps,
              type: 'success',
              title: 'Reservation Saved As Draft Successfully!',
            };
          }

          this.onAlertModalConfirm =
            this.redirectToReservations.bind(this);
          this.showAlertModal = true;
          this.removeDataFromLocalStorage();
        } catch (err) {
          this.isCheckoutBraintree = false;
          this.alertModalProps = {
            type: 'error',
            title: 'Please try Again',
            message:
              'We are facing some issue while creating reservation',
            hideCancelBtn: true,
          };
          this.onAlertModalConfirm = function () {
            this.showAlertModal = false;
          }.bind(this);
          this.showAlertModal = true;
        }
      },
      redirectToReservations() {
        if (this.isDraft) {
          return this.$router.push({
            path: RoutesConfig.reservations.path,
            query: { filters: JSON.stringify({ status: 'Draft' }) },
          });
        }
        if (this.$store.user.id) {
          return this.$router.push(
            `/reservation/details/${this.newReservation.id}`
          );
        }
        this.$router.push(RoutesConfig.default.path);
      },
      redirectToSignUpModal() {
        this.showAlertModal = false;
        this.isSignUpModalOpen = true;
      },
      updateQueryParams() {
        this.$router
          .replace({
            query: {
              currentStep: this.currentStep,
              isGettingAQuote: this.isGettingAQuote,
              isDraft: this.isDraft,
            },
          })
          .catch();
      },
      onPickUpDateTimeChange(e) {
        const { returnPickDateTime, pickDateTime } =
          this.payload.step1;

        if (returnPickDateTime && pickDateTime > returnPickDateTime) {
          this.payload.step1.returnPickDateTime = null;
          this.shouldClearReturnDateTime = true;
        }

        const hoursDifference =
          this.getHoursDiffFromCurrentTime(pickDateTime);
        if (
          !this.hasPermission(
            PERMISSIONS.reservationsCreateWithInSixHours
          ) &&
          hoursDifference <= 6
        ) {
          this.alertModalProps = {
            type: 'error',
            title: "Reservation can't be created!",
            messages: [
              'You cannot create a Reservation within 6 hours!',
              `Please call office at ${this.$store.configurations.home.contactNumber} to make a reservation`,
            ],
            hideCancelBtn: true,
          };
          this.onAlertModalConfirm = function () {
            this.showAlertModal = false;
            this.shouldClearDateTime = true;
          }.bind(this);
          this.showAlertModal = true;
        }
      },
      async fetchReservationDetail(id) {
        const response = await ReservationService.get(id);
        const data = response.data || {};
        if (this.isDraft) {
          const draftPayload = data.draftPayload || {};
          this.payload = draftPayload;
          this.payload.step1.draftId = data.id;
          return;
        }

        this.payload.step3.selectedAffiliate = data.affiliate || {};
        this.payload.step1 = {
          ...this.payload.step1,
          pickUpLocation: data.pickUpLocation,
          dropOffLocation: data.dropOffLocation,
          checkingLocation: data.checkingLocation,
          extraStops: data.ReservationExtraStops || [],
          noOfPassenger: data.noOfPassenger,
          isRoundTrip: data.isRoundTrip,
        };

        this.payload.step2 = {
          ...this.payload.step2,
          isMeetAndGreet:
            data.checkingLocation === 'toAirport'
              ? false
              : data.isMeetAndGreet,
          selectedGratuity: +data.gratuity,
          isBagsChecked: data.isBagsChecked,
          // isBagsChecked: data.isBagsChecked, // will remove it later
          customGratuity: 0,
          cars: this.payload.step2.cars.map((car) => {
            data.ReservationDetails.forEach((inCommingCar) => {
              if (car.id === inCommingCar.carId) {
                car.requiredCars = inCommingCar.requiredCars;
                car.multiSelect = car.requiredCars > 1 ? true : false;
                car.isSelected = true;
              }
            });
            return car;
          }),
        };
        this.payload.step3 = {
          ...this.payload.step3,
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          internationalPhoneNumber: data.internationalPhoneNumber,
        };
        this.calculationData = {
          gratuity: data.gratuity,
          customGratuity: 0,
          meetAndGreet: this.payload.step2.isMeetAndGreet
            ? data.meetAndGreet
            : {},
        };
      },
      async fetchSurgeDetails(isRoundTrip = false) {
        const response = await ReservationService.getSurges(
          this.payload.step1[
            isRoundTrip ? 'returnPickDateTime' : 'pickDateTime'
          ]
        );
        this.payload.step1[isRoundTrip ? 'returnSurges' : 'surges'] =
          response.dataItems;
      },
      returnTripPickUpAllowedDates(val) {
        const formattedValue = moment(val).format('YYYY-MM-DD');
        return (
          formattedValue >=
          moment(this.payload.step1.pickDateTime).format('yyyy-MM-DD')
        );
      },
      async getAndCalculateMiles(locations) {
        let results = await Promise.all(
          locations.map((loc, index) => {
            if (locations[index + 1]) {
              return this.getMilesFromGoogle(
                loc.value,
                locations[index + 1].value
              );
            }
          })
        );

        return results
          .filter((r) => r)
          .map((r) => r?.rows[0]?.elements[0]?.distance?.text || 0)
          .filter((r) => {
            return r.includes ? r.includes('mi') : false;
          })
          .map((r) => +r?.split(' ')[0].replaceAll(',', ''))
          .reduce((accu, r) => {
            accu += r;
            return accu;
          }, 0);
      },
      async getDistanceInMiles() {
        const step1 = this.payload.step1;

        this.alertModalProps = {
          type: 'loading',
          title: 'Please wait...',
          message: 'Calculating the distance',
          hideBtns: true,
        };
        this.showAlertModal = true;

        const locations = [
          { value: step1.pickUpLocation },
          ...step1.extraStops,
          { value: step1.dropOffLocation },
        ];

        let miles = await this.getAndCalculateMiles(locations);
        miles = +Number(miles).toFixed(2);
        step1.parentMiles = miles;

        if (step1.isRoundTrip) {
          let roundTripLocations = [
            { value: step1.dropOffLocation },
            ...step1.returnExtraStops,
            { value: step1.pickUpLocation },
          ];

          let returnMiles = await this.getAndCalculateMiles(
            roundTripLocations
          );
          returnMiles = +Number(returnMiles).toFixed(2);
          step1.childMiles = returnMiles;
          miles += returnMiles;
        }

        step1.miles = +Number(miles).toFixed(2);
        const response = await this.getMilesFromGoogle(
          step1.pickUpLocation,
          step1.dropOffLocation
        );

        const distance =
          response?.rows[0]?.elements[0]?.distance?.text;
        miles = distance?.split(' ')[0];
        step1.miles = +miles.replaceAll(',', '');
        this.setExtraMilesAmount();

        this.showAlertModal = false;
      },
      setExtraMilesAmount() {
        if (
          !this.payload.step1.isRoundTrip &&
          this.payload.step1.miles >
            this.$store.configurations?.maxMilesSurge?.maxMiles
        ) {
          this.extraMilesAmount =
            +this.$store.configurations?.maxMilesSurge?.amount;
        } else {
          this.extraMilesAmount = 0;
        }
      },
      getMilesFromGoogle(origin, destination) {
        const googleApiService =
          new window.google.maps.DistanceMatrixService();
        return new Promise((resolve) => {
          googleApiService.getDistanceMatrix(
            {
              origins: [origin],
              destinations: [destination],
              travelMode: 'DRIVING',
              unitSystem: google.maps.UnitSystem.IMPERIAL,
              // avoidHighways: false,
              // avoidTolls: false
            },
            function (response) {
              resolve(response);
            }
          );
        });
      },
      clicked(a) {
        this.selectedItem = a;
        this.multiSelectCheck = true;
        this.isConfirmationModalOpen = true;
      },
      cancel() {
        this.isConfirmationModalOpen = false;
        this.multiSelectCheck = false;
        this.selectedItem.multiSelect = false;
      },
      onTop() {
        const slidingPages =
          document.getElementsByClassName('v-main__wrap');
        slidingPages[0].scrollTo(0, 310);
      },
      onRemovingStop(index) {
        this.payload.step1.extraStops.splice(index, 1);
      },
      onAddingExtraStop() {
        this.payload.step1.extraStops.push({ value: null });
      },
      otherCarSelection(item) {
        if (item.isSelected) {
          return (item.isSelected = false);
        }
        if (!this.isAnyCarSelected) {
          return (item.isSelected = true);
        }
        item.isSelected = item.isSelected ? false : true;
        this.extraCarSelect = item;
        this.isConfirmationModalOpen = true;
      },
      cancelOtherCarSelection() {
        this.isConfirmationModalOpen = false;
        this.extraCarSelect.isSelected = false;
      },
    },
  };
</script>
<style lang="scss">
  .create-reservatiion {
    .step1-overlay {
      margin: -15px;
    }

    .pickup-date {
      position: relative;

      .v-icon.mdi-alert {
        position: absolute;
        top: 40px;
        right: 30px;
      }
    }

    .v-carousel__controls {
      display: none !important;
    }

    .multiple-car {
      .v-label,
      .v-icon {
        color: white !important;
      }
    }

    .car-selection {
      .v-text-field__details {
        display: none !important;
      }
    }

    .car-select {
      .v-btn {
        position: absolute;
        right: 12px;
        top: 15px;
      }
    }

    .zoid-component-frame,
    .zoid-visible {
      z-index: 2 !important;
    }
  }

  .confirmation-step {
    .key-value {
      padding: 5px;
      background-color: #f6f6f6;
      border-bottom: 1px solid #ccc;
      padding: 10px 15px;
    }
  }

  .v-stepper-header {
    flex-wrap: wrap;
    overflow-x: hidden;

    .v-divider {
      flex: auto;
    }
  }

  @media (min-width: 956px) and (max-width: 1903px) {
    .stepper-container {
      padding-top: 65px !important;
    }
  }

  @media only screen and (max-width: 768px) {
    .v-stepper__content {
      margin: auto !important;
      padding: 0px 10px !important;
    }
  }

  .container-disabled {
    pointer-events: none;
  }
</style>

<template>
  <v-row>
    <v-col
      cols="12"
      class="px-0"
    >
      <h2>Customize Your Reservation</h2>
      <span class="text-subtitle-2 text-grey-darken-2">
        You're almost there! Just a few more details to finalize your
        reservation.
      </span>
    </v-col>
    <v-col cols="12">
      <v-form ref="stepper4Form">
        <v-row class="border-md rounded-lg pb-4 px-2">
          <v-col
            v-for="(config, index) in componentsConfig"
            :key="index"
            :cols="config.cols"
            class="pb-1"
          >
            <component
              v-model="stepPayload[config.props.vModel]"
              :is="config.component"
              v-bind="config.props"
              v-on="config.eventListeners || {}"
            >
              <template
                v-for="slot in config.slots"
                v-slot:[slot.name]="slotProps"
              >
                <div
                  v-if="typeof slot.content === 'string'"
                  v-html="slot.content"
                />
                <template v-else-if="typeof slot.content === 'function'">
                  <template v-for="slotContent in slot.content(possibilities)">
                    <component
                      :is="slotContent.tag"
                      v-bind="slotContent.attrs"
                    />
                  </template>
                </template>
              </template>
            </component>
          </v-col>
        </v-row>
      </v-form>
    </v-col>
  </v-row>
</template>

<script setup>
import { SharedAmountValue } from '#components';
import { VCheckbox, VRadio, VRadioGroup } from 'vuetify/components';
import { renderToString } from 'vue/server-renderer';
import { useDisplay } from 'vuetify';

const vuetifyDisplay = useDisplay();
const props = defineProps({
  reservationPayload: {
    type: Object,
    default: {},
  },
});

const componentTypes = {
  checkbox: VCheckbox,
  'radio-btn': VRadioGroup,
  dropdown: resolveComponent('SharedCustomSelect'),
  'text-field': resolveComponent('SharedCustomField'),
  number: resolveComponent('SharedCustomField'),
  'discount-code': resolveComponent(
    'ReservationCreateApplyDiscountCode'
  ),
};
const possibilities = ref([
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
]);
const stepper4Form = ref(null);
const meetAndGreetValue = ref('');

const stepPayload = computed(() => props.reservationPayload.step4);
// const stepPayload = ref({});

const componentsConfig = computed(() => {
  return [
    {
      cols: 12,
      props: {
        vModel: 'isMeetAndGreet',
        id: 'meet-and-greet',
        label: 'Meet And Greet',
        class: 'meet-and-greet',
        color: 'primary',
        hideDetails: true,
      },
      slots: [
        {
          name: 'label',
          content: `<strong>Meet And Greet Charges (${meetAndGreetValue.value})</strong>`,
        },
      ],
      component: componentTypes['checkbox'],
    },
    {
      cols: 12,
      props: {
        vModel: 'checkingInBags',
        id: 'checkingInBags',
        label: 'Checking In Bag(s) ?',
        color: 'primary',
        class: vuetifyDisplay.smAndUp.value ? 'checking-in-bags' : '',
        inline: true,
        hideDetails: 'auto',
        required: true,
        errorMessages: stepPayload.value.checkingInBags
          ? ''
          : 'Checking-in Bag(s) is required',
        error: !stepPayload.value.checkingInBags,
      },
      slots: [
        {
          name: 'label',
          content: `<strong
              class="
                ${!stepPayload.value.checkingInBags
              ? 'text-error'
              : ''
            }
              "
            >
              Checking-in Bag(s) ?
              <span class="text-red">*</span>
            </strong>`,
        },
        {
          name: 'default',
          content: (possibilities) =>
            possibilities.map((possibility) => ({
              tag: VRadio,
              attrs: {
                color: 'primary',
                label: possibility.label,
                value: possibility.value,
              },
            })),
        },
      ],
      component: componentTypes['radio-btn'],
    },
    {
      cols: 12,
      props: {
        id: 'gratuity-select',
        vModel: 'gratuity',
        class: 'gratuity-select',
        required: true,
        items: [
          { title: "No thanks / i'll take care of Driver", value: 1 },
          { title: '15%', value: 15 },
          { title: '20%', value: 20 },
          { title: '25%', value: 25 },
          { title: '30%', value: 30 },
          { title: 'Custom', value: 'custom' },
        ],
        label: 'Gratuity',
        placeholder: 'Please select from the list',
        ariaRequired: 'true',
      },
      eventListeners: {
        'update:modelValue': () => {
          // $emit('onGratuityChange', { gratuity })
        },
        click: () => (stepPayload.value.customGratuity = 0),
      },
      component: componentTypes['dropdown'],
    },
    {
      cols: 12,
      preCondition: () => stepPayload.value.gratuity === 'custom',
      props: {
        vModel: 'customGratuity',
        id: 'Gratuity',
        label: 'Gratuity',
        required: true,
        // prefix: '$',
        type: 'number',
      },
      eventListeners: {
        keyup: () => {
          // $emit('onCustomChange', {
          //   gratuity: stepPayload.value.gratuity,
          //   customGratuity: stepPayload.value.customGratuity,
          // });
        },
      },
      component: componentTypes['number'],
    },
    {
      cols: 12,
      props: {
        vModel: 'discountCode',
        discounts: [],
        discountConfig: {},
        loading: false,
      },
      eventListeners: {
        clear: () => (stepPayload.value.discountCode = null),
      },
      component: componentTypes['discount-code'],
    },
    {
      cols: 12,
      props: {
        vModel: 'childSeats',
        id: 'childSeats',
        label: 'Child Seats',
        type: 'number',
      },
      component: componentTypes['number'],
    },
  ].filter((config) => !config.preCondition || config.preCondition());
});

const validateStep = async () => {
  const { valid } = await stepper4Form.value.validate();
  return valid;
};

onMounted(() => {
  renderToString(h(SharedAmountValue, { amount: 20 })).then(
    (value) => (meetAndGreetValue.value = value)
  );
});

defineExpose({
  validateStep,
});
</script>

<style lang="scss">
.checking-in-bags {
  .v-input__control {
    flex-direction: row;
    align-items: center;

    .v-label {
      margin-left: 0 !important;
    }

    .v-selection-control-group {
      margin-top: 0 !important;
    }
  }
}

//.meet-and-greet {
//  .v-selection-control {
//    flex-direction: row-reverse;
//    justify-content: start;
//    gap: 8px;
//  }
</style>

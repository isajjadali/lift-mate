<template>
  <v-data-table
    :id="id"
    v-bind="$attrs"
    ref="customDataTable"
    mobile-breakpoint="100"
    :headers="[
      ...computedHeaders,
      {
        title: '',
        value: 'settings',
        sortable: false,
        minWidth: '20px',
      },
    ]"
  >
    <!-- <template v-if="dataTableSetting" #header.settings="props">
      <shared-data-table-setting
        v-model="selectedHeaders"
        :headers="headersWithoutActions"
        :title="title"
      />
    </template> -->

    <template #item.settings="{ item }">
      <v-icon>mdi-settings</v-icon>
    </template>

    <template #item.$$default="{ item, column }">
      {{ getValue({ item, column }) }}
    </template>

    <template #item.$$percentage="{ item, column }">
      {{ getValue({ item, column, append: "%" }) }}
    </template>

    <template #item.$$boolean="{ item, column }">
      {{
        typeof column.getValue === "function"
          ? column.getValue({ item, column })
            ? "Yes"
            : "No"
          : "N/A"
      }}
    </template>

    <template #item.$$amount="{ item, column }">
      <shared-amount-value :amount="getValue({ item, column, defaultValue: 0 })" />
    </template>

    <template #item.$$toggle="{ item, column }">
      <div class="is-active">
        <v-switch
          v-model="item[column.valueFrom]"
          color="primary"
          inset
          hide-details
          @update:modelValue="(e) => $emit('on-toggle', e, item)"
        />
      </div>
    </template>
    <template #item.$$redirectedTo="{ item, column }">
      <a
        v-if="column.getPath(item).path"
        class="text-primary cursor-pointer"
        @click="redirectedToPath(column.getPath(item))"
      >
        {{ getValue({ item, column }) }}
      </a>
      <span v-else-if="column.getPath(item).value"> 
        {{ getValue({ item, column }) }} 
      </span>
      <span v-else> N/A </span>
    </template>
    <!-- <template #item.isRoundTrip="{ item }">
        {{ item.childOf ? "Yes" : "No" }}
      </template> -->

    <template #item.$$chip="{ item, column }">
      <v-chip variant="flat" :color="getStatusColor(item[column.valueFrom])">
        {{ getValue({ item, column, operations: ["titleCase"] }) }}
      </v-chip>
    </template>

    <template #item.$$date="{ item, column }">
      {{
        getValue(
          { item, column, operations: ["formatDate"] },
          column.isDateOnly
        )
      }}
    </template>

    <template #item.$$convertCase="{ item, column }">
      <v-tooltip
        v-if="column.isTooltip"
        top
        color="black"
      >
        <template #activator="{ props }">
          <div
            v-bind="props"
            class="truncate"
          >
            {{ getValueForToolTip({ item, column }) }}
          </div>
        </template>
        <p>
          {{ getValueForToolTip({ item, column }) }}
        </p>
      </v-tooltip>
      <span v-else>
        {{ getValueForToolTip({ item, column }) }}
      </span>
    </template>
    <template #item.$$actions="{ item, column }">
      <shared-custom-image-btn
        :id="`action-btn-${item.id}`"
        :ref="`imageButton_${item.id}`"
        :key="`${item.id}_image-btn`"
        hidden
        :item="item"
        :show-btn="column.showUploadField"
        @onUpload="$emit('on-upload-image')"
      />
      <v-menu
        transition="slide-y-transition"
        location="bottom"
      >
        <template #activator="{ props }">
          <v-btn
            class="pa-0 ma-0"
            variant="text"
            v-bind="props"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list v-if="item.$$actions.length">
          <template v-for="(action, i) in item.$$actions" :key="i">
            <v-list-item
              :id="`action-btn-${i}`"
              block
              dense
              class="ma-0"
              :color="action.color"
              @click="
                action.name === ActionDefaults.viewImage.name
                  ? openImageComponent(item)
                  : $emit('action-performed', { item, action, column })
              "
            >
              <span class="px-2">
                <v-icon
                  v-if="action.icon"
                  left
                >
                  {{ action.icon }}
                </v-icon>
                {{ titleCase(action.title || action.name) }}
              </span>
            </v-list-item>
          </template>
        </v-list>
        <v-list
          v-else
        >
          <v-list-item>
            No Action Available
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    <!-- <template
      v-for="(index, name) in $scopedSlots"
      #[name]="data"
    >
      <slot
        :name="name"
        v-bind="data"
      />
    </template> -->
  </v-data-table>
</template>
<script>
import _ from 'lodash';
import CommonMixin from '@/mixins/CommonMixin';
import { ActionDefaults } from '@/enums';

export default {
    mixins: [CommonMixin],
    props: {
        id: {
            type: String,
            required: true,
        },
        dataTableSetting: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: 'Record',
        },
        actions: {
            type: Array,
            default: () => [],
        },
    },
    data: () => ({
        selectedHeaders: [],
        ActionDefaults,
    }),
    computed: {
        computedHeaders() {
            const headers = this.selectedHeaders.length
                ? this.$attrs.headers.filter(
                    (x) => x.text === 'Actions' || this.selectedHeaders.includes(x.text)
                )
                : this.$attrs.headers;
            return headers || [];
        },
        headersWithoutActions() {
            return this.$attrs.headers.filter((h) => h.text !== 'Actions');
        },
    },

    methods: {
        formatString(value, convertFuncName) {
            return _[convertFuncName](value);
        },
        openImageComponent(item) {
            this.$refs[`imageButton_${item.id}`].$refs.imageBtn.$el.click();
        },
        redirectedToPath(item) {
            if (item.newTab) {
                // return this.$$window.open(item.path);
            }
            return this.$router.push(item.path);
        },
        getValue(
            {
                item = {},
                column = {},
                append = '',
                preAppend = '',
                operations = [],
                defaultValue = 'N/A',
            } = {},
            ...args
        ) {
            let value = this.getNestedValueFromObject(item, column.valueFrom);

            if (operations.length) {
                value = operations.reduce((acc, operation) => {
                    if (this[operation]) {
                        acc = this[operation](acc, ...args);
                    } else if (_[operation]) {
                        acc = _[operation](acc, ...args);
                    }
                    return acc;
                }, value);
            }

            return value ? `${preAppend}${value}${append}` : defaultValue;
        },
        getValueForToolTip(obj = {}) {
            const value = this.getValue(obj);
            return obj?.header?.valueFrom
                ? this.formatString(value, obj?.header?.convertInto)
                : value;
        },
    },
};
</script>

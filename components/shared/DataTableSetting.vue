<template>
  <v-menu
    v-model="isMenuOpen"
    bottom
    :close-on-content-click="false"
    left
  >
    <template #activator="{ props }">
      <v-btn
        icon
        v-bind="props"
      >
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-list
        nav
        dense
      >
      <v-list-group
          multiple
      >
        <template v-slot:activator="{ active }">
          <v-checkbox :input-value="item.isActive" />
        </template>
        <v-list-item
          v-for="(item, i) in headers"
          :key="i"
          :title="item.text"
          scrollable
          @click="item.isActive = !item.isActive"
        ></v-list-item>
      </v-list-group>

      </v-list>
      <v-card-actions>
        <v-spacer />
        <shared-custom-btn
          id="on-save"
          color="primary"
          @click="onSave"
        >
          Save
        </shared-custom-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>
<script>
export default {
    name: 'DataTableSetting',
    props: {
        headers: {
            type: Array,
            default: () => [],
        },
        value: {
            type: Array,
            default: () => [],
        },
        title: {
            type: String,
            default: 'Record',
        },
    },
    data: () => ({
        isMenuOpen: false,
        item: [],
        selectedHeaders: [],
    }),
    computed: {
        inputVal: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            },
        },
        localStorageKey() {
            return `Headers-For-${this.title}`;
        },
    },
    watch: {
        isMenuOpen(newValue) {
            if (newValue) {
                this.headers.forEach((h) => (h.isActive = this.value.includes(h.text)));
            }
        },
        title() {
            this.setCurrentStepDataFromLocalStorage();
        },
    },
    created() {
        this.setCurrentStepDataFromLocalStorage();
    },
    methods: {
        getSelectedheaders() {
            return this.headers.filter((h) => h.isActive).map((h) => h.text);
        },
        onSave() {
            this.inputVal = this.getSelectedheaders();
            this.isMenuOpen = false;
            this.setSelectedHeaders();
        },
        setSelectedHeaders() {
          this.$localStorage.setItem(
                this.localStorageKey,
                this.getSelectedheaders().join(',')
            );
        },
        setCurrentStepDataFromLocalStorage() {
            let localStorageHeaders = this.$localStorage.getItem(this.localStorageKey);
            localStorageHeaders = (localStorageHeaders || '')
                .split(',')
                .filter((i) => i);

            this.inputVal = localStorageHeaders.length
                ? this.headers
                    .filter((h) => localStorageHeaders.includes(h.text))
                    .map((h) => h.text)
                : this.headers.map((h) => h.text);
        },
    },
};
</script>

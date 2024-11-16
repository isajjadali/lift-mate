<template>
  <div>
    <div
      v-for="(detail, index) of filteredConfig"
      :key="index"
      class="key-value"
      :class="isDarkMode ? 'dark-key-value' : ''"
    >
      <component
        :is="detail.container || 'div'"
        v-bind="detail.containerProps"
        class="dynamic-component"
      >
        <span>
          <component :is="titleStrong ? 'strong' : 'span'">
            {{ detail.title }}:
          </component>
        </span>
        <span
          v-if="detail.redirectTo"
          class="text-primary cursor-pointer"
        >
          <a @click="redirectToPage(detail.redirectTo)">
            {{ ` ${detail.value}` }}
          </a>
        </span>
        <div v-else-if="detail.type === 'amount'">
          <shared-amount-value :amount="detail.value" />
        </div>
        <span
          v-else
          class="pl-2"
          v-dompurify-html="detail.value || 'N/A'"
        />
      </component>
      <!-- <div
        v-else
        class="hidden-sm-and-up"
      >
        <div>
          <strong>{{ detail.title }}:</strong>
        </div>
        <div v-if="detail.redirectTo">
          <a
            class="text-primary cursor-pointer"
            @click="redirectToPage(detail.redirectTo)"
          >
            {{ detail.value }}
          </a>
        </div>
        <div v-else-if="detail.type === 'amount'">
          <shared-amount-value :amount="detail.value" />
        </div>
        <div
          v-else
          v-dompurify-html="detail.value || 'N/A'"
        />
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomKeyValuePair',
  props: {
    config: {
      type: Array,
      required: true,
    },
    titleStrong: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    filteredConfig() {
      return this.config.filter((item) => !item.hide && item.value);
    },
  },
  methods: {
    redirectToPage(redirectTo) {
      if (redirectTo.newTab) {
        // return this.$$window.open(redirectTo.path);
      }
      this.$router.push({ path: redirectTo.path });
    },
  },
};
</script>
<style lang="scss">
.dark-key-value {
  background-color: #303030 !important;
}
</style>

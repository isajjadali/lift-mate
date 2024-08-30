<template>
  <div>
    <div
      v-if="showLabel"
      class="mb-2"
    >
      <span>
        <strong> {{ label }} </strong>
        <span
          v-if="required && label"
          style="color: red"
        >*</span>
      </span>
    </div>
    <v-text-field
      v-if="type === 'phoneNumber'"
      v-mask="['(###)-###-####']"   
      prepend-inner-icon="mdi-cellphone"
      v-bind="customDefinedProps"
    />
    <v-text-field
      v-else-if="type === 'password'"
      v-bind="customDefinedProps"
      prepend-inner-icon="mdi-lock"
      :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :type="showPassword ? 'text' : 'password'"
      :counter="passwordMinLength"
      @click:appendInner="showPassword = !showPassword"
    />
    <v-text-field
      v-else-if="type === 'number'"
      v-bind="customDefinedProps"
      @keypress="allowOnlyNumber"
    />
    <v-textarea
      v-else-if="type === 'textarea'"
      v-bind="customDefinedProps"
      :counter="true"
    />
    <v-text-field
      v-else
      v-bind="customDefinedProps"
    />
  </div>
</template>
<script>
import { Rules, CharachtersLength } from '@/enums';
import { mask } from 'vue-the-mask';
import _ from 'lodash';

export default {
    name: 'CustomField',
    directives: {
        mask,
    },
    props: {
        id: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            default: '',
        },
        requiredError: {
            type: String,
            default: '',
        },
        required: {
            type: Boolean,
            default: false,
        },
        showLabel: {
            type: Boolean,
            default: true,
        },
        rules: {
            type: Array,
            default: () => [],
        },
        type: {
            type: String,
            default: 'text',
        },
    },
    data() {
        return {
            showPassword: false,
            passwordMinLength: CharachtersLength.password,
        };
    },
    computed: {
        defaultProps() {
            return {
                id: this.id,
                density: 'compact',
                variant: 'outlined',
                flat: true,
                class: 'custom-field',
                rules: this.allRules,
                placeholder: `Enter ${this.label || 'field'}`,
                name: (this.label || 'Name Not Added').toUpperCase(),
            };
        },
        customDefinedProps() {
            let computedProps = _.merge(this.defaultProps, this.$attrs);
            switch (this.type) {
            case 'email':
                computedProps['prepend-inner-icon'] = 'mdi-email';
                break;
            }
            return computedProps;
        },
        allRules() {
            let computedRules = [...this.rules];

            if (this.required) {
                computedRules = [
                    (val) => !!val || this.requiredError || `${this.label || 'Field'} is required`,
                    ...computedRules,
                ];
            }

            switch (this.type) {
            case 'email':
                computedRules.push((v) => /.+@.+/.test(v) || Rules.emailValid);
                break;
            case 'password':
                computedRules.push(
                    (v) =>
                        (v || '').length >= this.passwordMinLength ||
              Rules.passwordCharacter
                );
                break;
            case 'phoneNumber':
                computedRules.push(
                    (v) => {
                        if (!v?.length) return true;
                        return v.length === CharachtersLength.phoneNumber || Rules.validPhoneNumber;
                    }
                );
                break;
            }
            return computedRules;
        },
    },
    methods: {
        allowOnlyNumber($event) {
            let keyCode = $event.keyCode ? $event.keyCode : $event.which;
            if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
                // 46 is dot
                $event.preventDefault();
            }
        },
    },
};
</script>
<style lang="scss">
.v-text-field .v-field {
  border-radius: 8px;
}
</style>

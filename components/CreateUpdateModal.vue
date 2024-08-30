<template>
  <v-dialog
    v-model="toggleDialog"
    max-width="800"
    persistent
    scrollable
  >
    <v-card>
      <v-toolbar
        color="primary"
        dark
      >
        <v-toolbar-title class="text-center">
          {{ isEditMode ? `Edit ${title}` : `Create ${title}` }}
        </v-toolbar-title>
        <template v-slot:append>
          <v-btn icon @click="onClose">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-toolbar>
      <v-card-text class="pa-0">
        <v-container class="pa-7">
          <generic-form
            :fields-config="fieldsConfig"
            :data="data"
            :loading="loading"
            :btn-labels="btnLabels"
            @onCancel="$emit('close')"
            @onSubmit="(payload) => $emit('onSubmit', payload)"
          />
          <p
            class="text-error text-center mt-2"
          >
            <strong>{{ error }}</strong>
          </p>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import GenericForm from '@/shared/forms/GenericForm.vue';
import _ from 'lodash'

export default {
    name: 'CreateUpdateModal',
    components: {
        GenericForm,
    },
    props: {
        open: {
            type: Boolean,
            default: false,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: 'Record',
        },
        fieldsConfig: {
            type: Array,
            default: () => [],
        },
        data: {
            type: Object,
            default: () => {},
        },
        error: {
            type: String,
            default: null,
        },
    },
    data() {
        return {
            isEditMode: false,
            currentStep: 1,
            roles: [],
            steps: [{ title: 'create user' }, { title: 'assign role' }],
        };
    },
    computed: {
        btnLabels() {
            return {
                cancel: 'Cancel',
                submit: this.isEditMode ? 'Update' : 'Create',
            };
        },
        showNextBtn() {
            return this.currentStep < this.steps.length;
        },
        isNextBtnDisabled() {
            return this.currentStep >= this.steps.length;
        },
        toggleDialog: {
          get() {
            return this.open;
          },
          set(value) {
            this.$emit('update:modelValue', value)
          },
        },
    },
    watch: {
        open(newValue) {
            if (newValue) {
                this.isEditMode = !_.isEmpty(this.data);
            }
        },
    },
    methods: {
        onBack() {
            this.currentStep -= 1;
        },
        onNext() {
            if (this.$refs.genericForm.validate()) {
                this.currentStep += 1;
            }
        },
        onClose() {
            this.currentStep = 1;
            this.$emit('close');
        },
        async getRoles() {
            const reponse = await this.$axios.get('/roles');
            this.roles = reponse.dataItems;
        },
    },
};
</script>

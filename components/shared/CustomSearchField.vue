<template>
  <shared-custom-autocomplete
    id="value"
    v-model="inputVal"
    :items="results"
    :item-title="itemText"
    return-object
    v-bind="$attrs"
    @update:modelValue="(payload) => $emit('select', payload)"
  />
</template>
  
<script>
import UserService from '@/services/user.js';

export default {
    name: 'UserSearchField',
    props: {
        modelValue: {
            type: Object,
            default: () => { },
        },
        searchOn: {
            type: String,
            default: 'user',
        },
        itemText: {
            type: String,
            default: 'email',
        }
    },
    data() {
        return {
            results: [],
        };
    },
    computed: {
        inputVal: {
            get() {
                return this.modelValue;
            },
            set(val) {
                this.$emit('update:modelValue', val);
            },
        },
    },
    created(){
        this.fetchUsers();
    },
    methods: {
        async fetchUsers() {
            let method = 'getUsers';

            switch (this.searchOn) {
            case 'getAffiliates':
                method = 'getAffiliates';
            }

            const response = await UserService[method]();
            this.results = response.dataItems || [];
        },
    },
};
</script>
  
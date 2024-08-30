import _ from 'lodash';
import pluralize from 'pluralize';
import Service from '@/services/index';

export default {
  data() {
    return {
      service: {},
    };
  },
  computed: {
    messageKey() {
      const field = this.headers.find(h => h.shouldDisplayedInMessage) || {};
      return (this.selectedItem || {})[field.value] || 'Record';
    },
    fieldsConfig() {
      return this.headers.filter(h => h.fieldConfig).map(h => h.fieldConfig);
    },
    singularTitle() {
      return pluralize.singular(this.title) || '';
    },
  },
  methods: {
    createServiceInstance() {
      this.service = new Service(`${this.url}`);
    },
    getAcuratePayload(payload) {
      const newPayload = _.cloneDeep(payload);
      Object.keys(newPayload).forEach(key => {
        if (
          !['boolean'].includes(typeof newPayload[key]) &&
          !isNaN(+newPayload[key]) &&
          typeof +newPayload[key] === 'number'
        ) {
          if (newPayload[key] !== '') {
            newPayload[key] = +newPayload[key];
          }
        }
      });
      return newPayload;
    },
  },
};

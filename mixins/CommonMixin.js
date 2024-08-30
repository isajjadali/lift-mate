import moment from 'moment';
import { RESERVATION_STATUSES } from '@/enums';
import { formatDate } from '@/common';

export default {
    methods: {
        titleCase(status = '') {
            status = status.toLowerCase().split(' ');
            for (var i = 0; i < status.length; i++) {
                status[i] = status[i].charAt(0).toUpperCase() + status[i].slice(1);
            }
            return status.join(' ');
        },
        getStatusColor(status) {
            return {
                [RESERVATION_STATUSES.completed]: 'primary',
                [RESERVATION_STATUSES.cancelled]: 'secondary',
                [RESERVATION_STATUSES.created]: 'error',
                [RESERVATION_STATUSES.assigned]: 'success',
                [RESERVATION_STATUSES.draft]: 'warning',
                [RESERVATION_STATUSES.viewed]: 'info',
                [RESERVATION_STATUSES.unpaid]: 'accent',
            }[status];
        },
        getNumericValue(value) {
            const parsedValue = +value;
            return isNaN(parsedValue) ? 0 : parsedValue;
        },
        formatDate,
        ordinalSuffixOf(i) {
            var j = i % 10,
                k = i % 100;
            if (j == 1 && k != 11) {
                return i + 'st';
            }
            if (j == 2 && k != 12) {
                return i + 'nd';
            }
            if (j == 3 && k != 13) {
                return i + 'rd';
            }
            return i + 'th';
        },
        getNestedValueFromObject(object, string = '') {
            string = string
                .replace(/\[(\w+)\]/g, '.$1')
                .replace(/^\./, '')
                .split('.');
            for (let i = 0; i < string.length; ++i) {
                let subString = string[i];
                if (subString in object) {
                    object = object[subString];
                    if (!object) return;
                } else {
                    return;
                }
            }
            return object;
        },
    },
};

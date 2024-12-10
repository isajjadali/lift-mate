import {
    Header,
    CreatedAtHeader,
    ActionHeader,
    ActionDefaults,
    FirstNameHeader,
    LastNameHeader,
    EmailHeader,
} from './default';
import { MDI_ICONS } from '../mdi-icons';
import { ROLES } from '@/enums/roles';
import {
    EmailFieldConfig,
    FirstNameFieldConfig,
    LastNameFieldConfig,
} from './default-field-configs';
import { PERMISSIONS } from '../permissions';
import { hasPermission } from '~/mixins/main-mixin';

function getUserHeaders(isDriverSpecific) {
    const UserHeaders = [
        {
            ...FirstNameHeader,
            value: '$$redirectedTo',
            // value: hasPermission(PERMISSIONS.usersEdit) ? '$$redirectedTo' : '$$default',
            getPath: (item) => {
                let obj = {
                    path: '',
                    newTab: false,
                };

                if (!item.id) return obj;

                if (!hasPermission(PERMISSIONS.usersEdit)) {
                    return { value: item };
                }

                obj = {
                    path: `/users/${item.id}/profile-info`,
                    newTab: false,
                };
                return obj;
            },

            shouldDisplayedInMessage: true,
            fieldConfig: FirstNameFieldConfig,
        },
        {
            ...LastNameHeader,
            shouldDisplayedInMessage: true,
            fieldConfig: LastNameFieldConfig,
        },
        {
            ...EmailHeader,
            fieldConfig: EmailFieldConfig,
        },
        {
            ...Header,
            title: 'Social Security Number',
            valueFrom: 'socialSecurityNumber',
            isDriverSpecific: true,
            fieldConfig: {
                id: 'socialSecurityNumber',
                type: 'socialSecurityNumber',
                label: 'Social Security Number',
                vModel: 'socialSecurityNumber',
                sm: 6,
                cols: 12,
                'prepend-inner-icon': MDI_ICONS.socialSecurityNumber,
            },
        },
        {
            ...Header,
            title: 'Phone No',
            valueFrom: 'phoneNumber',
            fieldConfig: {
                id: 'phoneNumber',
                type: 'phoneNumber',
                label: 'Phone No',
                vModel: 'phoneNumber',
                required: true,
                sm: 6,
                cols: 12,
            },
        },
        {
            ...Header,
            title: 'Phone No Type',
            valueFrom: 'phoneType',
            isDriverSpecific: true,
            fieldConfig: {
                id: 'phoneType',
                type: 'select',
                label: 'Phone No Type',
                placeholder: 'Select Type',
                vModel: 'phoneType',
                required: true,
                items: [
                    { label: '@txt.att.net', value: '@txt.att.net' },
                    { label: '@tmomail.net', value: '@tmomail.net' },
                    { label: '@vtext.com', value: '@vtext.com' },
                    { label: '@smtext.com', value: '@smtext.com' },
                ],
                'item-title': 'label',
                'item-value': 'value',
                sm: 6,
                cols: 12,
            },
        },
        {
            ...Header,
            title: 'Date of Birth',
            valueFrom: 'dob',
            fieldConfig: {
                id: 'dob',
                type: 'datePicker',
                label: 'Date of Birth',
                vModel: 'dob',
                sm: 6,
                cols: 12,
            },
        },
        {
            ...Header,
            title: 'Address',
            valueFrom: 'address',
            fieldConfig: {
                id: 'address',
                type: 'googlePlaceDropDown',
                label: 'Address',
                placeholder: 'Type to select address',
                vModel: 'address',
                cols: 12,
                'prepend-inner-icon': MDI_ICONS.address,
            },
        },
        CreatedAtHeader,
        ActionHeader,
    ];
    return isDriverSpecific
        ? UserHeaders
        : UserHeaders.filter((header) => !header.isDriverSpecific);
}

function getActions(userType) {
    const Actions = [
        {
            ...ActionDefaults.create,
            permission: PERMISSIONS[`${userType}Create`],
        },
        {
            ...ActionDefaults.edit,
            redirectTo: (item) => `/users/${item.id}/profile-info`,
            permission: PERMISSIONS[`${userType}Edit`],
        },
        {
            ...ActionDefaults.delete,
            permission: PERMISSIONS[`${userType}Delete`],
        },
    ];
    return Actions;
}

export const CustomerMeta = {
    title: 'Customers',
    backendPath: '/users',
    imgUrl:'/customers.svg',
    description:'Users can search, add, update, or delete customer records and view detailed customer listings. It enables efficient management of customer information.',
    headers: getUserHeaders(false),
    queryParams: { role: ROLES.customer },
    actions: getActions('customers'),
    showSelect: false,
};

export const DriverMeta = {
    title: 'Drivers',
    backendPath: '/users',
    imgUrl:'/drivers.svg',
    description:'Users can search, create, edit, or remove driver profiles and see a full listing of drivers. It streamlines driver data management and updates.',
    headers: getUserHeaders(true),
    queryParams: { role: ROLES.driver },
    actions: getActions('drivers'),
    showSelect: false,
    callbacks: {
        create: ($store) => $store.fetchDrivers(),
        update: ($store) => $store.fetchDrivers(),
        delete: ($store) => $store.fetchDrivers(),
    },
};
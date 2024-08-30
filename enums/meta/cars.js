import {
    Header,
    CreatedAtHeader,
    ActionHeader,
    Actions,
    ActionDefaults,
    IsActiveHeader,
    NameHeader,
    AmountHeader,
} from './default';
import { MDI_ICONS } from '../mdi-icons';
import { NameFieldConfig } from './default-field-configs';
import { PERMISSIONS } from '../permissions';

export const CarHeaders = [
    {
        ...NameHeader,
        shouldDisplayedInMessage: true,
        fieldConfig: {
            ...NameFieldConfig,
            'prepend-inner-icon': MDI_ICONS.car,
        },
    },
    {
        ...Header,
        title: 'To Add',
        valueFrom: 'toAdd',
        fieldConfig: {
            id: 'to-add-field',
            type: 'number',
            label: 'To Add',
            vModel: 'toAdd',
            required: true,
            sm: 6,
            cols: 12,
            'prepend-inner-icon': MDI_ICONS.toAdd,
        },
    },
    {
        ...Header,
        title: 'To Multiply',
        valueFrom: 'toMultiply',
        fieldConfig: {
            id: 'to-multiple-field',
            type: 'number',
            label: 'To Multiply',
            vModel: 'toMultiply',
            required: true,
            sm: 6,
            cols: 12,
            'prepend-inner-icon': MDI_ICONS.toMultiply,
        },
    },
    {
        ...AmountHeader,
        title: 'Minimum Rate',
        valueFrom: 'minimumRate',
        fieldConfig: {
            id: 'minimum-rate-field',
            type: 'number',
            label: 'Minimum Rate',
            vModel: 'minimumRate',
            required: true,
            sm: 6,
            cols: 12,
            'prepend-inner-icon': MDI_ICONS.dollar,
        },
    },
    {
        ...Header,
        title: 'Number of Cars',
        valueFrom: 'quantity',
        fieldConfig: {
            id: 'quantity-field',
            type: 'number',
            label: 'Number Of Cars',
            vModel: 'quantity',
            required: true,
            sm: 6,
            cols: 12,
            'prepend-inner-icon': MDI_ICONS.car,
        },
    },
    {
        ...Header,
        title: 'Number of bags',
        valueFrom: 'maxBags',
        fieldConfig: {
            id: 'bags-field',
            type: 'number',
            label: 'Max No Of Bags',
            vModel: 'maxBags',
            required: true,
            sm: 6,
            cols: 12,
            'prepend-inner-icon': MDI_ICONS.bag,
        },
    },
    {
        ...Header,
        title: 'Number of passengers',
        valueFrom: 'maxPassenger',
        fieldConfig: {
            id: 'passenger-field',
            type: 'number',
            label: 'Max No Of Passengers',
            vModel: 'maxPassenger',
            required: true,
            sm: 6,
            cols: 12,
            'prepend-inner-icon': MDI_ICONS.man,
        },
    },
    IsActiveHeader,
    CreatedAtHeader,
    ActionHeader,
];

export const CarMeta = {
    title: 'Cars',
    headers: CarHeaders,
    showSelect: false,
    actions: [
        {
            ...Actions[0],
            permission: PERMISSIONS.carsCreate,
        },
        {
            ...Actions[1],
            permission: PERMISSIONS.carsEdit,
        },
        {
            ...Actions[2],
            permission: PERMISSIONS.carsDelete,
        },
        {
            ...ActionDefaults.viewImage,
            permission: PERMISSIONS.carsViewImage,
        },
    ],
    callbacks: {
        create: ($store) => $store.fetchCars(),
        update: ($store) => $store.fetchCars(),
        delete: ($store) => $store.fetchCars(),
    },
};

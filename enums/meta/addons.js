import {
    Header,
    CreatedAtHeader,
    ActionHeader,
    IsActiveHeader,
    StatusFilters,
    Actions,
    PercentageHeader,
    AmountHeader,
    NameHeader,
} from './default';
import {
    PercentageFieldConfig,
    AmountFieldConfig,
    NameFieldConfig,
} from './default-field-configs.js';
import { PERMISSIONS } from '../permissions';

export const AddonHeaders = [
    {
        ...NameHeader,
        shouldDisplayedInMessage: true,
        fieldConfig: {
            ...NameFieldConfig,
            sm: 6,
            cols: 12,
        },
    },
    {
        ...PercentageHeader,
        fieldConfig: PercentageFieldConfig,
    },
    {
        ...AmountHeader,
        fieldConfig: AmountFieldConfig,
    },
    IsActiveHeader,
    CreatedAtHeader,
    ActionHeader,
];

export const AddonMeta = {
    title: 'Addons',
    filters: () => {
        return StatusFilters;
    },
    headers: AddonHeaders,
    actions: [
        {
            ...Actions[0],
            permission: PERMISSIONS.addonsCreate
        },
        {
            ...Actions[1],
            permission: PERMISSIONS.addonsEdit,
        },
        {
            ...Actions[2],
            permission: PERMISSIONS.addonsDelete,
        },
    ],
    showSelect: false,
    callbacks: {
        create: ($store) => $store.fetchAddons(),
        update: ($store) => $store.fetchAddons(),
        delete: ($store) => $store.fetchAddons(),
    },
};

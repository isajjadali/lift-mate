import {
    CreatedAtHeader,
    ActionHeader,
    Actions,
    NameHeader
} from './default';
import { MDI_ICONS  } from '../mdi-icons';
import { NameFieldConfig } from './default-field-configs';
import { PERMISSIONS } from '../permissions';

export const AffiliateHeaders = [
    {
        ...NameHeader,
        fieldConfig: {
            ...NameFieldConfig,
            'prepend-inner-icon': MDI_ICONS.building,
        },
    },
    CreatedAtHeader,
    ActionHeader,
];

export const AffiliateMeta = {
    title: 'Affiliates',
    headers: AffiliateHeaders,
    actions: [
        {
            ...Actions[0],
            permission: PERMISSIONS.affiliatesCreate
        },
        {
            ...Actions[1],
            permission: PERMISSIONS.affiliatesEdit,
        },
        {
            ...Actions[2],
            permission: PERMISSIONS.affiliatesDelete,
        },
    ],
    showSelect: false,
};

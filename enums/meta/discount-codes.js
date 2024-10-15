import {
    Header,
    CreatedAtHeader,
    ActionHeader,
    IsActiveHeader,
    StatusFilters,
    Actions,
    PercentageHeader,
    FromHeader,
    ToHeader,
    AmountHeader,
} from './default';
import { MDI_ICONS } from '../mdi-icons';
import {
    AmountFieldConfig,
    FromFieldConfig,
    ToFieldConfig,
    PercentageFieldConfig,
} from './default-field-configs';
import { PERMISSIONS } from '../permissions';

export const DiscountCodeHeaders = [
    {
        ...Header,
        title: 'Code',
        valueFrom: 'code',
        shouldDisplayedInMessage: true,
        fieldConfig: {
            id: 'code',
            label: 'Code',
            vModel: 'code',
            required: true,
            sm: 6,
            cols: 12,
            'prepend-inner-icon': MDI_ICONS.zipCode,
        },
    },
    {
        ...Header,
        title: 'Type',
        value: '$$convertCase',
        convertInto: 'startCase',
        valueFrom: 'type',
        fieldConfig: {
            id: 'type',
            type: 'select',
            label: 'Type',
            placeholder: 'Select Type',
            vModel: 'type',
            required: true,
            items: [
                { label: 'General', value: 'general' },
                { label: 'Round Trip', value: 'round trip' },
            ],
            'item-title': 'label',
            'item-value': 'value',
            sm: 6,
            cols: 12,
        },
    },
    {
        ...FromHeader,
        isDateOnly: true,
        fieldConfig: FromFieldConfig,
    },
    {
        ...ToHeader,
        isDateOnly: true,
        fieldConfig: ToFieldConfig,
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

export const DiscountCodeMeta = {
    title: 'Discount Codes',
    backendPath:'discount-codes',
    imgUrl:'/discount.svg',
    description:'Our car rental service offers an Add-ons feature that includes predefined rates for additional stops during a journey.',
    filters: () => {
        return [
            ...StatusFilters,
            {
                id: 'type',
                key: 'type',
                label: 'Types',
                vModel: 'type',
                placeholder: 'Select Types',
                type:'select',
                items: [
                    {
                        label: 'General',
                        value: 'general',
                    },
                    {
                        label: 'Round Trip',
                        value: 'round trip',
                    },
                ],
                'item-title': 'label',
                'item-value': 'value',
            },
            
            {
                type:'dateRangePicker'
            }
        ];
    },
    headers: DiscountCodeHeaders,
    actions: [
        {
            ...Actions[0],
            permission: PERMISSIONS.discountCodesCreate
        },
        {
            ...Actions[1],
            permission: PERMISSIONS.discountCodesEdit,
        },
        {
            ...Actions[2],
            permission: PERMISSIONS.discountCodesDelete,
        },
    ],
    showSelect: false,
};

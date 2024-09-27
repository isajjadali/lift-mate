import {
    Header,
    CreatedAtHeader,
    ActionHeader,
    IsActiveHeader,
    StatusFilters,
    Actions,
    PercentageHeader,
    AmountHeader,
    FromHeader,
    ToHeader,
    NameHeader,
} from './default';
import {
    AmountFieldConfig,
    FromFieldConfig,
    NameFieldConfig,
    PercentageFieldConfig,
    ToFieldConfig,
} from './default-field-configs';
import { PERMISSIONS } from '../permissions';

export const SurgeHeaders = [
    {
        ...NameHeader,
        fieldConfig: NameFieldConfig,
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
        fieldConfig: {
            ...PercentageFieldConfig,
            optionalIf: 'amount',
        },
    },
    {
        ...AmountHeader,
        fieldConfig: {
            ...AmountFieldConfig,
            optionalIf: 'percentage',
        },
    },
    {
        ...Header,
        title: 'Description',
        value: '$$convertCase',
        convertInto: 'startCase',
        valueFrom: 'description',
        isTooltip: true,
        fieldConfig: {
            id: 'description',
            label: 'Description',
            type: 'textarea',
            vModel: 'description',
            required: true,
            cols: 12,
            'no-resize': true,
        },
    },
    IsActiveHeader,
    CreatedAtHeader,
    ActionHeader,
];

export const SurgeMeta = {
    title: 'Surges',
    backendPath:'surges',
    filters: () => {
        return StatusFilters;
    },
    headers: SurgeHeaders,
    actions: [
        {
            ...Actions[0],
            permission: PERMISSIONS.surgesCreate,
        },
        {
            ...Actions[1],
            permission: PERMISSIONS.surgesEdit,
        },
        {
            ...Actions[2],
            permission: PERMISSIONS.surgesDelete,
        },
    ],
    showSelect: false,
};

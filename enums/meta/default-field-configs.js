import { MDI_ICONS } from '../mdi-icons';
import { DefaultFromFunction, DefaultToFunction } from './default';

export const PercentageFieldConfig = {
    id: 'percentage',
    type: 'number',
    label: 'Percentage',
    vModel: 'percentage',
    required: true,
    sm: 6,
    cols: 12,
    'prepend-inner-icon': MDI_ICONS.percent,
    optionalIf: 'amount',
    requiredError: 'Amount or percentage is required',
};

export const AmountFieldConfig = {
    id: 'amount',
    type: 'number',
    label: 'Amount',
    vModel: 'amount',
    required: true,
    sm: 6,
    cols: 12,
    'prepend-inner-icon': MDI_ICONS.dollar,
    optionalIf: 'percentage',
    requiredError: 'Amount or percentage is required',
};

export const NameFieldConfig = {
    id: 'name',
    label: 'Name',
    vModel: 'name',
    required: true,
    sm: 12,
    cols: 12,
};

export const LastNameFieldConfig = {
    id: 'lastName',
    label: 'Last Name',
    vModel: 'lastName',
    sm: 6,
    cols: 12,
    'prepend-inner-icon': MDI_ICONS.username,
};
export const FirstNameFieldConfig = {
    id: 'firstName',
    label: 'First Name',
    vModel: 'firstName',
    required: true,
    sm: 6,
    cols: 12,
    'prepend-inner-icon': MDI_ICONS.username,
};
export const EmailFieldConfig = {
    id: 'email',
    type: 'email',
    label: 'Email',
    vModel: 'email',
    required: true,
    sm: 6,
    cols: 12,
};
export const FromFieldConfig = {
    id: 'from',
    label: 'From',
    type: 'datePicker',
    vModel: 'from',
    required: true,
    sm: 6,
    cols: 12,
    'prepend-inner-icon': MDI_ICONS.calender,
    'allowed-dates': DefaultFromFunction,
};
export const ToFieldConfig = {
    id: 'to',
    label: 'To',
    type: 'datePicker',
    vModel: 'to',
    required: true,
    sm: 6,
    cols: 12,
    'prepend-inner-icon': MDI_ICONS.calender,
    'allowed-dates': DefaultToFunction,
};

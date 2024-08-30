import {
    format,
    addDays,
    subDays,
    addMonths,
    subMonths,
    endOfMonth,
    startOfMonth,
    startOfYear,
    endOfYear,
    addYears,
    subYears,
} from 'date-fns';

export const DEFAULT_RANGE = [
    format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    format(endOfMonth(new Date()), 'yyyy-MM-dd'),
];

export const TAB_NAMES = {
    customRange: 'range',
    year: 'year',
    month: 'month',
};
export const DEFAULT_ACTIVE_TAB = TAB_NAMES.customRange;
export const AVAILABLE_TABS = [
    {
        id: TAB_NAMES.customRange,
        value: TAB_NAMES.customRange,
        label: 'Range',
    },
    {
        id: TAB_NAMES.month,
        value: TAB_NAMES.month,
        label: 'Month',
    },
    {
        id: TAB_NAMES.year,
        value: TAB_NAMES.year,
        label: 'Year',
    },
];

export const RANGE_VALUE_MAP = {
    today: 0,
    tomorrow: -1,
    yesterday: 1,
    sevenDays: 7,
    thirtyOneDays: 31,
    ninetyDays: 90,
    aYear: 365,
    all: 'all',
    customRange: 'custom-range',
};
export const DEFAULT_SELECTED_RANGE_OPTION = RANGE_VALUE_MAP.all;
export const RANGE_LABEL_MAP = {
    [RANGE_VALUE_MAP.today]: 'Today',
    [RANGE_VALUE_MAP.tomorrow]: 'Tomorrow',
    [RANGE_VALUE_MAP.yesterday]: 'Yesterday',
    [RANGE_VALUE_MAP.thirtyOneDays]: 'Last 31 days',
    [RANGE_VALUE_MAP.sevenDays]: 'Last 7 days',
    [RANGE_VALUE_MAP.ninetyDays]: 'Last 90 days',
    [RANGE_VALUE_MAP.aYear]: '12 months',
    [RANGE_VALUE_MAP.all]: 'All',
};
export const RANGE_OPTIONS = [
    {
        id: RANGE_VALUE_MAP.all,
        value: RANGE_VALUE_MAP.all,
        label: RANGE_LABEL_MAP[RANGE_VALUE_MAP.all],
    },
    {
        id: RANGE_VALUE_MAP.tomorrow,
        value: RANGE_VALUE_MAP.tomorrow,
        label: RANGE_LABEL_MAP[RANGE_VALUE_MAP.tomorrow],
    },
    {
        id: RANGE_VALUE_MAP.today,
        value: RANGE_VALUE_MAP.today,
        label: RANGE_LABEL_MAP[RANGE_VALUE_MAP.today],
    },
    {
        id: RANGE_VALUE_MAP.yesterday,
        value: RANGE_VALUE_MAP.yesterday,
        label: RANGE_LABEL_MAP[RANGE_VALUE_MAP.yesterday],
    },
    {
        id: RANGE_VALUE_MAP.sevenDays,
        value: RANGE_VALUE_MAP.sevenDays,
        label: RANGE_LABEL_MAP[RANGE_VALUE_MAP.sevenDays],
    },
    {
        id: RANGE_VALUE_MAP.thirtyOneDays,
        value: RANGE_VALUE_MAP.thirtyOneDays,
        label: RANGE_LABEL_MAP[RANGE_VALUE_MAP.thirtyOneDays],
    },
    {
        id: RANGE_VALUE_MAP.ninetyDays,
        value: RANGE_VALUE_MAP.ninetyDays,
        label: RANGE_LABEL_MAP[RANGE_VALUE_MAP.ninetyDays],
    },
    {
        id: RANGE_VALUE_MAP.aYear,
        value: RANGE_VALUE_MAP.aYear,
        label: RANGE_LABEL_MAP[RANGE_VALUE_MAP.aYear],
    },
    {
        id: RANGE_VALUE_MAP.customRange,
        value: RANGE_VALUE_MAP.customRange,
        label: 'Custom Range',
    },
];

export const PERSIST_DATA_PREFIX_KEY = 'custom_date_picker:';
export const KEYS_TO_PERSIST = ['selectedRangeOption', 'activeTab'];

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
    getYear,
    getMonth,
} from 'date-fns';

import {
    RANGE_VALUE_MAP,
    TAB_NAMES,
    RANGE_LABEL_MAP,
} from './date-picker-config';

function calculateMonthRange(date) {
    const monthDate = startOfMonth(new Date(date));
    return [
        format(monthDate, 'yyyy-MM-dd'),
        format(endOfMonth(monthDate), 'yyyy-MM-dd'),
    ];
}

function calculateNextMonthRange(date) {
    const nextMonthDate = addMonths(new Date(date), 1);
    return calculateMonthRange(nextMonthDate);
}

function calculatePreviousMonthRange(date) {
    const previousMonthDate = subMonths(new Date(date), 1);
    return calculateMonthRange(previousMonthDate);
}

function calculateYearRange(date) {
    const yearDate = startOfYear(new Date(date));
    return [
        format(yearDate, 'yyyy-MM-dd'),
        format(endOfYear(yearDate), 'yyyy-MM-dd'),
    ];
}

function calculateNextYearRange(date) {
    const nextYearDate = addYears(new Date(date), 1);
    return calculateYearRange(nextYearDate);
}

function calculatePreviousYearRange(date) {
    const previousYearDate = subYears(new Date(date), 1);
    return calculateYearRange(previousYearDate);
}

function calculateCustomRange(date = new Date(), days) {
    const customDate = new Date(date);
    let range = [
        format(customDate, 'yyyy-MM-dd'),
        format(addDays(customDate, days), 'yyyy-MM-dd'),
    ];
    
    if (days < 0) {
        range = range.reverse();
    }
    return range;
}

function calculateCurrentCustomRange(date = new Date(), daysOrType) {
    if (daysOrType === RANGE_VALUE_MAP.all) {
        return [
            format(startOfYear(subYears(new Date(), 50)), 'yyyy-MM-dd'),
            format(endOfYear(addYears(new Date(), 50)), 'yyyy-MM-dd'),
        ];
    }
    const startCustomDate = subDays(new Date(date), daysOrType);
    return calculateCustomRange(startCustomDate, daysOrType);
}

function calculateNextCustomRange(date = new Date(), days) {
    const customDate = new Date(date);
    return calculateCustomRange(addDays(customDate, days + 1), days);
}

function calculatePreviousPreviousRange(date = new Date(), days) {
    const customDate = new Date(date);
    return calculateCustomRange(subDays(customDate, days + 1), days);
}

export const CALCULATE_RANGE_METHODS = {
    [TAB_NAMES.month]: {
        next: calculateNextMonthRange,
        previous: calculatePreviousMonthRange,
        current: calculateMonthRange,
    },
    [TAB_NAMES.year]: {
        next: calculateNextYearRange,
        previous: calculatePreviousYearRange,
        current: calculateYearRange,
    },
    [TAB_NAMES.customRange]: {
        next: calculateNextCustomRange,
        previous: calculatePreviousPreviousRange,
        current: calculateCurrentCustomRange,
    },
};

export function formatLabel({ activeTab, selectedRange, selectedRangeOption }) {
    const currentDate = new Date();
    const startRangeDate = new Date(selectedRange[0]);
    if (activeTab === TAB_NAMES.year) {
        return format(startRangeDate, 'yyyy');
    }
    if (activeTab === TAB_NAMES.month) {
        let monthLabel = 'MMM';
        if (getYear(currentDate) !== getYear(startRangeDate)) {
            monthLabel = 'MMM, yyyy';
        }
        return format(startRangeDate, monthLabel);
    }
    if (RANGE_LABEL_MAP[selectedRangeOption]) {
        return RANGE_LABEL_MAP[selectedRangeOption];
    }

    const endRangeDate = new Date(selectedRange[1]);
    const isStartInCurrentYear = getYear(currentDate) === getYear(startRangeDate);
    const isEndInCurrentYear = getYear(currentDate) === getYear(endRangeDate);
    const isInSameYear = getYear(startRangeDate) === getYear(endRangeDate);
    const isInSameMonth = getMonth(startRangeDate) === getMonth(endRangeDate);

    if (isStartInCurrentYear && isEndInCurrentYear) {
        if (isInSameMonth) {
            return `${format(startRangeDate, 'MMM dd')} - ${format(
                endRangeDate,
                'dd'
            )}`;
        }
        return `${format(startRangeDate, 'MMM dd')} ~ ${format(
            endRangeDate,
            'MMM dd'
        )}`;
    }

    if (isStartInCurrentYear && !isEndInCurrentYear) {
        return `${format(startRangeDate, 'MMM dd')} ~ ${format(
            endRangeDate,
            'MMM dd, yyyy'
        )}`;
    }

    if (!isStartInCurrentYear && isEndInCurrentYear) {
        return `${format(startRangeDate, 'MMM dd, yyyy')} ~ ${format(
            endRangeDate,
            'MMM dd'
        )}`;
    }

    if (!isInSameYear) {
        return `${format(startRangeDate, 'MMM dd, yyyy')} ~ ${format(
            endRangeDate,
            'MMM dd, yyyy'
        )}`;
    }

    if (isInSameYear) {
        if (isInSameMonth) {
            return `${format(startRangeDate, 'MMM dd')} - ${format(
                endRangeDate,
                'dd, yyyy'
            )}`;
        }

        return `${format(startRangeDate, 'MMM dd')} ~ ${format(
            endRangeDate,
            'MMM dd, yyyy'
        )}`;
    }
}

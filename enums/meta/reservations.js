import {
    Header,
    CreatedAtHeader,
    ActionHeader,
    ActionDefaults,
    AmountHeader,
    EmailHeader,
    DateHeader,
} from './default';
import { RESERVATION_STATUSES } from '@/enums/statuses';
import { PERMISSIONS } from '../permissions';
import moment from 'moment';
import { hasPermission } from '~/mixins/main-mixin';

export const ReservationHeaders = [
    {
        ...Header,
        title: 'Id',
        value: hasPermission(PERMISSIONS.reservationsDetails)
            ? '$$redirectedTo'
            : '$$default',
        value: '$$redirectedTo',
        valueFrom: 'number',
        getPath: (item) => {
            let obj = {
                path: '',
                newTab: false,
            };

            if (!item.id) return obj;

            if (item.status === RESERVATION_STATUSES.draft) {
                obj = {
                    path: `/reservation/create?id=${item.id}&draft=true`,
                    newTab: false,
                };
                return obj;
            }

            if (!hasPermission(PERMISSIONS.reservationsDetails)) {
                return { value: item };
            }

            obj = {
                path: `/reservation/details/${item.id}`,
                newTab: false,
            };
            return obj;
        },
    },
    {
        ...Header,
        title: 'Payment Type',
        value: '$$convertCase',
        convertInto: 'startCase',
        valueFrom: 'paymentType',
    },
    { ...Header, title: 'Customer Id', valueFrom: 'paypalCustomerId' },
    { ...Header, title: 'Transaction Id', valueFrom: 'transactionId' },
    { ...Header, title: 'Assigned Drivers', valueFrom: 'assignedDrivers' },

    {
        ...Header,
        title: 'Username',
        value: '$$convertCase',
        convertInto: 'startCase',
        valueFrom: 'name',
    },
    EmailHeader,
    {
        ...Header,
        title: 'Affiliate Name',
        valueFrom: 'affiliateName',
    },
    {
        ...Header,
        title: 'Return Trip',
        value: '$$redirectedTo',
        valueFrom: 'parentOfNumber',
        getPath: (item) => {
            return {
                path: item.parentOf ? `/reservation/details/${item.parentOf}` : '',
                newTab: false,
            };
        },
    },
    {
        ...Header,
        title: 'Return Trip Off',
        value: '$$redirectedTo',
        valueFrom: 'childOfNumber',
        getPath: (item) => {
            return {
                path: item.childOf ? `/reservation/details/${item.childOf}` : '',
                newTab: false,
            };
        },
    },
    {
        ...DateHeader,
        title: 'Pickup Time',
        valueFrom: 'pickUpDateTime',
    },
    {
        ...Header,
        title: 'Pickup Address',
        valueFrom: 'pickUpLocation',
        isTooltip: true,
        value: '$$convertCase',
        convertInto: 'startCase',
    },
    {
        ...Header,
        title: 'Dropoff Address',
        valueFrom: 'dropOffLocation',
        isTooltip: true,
        value: '$$convertCase',
        convertInto: 'startCase',
    },
    {
        ...Header,
        title: 'Hotel Name',
        valueFrom: 'hotelName',
    },
    {
        ...Header,
        title: 'Bag Checked',
        value: '$$boolean',
        getValue: ({ item }) => item.isBagsChecked,
    },
    {
        ...Header,
        title: 'Status',
        value: '$$chip',
        valueFrom: 'status',
    },
    AmountHeader,
    { ...Header, title: 'Phone', valueFrom: 'phoneNumber' },
    CreatedAtHeader,
    ActionHeader,
];

export const ReservationMeta = {
    statusKey: 'reservation',
    title: 'Reservations',
    showSelect: false,
    filters: (statuses) => {
        return [
            {
                key: 'status',
                label: 'Statuses',
                placeholder: 'Select Statuses',
                values: statuses.map((status) => ({
                    label: status.name,
                    value: status.name,
                })),
            },
            {
                key: 'filterDate',
                label: 'Dates',
                placeholder: 'Select Dates',
                singular: false,
                preCondition: (user) => {
                    if (user.isAdmin) {
                        return true;
                    }
                },
                values: [
                    {
                        label: 'Created At',
                        value: 'createdAt',
                    },
                    // {
                    //     label: 'Created Reservations',
                    //     value: 'createdAt',
                    // },
                ],
            },
        ];
    },
    headers: ReservationHeaders,
    actions: [
        {
            ...ActionDefaults.view,
            redirectTo: (item) => `/reservation/details/${item.id}`,
            preCondition: (item) => item.status !== RESERVATION_STATUSES.draft,
            permission: PERMISSIONS.reservationsDetails,
        },
        {
            ...ActionDefaults.edit,
            permission: PERMISSIONS.reservationsEdit,
            redirectTo: (item) => {
                return item.status === RESERVATION_STATUSES.draft
                    ? `/reservation/create?id=${item.id}&draft=true`
                    : `/reservation/update/${item.id}`;
            },
            preCondition: (item, user) => {
                if (
                    [
                        RESERVATION_STATUSES.completed,
                        RESERVATION_STATUSES.cancelled,
                    ].includes(item.status)
                ) {
                    return false;
                }

                if (!user.isAdmin) {
                    const duration = moment.duration(
                        moment(item.pickUpDateTime).diff(moment())
                    );
                    const hoursDifference = duration.asHours();

                    if (hoursDifference <= 6) {
                        return false;
                    }
                    return true;
                }
                return true;
            },
        },
        {
            ...ActionDefaults.assignDriver,
            permission: PERMISSIONS.reservationsAssign,
            preCondition: (item) =>
                ![
                    RESERVATION_STATUSES.draft,
                    RESERVATION_STATUSES.cancelled,
                    RESERVATION_STATUSES.completed,
                ].includes(item.status),
        },
        {
            ...ActionDefaults.create,
            permission: PERMISSIONS.reservationsCreate,
            redirectTo: () => '/reservation/create?isGettingAQuote=false',
        },
        {
            ...ActionDefaults.addAddons,
            permission: PERMISSIONS.reservationsAddAddon,
            preCondition: (item) =>
                ![RESERVATION_STATUSES.draft, RESERVATION_STATUSES.cancelled].includes(
                    item.status
                ),
        },
        {
            ...ActionDefaults.duplicate,
            permission: PERMISSIONS.reservationsDuplicate,
            redirectTo: (item) => `/reservation/create?id=${item.id}`,
            preCondition: (item) => item.status != RESERVATION_STATUSES.draft,
        },
        {
            ...ActionDefaults.complete,
            permission: PERMISSIONS.reservationsComplete,
            preCondition: (item) => item.status === RESERVATION_STATUSES.assigned,
        },
        {
            ...ActionDefaults.cancelled,
            permission: PERMISSIONS.reservationsCancel,
            preCondition: (item) =>
                ![
                    RESERVATION_STATUSES.completed,
                    RESERVATION_STATUSES.cancelled,
                ].includes(item.status),
        },
        // {
        //     ...ActionDefaults.delete,
        //     preCondition: (item) =>
        //         ![
        //             RESERVATION_STATUSES.completed,
        //             RESERVATION_STATUSES.viewed,
        //             RESERVATION_STATUSES.assigned,

    //         ].includes(item.status),
    // },
    ],
};

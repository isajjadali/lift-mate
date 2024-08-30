import {
    CreatedAtHeader,
    EditHeader,
    Actions,
    ActionHeader,
    NameHeader,
    EmailHeader,
    Header,
} from './default';
import {
    EmailFieldConfig,
    FirstNameFieldConfig,
    LastNameFieldConfig,
} from './default-field-configs';
import { PERMISSIONS } from '../permissions';

export const UserRoleHeaders = [
    {
        ...NameHeader,
        valueFrom: 'fullName',
        fieldConfig: { ...FirstNameFieldConfig, label: 'Name' },
    },
    {
        ...Header,
        title: 'Roles',
        valueFrom: 'assignedRoles',
    },
    {
        ...EmailHeader,
        fieldConfig: EmailFieldConfig,
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

    CreatedAtHeader,
    ActionHeader,
];
export const fieldsConfigWithoutHeaders = [
    {
        fieldConfig: LastNameFieldConfig,
    },
    {
        fieldConfig: EmailFieldConfig,
    },
    {
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
];

export const UsersWithRoles = {
    title: 'Users',
    headers: UserRoleHeaders,
    fieldsConfigWithoutHeaders: fieldsConfigWithoutHeaders,
    createUserAssignRoles: true,
    urls: {
        fetch: '/roles/users?limit=500&offset=0',
        fetchLinked: '/roles/role-permissions?limit=500&offset=0',
        editData: (item) => `/roles/users/${item}`,
        createData: '/users',
        createUserAndAssignRoles: '/users/create-user-and-assign-roles',
    },
    onOpeningAssignModal: (selectedItem, linkedData) => {
        linkedData.forEach((item) => {
            item.isSelected = false;
            if (selectedItem.Roles.some((role) => role.id === item.id)) {
                item.isSelected = true;
            }
        });

        return linkedData;
    },
    joinRoles: (data) => {
        data = data.map((item) => {
            let roles = item.Roles.map((role) => role.name);
            return {
                ...item,
                assignedRoles: roles.join(','),
            };
        });
        return data;
    },
    actions: [
        {
            ...Actions[0],
            permission: PERMISSIONS.usersEdit,
        },
        {
            ...Actions[1],
            permission: PERMISSIONS.rolesAssign,
        },
    ],
    showSelect: false,
};

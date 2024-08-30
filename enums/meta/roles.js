import {
    CreatedAtHeader,
    EditHeader,
    Actions,
    ActionHeader,
    NameHeader,
} from './default';
import { MDI_ICONS } from '../mdi-icons';
import { NameFieldConfig } from './default-field-configs';
import { PERMISSIONS } from '../permissions';
export const RoleHeaders = [
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

export const RoleMeta = {
    title: 'Roles',
    headers: RoleHeaders,
    urls: {
        fetch: '/roles/role-permissions?limit=500&offset=0',
        fetchLinked: '/permissions?limit=500&offset=0',
        editData: (item) => `/permissions/${item}`,
        createData: '/roles',
    },
    onOpeningAssignModal: (selectedItem, linkedData) => {
        linkedData.forEach((item) => {
            item.isSelected = false;
            if (selectedItem.Permissions.some((per) => per.id === item.id)) {
                item.isSelected = true;
            }
        });
        return linkedData;
    },
    actions: [
        {
            ...Actions[0],
            permission: PERMISSIONS.rolesCreate,
        },
        {
            ...Actions[1],
            permission: PERMISSIONS.rolesAssign,
        },
    ],
    showSelect: false,
};

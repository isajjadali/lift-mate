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

export const PermissionHeaders = [
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

export const PermissionMeta = {
    title: 'Permissions',
    headers: PermissionHeaders,
    urls: {
        fetch: '/permissions?limit=500&offset=0',
        fetchLinked: '/roles/role-permissions?limit=500&offset=0',
        editData: (item) => `/permissions/${item}/assign-to-roles`,
        createData: '/permissions',
    },
    onOpeningAssignModal: (selectedItem, linkedData) => {
        linkedData.forEach((item) => {
            item.isSelected = false;
            if (
                item.Permissions.some((permission) => permission.id === selectedItem.id)
            ) {
                item.isSelected = true;
            }
        });
        return linkedData;
    },
    actions: [
        {
            ...Actions[0],
            permission: PERMISSIONS.permissionsCreate,
        },
        {
            ...Actions[1],
            permission: PERMISSIONS.permissionsAssign,
        },
    ],
    showSelect: false,
};

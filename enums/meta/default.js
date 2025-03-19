import moment from "moment";
import { SysActions } from "../permissions";

export const Header = {
  value: "$$default",
  align: "center",
  minWidth: "170px",
  sortable: false,
};

export const DateHeader = {
  ...Header,
  value: "$$date",
  minWidth: "225px",
};

export const ActionHeader = {
  ...Header,
  title: "Actions",
  value: "$$actions",
  cellClass: "action-class",
};

export const IsActiveHeader = {
  ...Header,
  title: "Active",
  value: "$$toggle",
  valueFrom: "active",
  cellClass: "data-table__is-active",
};

export const CreatedAtHeader = {
  ...DateHeader,
  title: "Created At",
  valueFrom: "createdAt",
};
export const PercentageHeader = {
  ...Header,
  title: "Percentage",
  value: "$$percentage",
  valueFrom: "percentage",
};
export const AmountHeader = {
  ...Header,
  title: "Amount",
  value: "$$amount",
  valueFrom: "amount",
};
export const FromHeader = {
  ...DateHeader,
  title: "From",
  valueFrom: "from",
};
export const ToHeader = {
  ...DateHeader,
  title: "To",
  valueFrom: "to",
};
export const FirstNameHeader = {
  ...Header,
  title: "First Name",
  value: "$$redirectedTo",
  valueFrom: "firstName",
};
export const LastNameHeader = {
  ...Header,
  title: "Last Name",
  valueFrom: "lastName",
};
export const NameHeader = {
  ...Header,
  title: "Name",
  valueFrom: "name",
};
export const EmailHeader = {
  ...Header,
  title: "Email",
  valueFrom: "email",
};
export const EditHeader = {
  ...Header,
  title: "Edit",
};

export const StatusFilters = [
  {
    key: "isActive",
    label: "Statuses",
    vModel: "isActive",
    placeholder: "Select Statuses",
    type: "select",
    items: [
      {
        label: "Active",
        value: true,
      },
      {
        label: "In Active",
        value: false,
      },
    ],
    "item-title": "label",
    "item-value": "value",
  },
];

export const ActionDefaults = {
  create: {
    name: "CREATE",
    title: "+Add",
    color: "primary",
    icon: "",
    sysAction: SysActions.create,
  },
  edit: {
    name: "EDIT",
    title: "Edit",
    color: "accent",
    icon: "mdi-pencil",
    sysAction: SysActions.edit,
  },
  delete: {
    name: "DELETE",
    title: "Delete",
    color: "error",
    icon: "mdi-delete",
    isConfirmationRequired: true,
    sysAction: SysActions.delete,
  },
  complete: {
    name: "COMPLETE",
    title: "Complete",
    color: "warning",
    icon: "mdi-check",
    isConfirmationRequired: true,
    sysAction: SysActions.complete,
  },
  cancelled: {
    name: "CANCELLED",
    title: "cancel",
    color: "secondary",
    icon: "mdi-cancel",
    isConfirmationRequired: true,
    sysAction: SysActions.cancel,
  },
  view: {
    name: "VIEW",
    title: "View",
    color: "primary",
    icon: "mdi-eye",
    sysAction: SysActions.view,
  },
  addAddons: {
    name: "ADD_ADDONS",
    title: " Add Addon",
    color: "primary",
    icon: "mdi-alarm-plus",
    sysAction: SysActions.addAddons,
  },
  viewImage: {
    name: "VIEW_IMAGE",
    title: "Image",
    color: "accent",
    icon: "mdi-eye",
    sysAction: SysActions.viewImage,
  },
  duplicate: {
    name: "DUPLICATE",
    title: "Duplicate",
    color: "warning",
    icon: "mdi-content-duplicate",
    sysAction: SysActions.duplicate,
  },
  assignDriver: {
    name: "ASSIGN_DRIVER",
    title: "Assign",
    color: "secondary",
    icon: "mdi-hand-pointing-right",
    sysAction: SysActions.assign,
  },
};

export const Actions = [
  {
    ...ActionDefaults.create,
  },
  {
    ...ActionDefaults.edit,
  },
  {
    ...ActionDefaults.delete,
  },
];

export const DefaultFromFunction = (val, field, payload) => {
  const formattedValue = moment(val).format("YYYY-MM-DD");
  const formattedTo = moment(payload.to).format("YYYY-MM-DD");
  return !payload.to
    ? formattedValue >= moment().format("YYYY-MM-DD")
    : formattedValue <= formattedTo;
};
export const DefaultToFunction = (val, field, payload) => {
  const formattedValue = moment(val).format("YYYY-MM-DD");
  const formattedFrom = moment(payload.from).format("YYYY-MM-DD");

  return payload.from
    ? formattedValue >= formattedFrom
    : moment().format("YYYY-MM-DD");
};

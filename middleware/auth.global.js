import { PERMISSIONS } from "~/enums";
import { useCookie } from "#app";

const ROUTES_PERMISSIONS = {
  reservations: PERMISSIONS.reservationsView,
  "reservation-details": PERMISSIONS.reservationsDetails,
  //   "reservation-update-id": PERMISSIONS.reservationsEdit,
  "reservation-create": PERMISSIONS.reservationsCreate,
  "more-addons": PERMISSIONS.addonsView,
  affiliates: PERMISSIONS.affiliatesView,
  vehicles: PERMISSIONS.carsView,
  "user-customers": PERMISSIONS.customersView,
  "discount-codes": PERMISSIONS.discountCodesView,
  "user-drivers": PERMISSIONS.driversView,
  "more-static-pages": PERMISSIONS.staticPageEditorView,
  "more-surges": PERMISSIONS.surgesView,
  "settings-configurations": PERMISSIONS.configurationsView,
  "settings-permissions": PERMISSIONS.permissionsView,
  "settings-roles": PERMISSIONS.rolesView,
  "settings-user-with-roles": PERMISSIONS.userRolesView,
  "users-id-change-email": PERMISSIONS.usersChangeEmail,
  "users-id-change-password": PERMISSIONS.usersChangePassword,
  "users-id-profile-info": PERMISSIONS.usersProfileInfo,
  "users-id-user-attachments": PERMISSIONS.usersAttachments,
};

export default defineNuxtRouteMiddleware((to, from) => {
  console.log(to, "from middleware");
  if (to.name === "index") {
    const user = useCookie("user");
    if (user.value?.id) return navigateTo("/dashboard");
    else return;
  }

  if (to.name === "dashboard") {
    const user = useCookie("user");
    if (!user.value?.id) return navigateTo("/");
    else return;
  }
  if (
    to.matched.every((rec) => {
      const permission = ROUTES_PERMISSIONS[rec.name];
      if (!permission) return false;
      return !checkPermissionFromCookie(permission);
    })
  ) {
    return navigateTo("/dashboard");
  }
});

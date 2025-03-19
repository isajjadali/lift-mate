import { localStorage } from "~/plugins/localStorage";

export const checkPermissionFromCookie = function (permission = "") {
  const userCookie = useCookie("user");
  const user = userCookie.value;
  return !!user?.permissions?.includes(permission);
};

export const checkPermissionFromLocalStorage = function (permission = "") {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return !!user?.permissions?.includes(permission);
};

export const hasPermission = function (sysEntities = "", sysActions = "") {
  console.log("--------------start--------------------");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  console.log("--------------start--------------------");
  console.log(sysActions, sysEntities, "hisihaisdffisd");
  return user?.permissions?.includes(`${sysEntities}:${sysActions}`);
};

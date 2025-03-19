import { checkPermissionFromCookie } from "~/composables/has-permission";
import { PERMISSIONS } from "@/enums";
import { $useFetch } from "~/plugins/use-fetch";

async function setUser(payload) {
  this.user = payload.user;
  const userCookie = useCookie("user", {
    httpOnly: false,
    sameSite: "lax",
    secure: false,
  });
  const tokenCookie = useCookie("token");
  userCookie.value = {
    id: payload.user.id,
    initials: payload.user.initials,
    firstName: payload.user.firstName,
    fullName: payload.user.fullName,
    lastName: payload.user.lastName,
    email: payload.user.email,
    Companies: payload.user.Companies,
    permissions: payload.user.permissions,
    phoneNumber: payload.user.phoneNumber,
    phoneNumberAsEmail: payload.user.phoneNumberAsEmail,
    role: payload.user.role,
    uuid: payload.user.uuid,
  };
  console.log(
    new Blob([JSON.stringify(payload.user)]).size,
    "User cookie size (bytes)"
  );
  tokenCookie.value = payload.token;
  getLocalStorage().setItem("token", payload.token);
  getLocalStorage().setItem("user", JSON.stringify(payload.user));
  getLocalStorage().setItem("isAdmin", payload.user.isAdmin);
}

function getLocalStorage() {
  const { $localStorage } = useNuxtApp();
  return {
    getItem: $localStorage.getItem,
    setItem: $localStorage.setItem,
    clearData: $localStorage.clearData,
  };
}

export default defineStore("default", {
  state: () => ({
    user: {},
    configurations: {},
    pages: [],
    cars: [],
    selectedUserForProfileInfo: {},
    airports: [],
  }),
  actions: {
    async login(payload) {
      const response = await $useFetch.post("/login", payload);
      console.log(response, "response");
      if (response.error) return response;
      await setUser.call(this, response.data);
      setTimeout(() => {
        console.log("After delay:", useCookie("user").value);
      }, 1000);
      await this.fetchStatuses();
      if (checkPermissionFromCookie(PERMISSIONS.staticPageEditorView)) {
        await this.fetchStaticPages();
      }
      return response.data;
    },
    async signup(payload) {
      const response = await $useFetch.post("/signup", payload);
      if (response.error) return response;
      setUser.call(this, response.data);
      return response.data;
    },
    async getMe() {
      const user = useCookie("user").value;
      if (user) {
        this.user = user;
        console.log(this.user);
      } else if (useCookie("token").value) {
        const response = await $useFetch.get("/me");
        this.user = response.data.user;
        setUser.call(this, response.data);
      }
    },
    async getConfig() {
      const response = await $useFetch.get("/configurations");
      this.configurations = response.data;
    },
    async setConfig(payload) {
      $useFetch.put("/configurations/1", payload);
    },
    async getPages() {
      const response = await $useFetch.get("/static-pages/available");
      this.pages = response.dataItems;
    },
    async createPage(payload) {
      const response = await $useFetch.post("/static-pages", payload);
      return response;
    },
    signOut() {
      this.user = {};
      const user = useCookie("user");
      user.value = null;
      const token = useCookie("token");
      token.value = null;
      getLocalStorage().clearData();
    },
    async fetchStaticPages() {
      const response = await $useFetch.get("/static-pages");
      getLocalStorage().setItem(
        "staticPages",
        JSON.stringify(response.dataItems)
      );
    },
    async fetchCars() {
      const response = await $useFetch.get("/cars/available");
      this.cars = response.dataItems.map((car) => ({
        ...car,
        requiredCars: 1,
        isSelected: false,
        multiSelect: false,
      }));
    },
    async fetchLoggedInUser() {
      const response = await $useFetch.get("/me");
      this.user = response.data;
    },
    async fetchStatuses() {
      const response = await $useFetch.get("/statuses");
      getLocalStorage().setItem("statuses", JSON.stringify(response.dataItems));
    },
    async fetchAddons() {
      const response = await $useFetch.get("/addons");
      getLocalStorage().setItem("addons", JSON.stringify(response.dataItems));
      return response.dataItems;
    },
    async fetchDrivers() {
      const response = await $useFetch.get("/users?role=Driver");
      getLocalStorage().setItem("drivers", JSON.stringify(response.dataItems));
      return response.dataItems;
    },
    async reIntializeUser() {
      const response = await $useFetch.get("/me");
      response.data.token = getLocalStorage().getItem("token");
      setUser.call(this, response.data);
    },
    async fetchAirports(includeLocations = false) {
      const response = await $useFetch.get(
        `/airports?includeLocations=${includeLocations}`
      );
      if (includeLocations) this.airports = response.dataItems;
      return response.dataItems;
    },
  },
});

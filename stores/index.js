import axios from 'axios';
import { hasPermission } from '~/mixins/main-mixin';
import { PERMISSIONS } from '@/enums';

function setUser(payload) {
  this.user = payload.user;
  getLocalStorage().setItem('token', payload.token);
  getLocalStorage().setItem('user', JSON.stringify(payload.user));
  getLocalStorage().setItem('isAdmin', payload.user.isAdmin);
}

function getLocalStorage() {
  const { $localStorage } = useNuxtApp();
  return {
    getItem: $localStorage.getItem,
    setItem: $localStorage.setItem,
    clearData: $localStorage.clearData,
  }
}

export default defineStore('default', {
  state: () => ({
    user: {},
    configurations: {},
    pages: [],
    cars: [],
  }),
  actions: {
    async login(payload) {
      const response = await axios.post('/login', payload);
      setUser.call(this, response.data);
      await this.fetchStatuses();
      if (hasPermission(PERMISSIONS.staticPageEditorView)) {
        await this.fetchStaticPages();
      }
      return response.data;
    },
    async signup(payload) {
      const response = await axios.post('/signup', payload);
      setUser.call(this, response.data);
    },
    async getMe() {
      // const { $localStorage } = useNuxtApp();
      const user = getLocalStorage().getItem('user');
      if (user) {
        this.user = JSON.parse(user);
      } else if (getLocalStorage().getItem('token')) {
        const response = await axios.get('/me');
        this.user = response.data.user;
      }
    },
    async getConfig() {
      const response = await axios.get('/configurations');
      this.configurations = response.data;
    },
    async setConfig(payload) {
      axios.put('/configurations/1', payload);
    },
    async getPages() {
      const response = await axios.get('/static-pages/available');
      this.pages = response.dataItems;
    },
    async createPage(payload) {
      const response = await axios.post('/static-pages', payload);
      return response;
    },
    signOut() {
      this.user = {};
      getLocalStorage().clearData();
    },
    async fetchStaticPages() {
      const response = await axios.get('/static-pages');
      getLocalStorage().setItem('staticPages', JSON.stringify(response.dataItems));
    },
    async fetchCars() {
      const response = await axios.get('/cars/available');
      this.cars = response.dataItems.map(car => ({
        ...car,
        requiredCars: 1,
        isSelected: false,
      }));
    },
    async fetchLoggedInUser() {
      const response = await axios.get('/me');
      this.user = response.data;
    },
    async fetchStatuses() {
      const response = await axios.get('/statuses');
      getLocalStorage().setItem('statuses', JSON.stringify(response.dataItems));
    },
    async fetchAddons() {
      const response = await axios.get('/addons');
      getLocalStorage().setItem('addons', JSON.stringify(response.dataItems));
    },
    async fetchDrivers() {
      const response = await axios.get('/users?role=Driver');
      getLocalStorage().setItem('drivers', JSON.stringify(response.dataItems));
    },
    async reIntializeUser() {
      const response = await axios.get('/me');
      response.data.token = getLocalStorage().getItem('token');
      setUser.call(this, response.data);
    },
  },
});

import axios from 'axios';

export default class Service {
    constructor(url) {
        this.url = url;
    }

    get(id = '', params = {}, signal) {
        return axios.get(`${this.url}${id ? `/${id}` : ''}`, {
            params,
            signal,
        });
    }

    create(data, params = {}, signal) {
        return axios.post(`${this.url}`, data, { params, signal });
    }

    update(id, data, params = {}, signal) {
        return axios.put(`${this.url}/${id}`, data, { params, signal });
    }

    delete(id, params = {}, signal) {
        return axios.delete(`${this.url}/${id}`, { params, signal });
    }
}

import axios from 'axios';

class ReservationService {
    // ====> Admin Calls
    assignDriver(id, payload, shouldSendEmail) {
        return axios.put(
            `/reservations/${id}/assign-drivers?shouldSendEmail=${shouldSendEmail}`,
            payload,
        );
    }
    addAddon(id, data = '') {
        return axios.post(`/reservations/${id}/addons`, data);
    }
    deleteAddon(id) {
        return axios.delete(`/reservations/addons/${id}`);
    }
    changeStatus(id, status, params) {
        return axios.put(
            `/reservations/${id}/change-status/${status}`,
            params
        );
    }

    // ====> User Calls
    update(id, payload) {
        return axios.put(`/reservations/${id}`, payload);
    }
    proceedToReservation(payload) {
        const id = payload.id;
        delete payload.id;
        return axios.post(
            `/reservations/${id}/proceed-to-reservation`,
            payload
        );
    }

    // ====> Common Calls
    getClientToken() {
        return axios.get('/initialize-braintree');
    }
    get(id) {
        return axios.get(`/reservations/${id}`);
    }
    getSurges(date) {
        return axios.get('/surges/available', { params: { date } });
    }
    verifyDiscountCode(code = '') {
        return axios.get(`/discount-codes/${code}/verify`);
    }
    create(data = '') {
        delete data.id;
        return axios.post('/reservations', data);
    }
    getDiscountCodes(date) {
        return axios.get('/discount-codes/available', { params: { date } });
    }
    refundPayment(reservationId, params) {
        return axios.post(`/reservations/${reservationId}/refund-payment`, params);
    }
}
export default new ReservationService();

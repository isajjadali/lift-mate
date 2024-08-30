import axios from 'axios';

class UserService {
    // ====> Admin Calls
    changeEmailByAdmin(id, payload) {
        return axios.put(`/users/${id}/change-email`, payload);
    }
    listAttachments(id, payload) {
        return axios.get(`/users/${id}/user-attachments`, payload);
    }
    markReservationsPaid(id = '', reservationIds = []) {
        return axios.put(`/reservations/${id}/mark-as-paid`, reservationIds);
    }
    listUserReservation(id = '', params = {}) {
        return axios.get(`/users/${id}/reservations`, {
            params
        });
    }
    // Todo: Will create at backend soon
    addAttachment(id, payload, params = {}) {
        return axios.post(`/users/${id}/user-attachments`, payload, {
            params,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    // ====> User Calls
    changeEmail(payload) {
        return axios.post('/change-email', payload);
    }
    getUsers() {
        return axios.get('/users');
    }
    getAffiliates() {
        return axios.get('/affiliates');
    }
    changePassword(id, data) {
        return axios.put(`/users/${id}/change-password`, data);
    }
    getById(id = '', params = {}) {
        return axios.get(`/${id}`, { params });
    }

    // ====> Common Calls
    sendForgotPasswordEmail(payload) {
        return axios.post('/forgot-password', payload);
    }
    verifyToken(payload) {
        return axios.post('/verify-token', payload);
    }
    resetPassword(payload) {
        return axios.put('/reset-password', payload);
    }
    verifyPassword(payload) {
        return axios.post('/verify-password', payload);
    }
    verifyEmail(payload) {
        return axios.post('/verify-email', payload);
    }
}

export default new UserService();

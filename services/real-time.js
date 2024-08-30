import socket from '../socket.js';
import store from '../store';

socket.on('onPermissionChange', () => {
    store.dispatch('reIntializeUser');
});

socket.on('signoutUser', () => {
    store.dispatch('signOut');
});

import io from 'socket.io-client';

const socket = io(process.env.VUE_APP_SERVER_URL, {
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 60000,
});

// socket.on('message', (data) => {
//     console.log('Received message from server',data);
// });

// socket.on('connect', () => {
//     console.log('Connected to server');
// });

// socket.on('connect_error', (error) => {
//     console.log(`Error connecting to server: ${error}`);
// });

// socket.on('error', (error) => {
//     console.log(`Error during communication: ${error}`);
// });
export default socket;

'use strict';
import app from './index.js';
import http from 'http';
import socketio from 'socket.io';
import { fromNodeMiddleware } from 'h3';
import logger from './lib/logger.js';

const server = http.Server(app);

const io = socketio(server);

global.io = io;

server.listen(process.env.SERVER_PORT, function () {
    logger.info('Application ready to serve requests on PORT => %s', process.env.SERVER_PORT);
    logger.info('Environment: %s', process.env.NODE_ENV);
})

export default fromNodeMiddleware(app);

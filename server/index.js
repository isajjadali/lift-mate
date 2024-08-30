import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import path from 'path';
import corsOptions from './config/cors-options';

import routes from './routes';
import logger from './lib/logger';

import auth from './middlewares/auth';
import skipAuth from './middlewares/skip-auth';
import convertIfBooleanInQuery from './middlewares/convert-if-boolean-in-query';
import pagination from './middlewares/pagination';
import multer from './middlewares/multer';
import customResponseMethodAppender from 'customize-response-appender';


// import confit from 'confit';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const basedir = path.join(__dirname, 'config');
// confit(basedir).create(function (err, config) {
//   config.get; // Function
//   config.set; // Function
//   config.use; // Function

// console.log('<<<<<--------------Start-------------------->>>>>');
// console.log(config.get('express:views'));
// console.log('<<<<<---------------End--------------------->>>>>');
// });

// import customResponseAppender from 'customize-response-appender';
// import fieldAuthenticationManagerMethod from 'field-authentication-manager';
// import { fileURLToPath } from 'url';

// const customResponseMethodAppender = customResponseAppender({
//     reponsesConfigFilePath: '\\server\\config\\responses-config.js',
// });

// const fieldAuthenticationManager = fieldAuthenticationManagerMethod({
//     requiredFieldDirectoryPath: '\\server\\routes-payload-handlers',
// });

const app = express();

app.set('view engine', 'ejs');


// <<<<<---------------MIDDLEWARES------------------------>>>>>
app.use(cors(corsOptions()));
// For custom configuration you just have to pass false as a prameter and update config file accordingly

const responseAppender = await customResponseMethodAppender({
  reponsesConfigFilePath: 'server/config/responses-config.js',
})

app.all('*', responseAppender);

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use(express.static('./views'));
// app.use(express.static());


app.use(convertIfBooleanInQuery())
app.use(skipAuth())
app.use(auth())
app.use(pagination())
app.use(multer())

routes(app);


// app.all('*', (req, res, next) => {
//     const error = fieldAuthenticationManager({ req, mountPath: '/api/' });
//     if (error) {
//         return res.http400(error);
//     }
//     next();
// });
// <<<<<--------------------------------------->>>>>

export default app;

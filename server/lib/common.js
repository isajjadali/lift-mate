import crypto from 'crypto';
// import promise from 'bluebird';
import jwt from 'jsonwebtoken';
import moment from 'moment';

const { verify: jwtVerify } = jwt;
// import jwtVerify from promise.promisify(verify);

export const getHashedPassword = password =>
  crypto.createHash('sha256').update(password).digest('base64');

export const generateRandomPassword = function ({ length = 10 } = {}) {
  return Math.random().toString(36).slice(length);
};

export const convertIfBoolean = function (value) {
  let newValue = value;
  if (value === 'true') {
    newValue = true;
  } else if (value === 'false') {
    newValue = false;
  }
  return newValue;
};

export const decodeAPiToken = token => jwtVerify(token, process.env.jwtSecret);

export const createToken = function (object, expiresIn) {
  let options = {};
  if (expiresIn) {
    options.expiresIn = expiresIn;
  }
  return jwt.sign(object, process.env.jwtSecret, options);
};

export const formatDate = (date, dateOnly = false) => {
  return moment(date)
    .add(dateOnly ? 1 : 0, 'days')
    .utcOffset(0)
    .format(dateOnly ? 'dddd ll' : 'llll');
};

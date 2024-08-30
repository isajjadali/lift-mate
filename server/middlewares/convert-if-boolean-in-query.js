import { convertIfBoolean } from '../lib/common.js';

export default function () {
  return async function convertIfBooleanInQuery(req, res, next) {
    Object.entries(req.query).forEach(arr => {
      req.query[arr[0]] = convertIfBoolean(arr[1]);
    });

    next();
  };
}

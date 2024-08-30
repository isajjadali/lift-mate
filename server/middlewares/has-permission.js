import { Errors } from '../en.js';

export default function (permission) {
    return function (req, res, next) {
        if (req.authNotRequired) {
            return next();
        }
        
        if (!req.user.dataValues.permissions.includes(permission)) {
            return res.http401(Errors.Auth.AccessRestricted);
        }

        next();
    };
};

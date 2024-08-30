import { decodeAPiToken } from '../lib/common.js';
import { Errors } from '../en.js';
import log from '../lib/logger.js';
import db from '~/server/models/index.js';
const { Users } = db;

export default function () {
    return async (req, res, next) => {
        try {

            if (req.authNotRequired) {
                return next();
            }

            const { authorization } = req.headers;
            if (!authorization) throw Errors.Auth.AuthorizationHeaderMissing;

            const token = authorization.split(' ')[1];
            const decodedToken = await decodeAPiToken(token);

            if (!decodedToken) throw Errors.Auth.InvalidToken;

            const user = await Users.$$findOne({
                query: {
                    where: {
                        id: decodedToken.id,
                        email: decodedToken.email,
                    }
                },
                error: Errors.Auth.InvalidToken,
            });

            await user.setRolesAndPermissions();
            req.user = user;
            next();
        } catch (err) {
            log.error(err);
            return res.http401(err);
        }
    };
};

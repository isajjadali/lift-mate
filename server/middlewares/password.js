import { Errors } from '../en.js';
const { Password } = Errors;
import { getHashedPassword } from '../lib/common.js';

export const oldPasswordValidator = function (req, res, next) {
    const { oldPassword } = req.body;
    if (req.user.dataValues.isAdmin) {
        return next();
    }
    
    return getHashedPassword(oldPassword) !== req.user.password
        ? res.http500(Password.Validations.IncorrectOldPassword)
        : next();
};

export const passwordChangeValidator = function (req, res, next) {
    const { newPassword } = req.body;
    return (getHashedPassword(newPassword) === req.user.password)
        ? res.http500(Password.Validations.NewAndOldPasswordAreSame)
        : next();
};

export const newAndConfirmPasswordValidator = function (req, res, next) {
    const { newPassword, confirmPassword } = req.body;
    return (newPassword !== confirmPassword)
        ? res.http500(Password.Validations.NewAndConfirmPasswordNotMatched)
        : next();
};

import { Validations } from './enums.js';

export const $translate = function (key, mappings) {
    Object.keys(mappings).forEach(
        (mapKey) => (key = key.replace(`$$${mapKey}`, mappings[mapKey]))
    );
    return key;
};

export const Errors = {
    Auth: {
        AuthorizationHeaderMissing: 'Authorization header missing!',
        InvalidToken: 'Invalid token!',
        AccessRestricted: 'You don\'t have access to this route!',
    },
    CNIC: {
        Format: `CNIC format must be ${Validations ? Validations.CNIC.Format: ''}!`,
    },
    Email: {
        Invalid: 'Invalid Email!',
        Unique: 'Email must be unique!',
    },
    Models: {
        InvalidId: 'Invalid $$modelName id!',
        NotFound: '$$modelName not found against this id!',
    },
    Surges: {
        Percentage: {
            Max: 'Percentage should be less then 100!'
        }
    },
    Password: {
        Validations: {
            IncorrectOldPassword: 'Incorrect old Password!',
            NewAndConfirmPasswordNotMatched: 'New password and confirm password do not match!',
            NewAndOldPasswordAreSame: 'New password and old password are same!',
        },
    },
    PhoneNumber: {
        Format: `Phone number format must be ${Validations ? Validations.PhoneNumber.Format: ''}!`,
    },
    SignIn: {
        IncorrectEmailPassword: 'Invalid email or password!'
    },
    Cars: {
        Name: {
            Unique: 'Car Name must be unique!',
        },
    },
    Permissions: {
        Name: {
            Unique: 'Permission Name must be unique!',
        },
    },
    Roles: {
        Name: {
            Unique: 'Role Name must be unique!',
        },
    },
    DiscountCodes: {
        Code: {
            Unique: 'Code must be unique!',
        },
        Percentage: {
            Max: 'Percentage value must be less than equal to 100!'
        }
    },
    ReservationDiscountCodes: {
        Percentage: {
            Max: 'Percentage value must be less than equal to 100!'
        }
    },
    ReservationSurges: {
        Percentage: {
            Max: 'Percentage value must be less than equal to 100!'
        }
    },
    StaticPages: {
        Slug: {
            Unique: 'Slug must be unique!'
        },
        Title: {
            Unique: 'Title must be unique!'
        }
    },
    Addons: {
        Name: {
            Unique: 'Addon name must be unique!',
        },
        Percentage: {
            Max: 'Discount must be less than 100!',
        },
    },
    Users: {
        PhoneNumber: {
            len: 'Phone number length must be equal to 14 charachters!'
        }
    },
    ForgotPassword: {
        PasswordChanged: {
            PasswordAlreadyChanged: 'Password with this link has already changed !',
        }
    },
    Affiliates: {
        Name: {
            Unique: 'Affiliate name must be unique!',
        },
    },
};

export const SuccessResponses = {
    CRUD: '$$modelName($$item) $$action successfully!',
    User: {
        Logout: 'User logout successfully!',
    },
};

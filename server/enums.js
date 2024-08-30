export const Validations = {
    CNIC: {
        Format: 'XXXXX-XXXXXXX-X',
        Regex: /^\d{5}-\d{7}-\d{1}$/,
    },
    PhoneNumber: {
        Format: 'XX-XXXXXXXXX',
        Regex: /\(\d{3}\)-\d{3}-\d{4}/,
    },
};

export const CRUD = {
    Created: 'created',
    Deleted: 'deleted',
    Read: 'read',
    Updated: 'updated',
};  
export const Statuses = {
    User: {
        Active: 'active',
        Inactive: 'inactive',
    },
};

export const Roles = {
    admin: 'admin',
    driver: 'driver',
    customer: 'customer',
    seoAdmin: 'seo_admin',
    superAdmin: 'super_admin',
};

export const Regex = {
    reservation: /^A[0-9]*$/gm,
};

export const DiscountCodesType = {
    General: 'general',
    RoundTrip: 'round trip',
};
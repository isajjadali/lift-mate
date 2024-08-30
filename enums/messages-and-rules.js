export const Messages = {
    error: {
    // Backend messages
        'Email must be unique!': 'User with email already exist!',
        'Invalid email or password!': 'Invalid credentials!',
        passwordNotMatched: 'Password not matched!',
        incorrectPassword: 'Password incorrect',
        emailAlreadyExist: 'Email already exist',
    },
    success: {
        signinSuccessFully: 'Signin Successfully!',
        signupSuccessFully: 'Signup Successfully!',
        signoutSuccessFully: 'Signout Successfully!',
        mailSent: 'Mail Sent Successfully!',
        passwordUpdated: 'Password Updated Successfully!',
        emailVerifiedSuccessfully: 'Email Registered Successfully!',
        configUpdatedSuccessfully: 'Configurations Updated Successfully',

    // Backend messages
    },
};

export const CharachtersLength = {
    password: 8,
    phoneNumber: 14,
};

export const Rules = {
    emailValid: 'E-mail must be valid',
    passwordCharacter: `Password must be atleast ${CharachtersLength.password} characters`,
    confirmPasswordMismatch: 'Confirm password mismatch',
    validPhoneNumber: 'Phone Number must be a valid US number',
    oldPassword: 'Old and new Passwords must not be same',
    shouldRefund: 'Amount should be less than or equal to actual amount',
};

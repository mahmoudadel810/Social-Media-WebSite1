import joi from 'joi';


export const signUpSchema = {
    body: joi.object().required().keys({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        email: joi.string().required().email({ tlds: { allow: ['com', 'net'] } }),
        password: joi.string().required(),
        cpass: joi.string().required().valid(joi.ref('password')),
        userName: joi.string().required()

    })
};

export const confirmEmailSchema = {

    params: joi.object().required().keys({
        token: joi.string().required()
    })
};




export const loginSchema = {
    body: joi.object().required().keys({

        email: joi.string().required().email({ tlds: { allow: ['com', 'net'] } }),
        password: joi.string().required(),
    })
};


export const forgetPasswordSchema = {
    body: joi.object().required().keys({
        code: joi.string().required().min(1).max(5),
        newPassword: joi.string().required(),
        confirmNewPassword: joi.string().required().valid(joi.ref('newPassword'))
    })
};


export const updatePasswordSchema = {
    body: joi.object().required().keys({
        oldPassword: joi.string().required(),
        newPassword: joi.string().required(),
        confirmPassword: joi.string().required().valid(joi.ref('newPassword')),
    })
};
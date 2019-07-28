const UserController = require('./user.controller');
const Joi = require('joi');
module.exports = [
    {
        path: '/users/signup',
        method: 'POST',
        config: {
            handler: UserController.create,
            validate: {
                payload: Joi.object().keys({
                    firstName       : Joi.string().required(),
                    lastName        : Joi.string().required(),
                    email           : Joi.string().lowercase().email().required(),
                    password        : Joi.string().required(),
                    mobileNumber    : Joi.string().required(),
                    DOB             : Joi.string().required(),
                    passportNumber  : Joi.string().required(),
                    role            : Joi.string().required()
                }),
                failAction: (request, h, error) => {
                    return error.isJoi ? h.response(error.details[0]).takeover() : h.response(error).takeover()
                },
            },
            description: 'user can create new Account(not used)',
            tags: ['api','user'],
            notes: 'Returns a signup response',
            auth: false
        }
    },
    {
        path: '/users/login',
        method: 'POST',
        config: {
            handler: UserController.login,
            validate: {
                payload: Joi.object().keys({
                    email: Joi.string().lowercase().email().required(),
                    password: Joi.string().required()
                }),
                failAction: (request, h, error) => {
                    return error.isJoi ? h.response(error.details[0]).takeover() : h.response(error).takeover()
                },
            },
            description: 'user Login',
            tags: ['api','user'],
            notes: 'Returns a JSON Web Token',
            auth:false
        }
    },
    {
        path: '/users/me',
        method: 'GET',
        config: {
            handler: UserController.me,
            validate: {
                headers:Joi.object({
                    'authorization':Joi.string().required()
                }).unknown()
            },
            description: 'user account info [token]',
            tags: ['api','user'],
            notes: 'Returns user information',
            auth:false
        }
    },
    {
        path: '/users/update/password/{id}',
        method: 'PUT',
        config: {
            handler: UserController.updatePassword,
            validate:{
                params:Joi.object().keys({
                    id:Joi.string().required()
                }),
                payload:Joi.object().keys({
                    newPassword:Joi.string().required(),
                    oldPassword:Joi.string().required()
                }),
                headers:Joi.object({
                    'authorization':Joi.string().required()
                }).unknown()
            },
            description: 'Update password.',
            tags: ['api','Users'],
            notes: 'Update password.',
            auth:false
        }
    },
    {
        path: '/users/send/mail',
        method: 'POST',
        config: {
            handler: UserController.sentMailForgetPassword,
            validate:{
                payload:Joi.object().keys({
                    email:Joi.string().optional()
                })
            },
            description: 'send mail information',
            tags: ['api','Users'],
            notes: 'returns success or failure sending mail',
            auth:false
        }
    },
    {
        path: '/users/otp/verification',
        method: 'POST',
        config: {
            handler: UserController.otpVerification,
            validate:{
                payload:Joi.object().keys({
                    otp:Joi.string().required()
                }),
                headers:Joi.object({
                    'authorization':Joi.string().required()
                }).unknown()
            },
            description: 'enter otp for verification',
            tags: ['api','Users'],
            notes: 'returns otp matched or mismatched.',
            auth:false
        }
    },
    {
        path: '/users/reset/password',
        method: 'POST',
        config: {
            handler: UserController.resetPassword,
            validate:{
                payload:Joi.object().keys({
                    newPassword:Joi.string().required()
                }),
                headers:Joi.object({
                    'authorization':Joi.string().required()
                }).unknown()
            },
            description: 'enter newPassword',
            tags: ['api','Users'],
            notes: 'returns password changed or not.',
            auth:false
        }
    }
];

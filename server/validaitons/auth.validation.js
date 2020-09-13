'use strict'

// Dependancies
var Joi = require('@hapi/joi');

// API 2.1:
exports.login = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(30),
        type: Joi.string().regex(/^(dias|del)/).required()
    })
};

// API 2.2:
exports.changePassword = {
    body: Joi.object({
        type: Joi.string().regex(/^(dias|del)/).required(),
        oldPassword: Joi.string().min(8).max(30),
        newPassword: Joi.string().min(8).max(30)
    })
};
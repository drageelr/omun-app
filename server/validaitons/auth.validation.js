'use strict'

// Dependancies
var Joi = require('@hapi/joi');

// API 1.1:
exports.login = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(30),
        type: Joi.string().regex(/^(dias|del)/).required()
    })
};

// API 1.2:
exports.addUsers = {
    body: Joi.object({
        users: Joi.array().items(Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            country: Joi.string(),
            committee: Joi.string(),
        }).required())
    })
};

// API 1.3:
exports.changePassword = {
    body: Joi.object({
        oldPassword: Joi.string().min(8).max(30),
        newPassword: Joi.string().min(8).max(30)
    })
};
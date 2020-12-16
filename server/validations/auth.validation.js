'use strict'

// Dependancies
var Joi = require('@hapi/joi');

// API 1.1:
exports.login = {
    body: Joi.object({
        email: Joi.string().email().max(50).required(),
        password: Joi.string().min(8).max(30).required()
    })
};
'use strict'

// Dependancies
var Joi = require('@hapi/joi');

// API 1.1:
exports.createAdmin = {
    body: Joi.object({
        admins: Joi.array().items(Joi.object({
            name: Joi.string().max(50).required(),
            email: Joi.string().email().max(50).required()
        })).required()
    })
};

// API 1.2:
exports.createCommittee = {
    body: Joi.object({
        admins: Joi.array().items(Joi.object({
            name: Joi.string().max(100).required(),
            initials: Joi.string().max(20).required(),
        })).required()
    })
};

// API 1.3:
exports.createCountry = {
    body: Joi.object({
        admins: Joi.array().items(Joi.object({
            name: Joi.string().max(100).required(),
            initials: Joi.string().max(20).required(),
            veto: Joi.boolean().required()
        })).required()
    })
};
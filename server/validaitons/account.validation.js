'use strict'

// Dependancies
var Joi = require('@hapi/joi');

// API 1.1:
exports.addCommittees = {
    body: Joi.object({
        committees: Joi.array().items(Joi.object({
            name: Joi.string().required(),
        }))
    })
};

// API 1.2:
exports.addDias = {
    body: Joi.object({
        dias: Joi.array().items(Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
        }))
    })
};

// API 1.3:
exports.addDelegates = {
    body: Joi.object({
        delegates: Joi.array().items(Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            country: Joi.string().required(),
            committee: Joi.string().required(),
        }))
    })
};
'use strict'

// Dependancies
var Joi = require('@hapi/joi');

// API 2.1:
exports.createAdmin = {
    body: Joi.object({
        admins: Joi.array().items(Joi.object({
            name: Joi.string().max(50).required(),
            email: Joi.string().email().max(50).required()
        })).required()
    })
};

// API 2.2:
exports.createCommittee = {
    body: Joi.object({
        committees: Joi.array().items(Joi.object({
            name: Joi.string().max(100).required(),
            initials: Joi.string().max(20).required(),
        })).required()
    })
};

// API 2.3:
exports.createCountry = {
    body: Joi.object({
        countries: Joi.array().items(Joi.object({
            name: Joi.string().max(100).required(),
            initials: Joi.string().max(20).required(),
            veto: Joi.boolean().required(),
            personality: Joi.bool(),
            imageName: Joi.string().min(1).max(100)
        })).required()
    })
};

// API 2.4:
exports.createDias = {
    body: Joi.object({
        dias: Joi.array().items(Joi.object({
            name: Joi.string().max(50).required(),
            email: Joi.string().email().max(50).required(),
            committeId: Joi.number().required()
        })).required()
    })
};

// API 2.5:
exports.createDelegate = {
    body: Joi.object({
        delegates: Joi.array().items(Joi.object({
            name: Joi.string().max(50).required(),
            email: Joi.string().email().max(50).required(),
            committeId: Joi.number().required(),
            countryId: Joi.number().required()
        })).required()
    })
};

// API 2.6:
exports.changePassword = {
    body: Joi.object({
        oldPassword: Joi.string().min(8).max(30).required(),
        newPassword: Joi.string().min(8).max(30).required()
    })
}

// API 2.7:
exports.fetchAccounts = {
    body: Joi.object({
        accountType: Joi.string().max(10).required(),
        attributes: Joi.array().items(Joi.string()).required()
    })
}
'use strict'

// Dependancies
var Joi = require('@hapi/joi');

// API 3.2:
exports.startSession = {
    body: Joi.object({
        committeeId: Joi.number().required()
    })
};

// API 3.3:
exports.stopSession = {
    body: Joi.object({
        committeeId: Joi.number().required()
    })
};
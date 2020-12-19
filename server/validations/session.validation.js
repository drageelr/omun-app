'use strict'

// Dependancies
var Joi = require('@hapi/joi');

// API 1.1 & API 1.2:
exports.sessionToggle = {
    body: Joi.object({
        committeeId: Joi.number()
    })
};
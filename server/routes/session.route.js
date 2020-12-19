'use strict'

var router = require('express').Router();
var validate = require('express-validation').validate;
var sessionValidation = require('../validations/session.validation');
var sessionController = require('../controllers/session.controller');
var jwt = require('../services/jwt');

// API 1.1: Start Session
router.post(
    '/start',
    validate(sessionValidation.sessionToggle, {keyByField: true}),
    jwt.verfiyUser,
    sessionController.startSession
);

// API 1.2: Stop Session
router.post(
    '/stop',
    validate(sessionValidation.sessionToggle, {keyByField: true}),
    jwt.verfiyUser,
    sessionController.stopSession
);

// Export router
module.exports = router;
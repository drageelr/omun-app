'use strict'

// Dependancies
var router = require('express').Router();
var validate = require('express-validation').validate;
var verifyUser = require('../services/jwt').verfiyUser;
var validateAccess = require('../services/access-validator').validateAccess;
var sessionController = require('../controllers/session.controller');
var sessionValidation = require('../validaitons/session.validation');

// API 3.1 Get Committee List:
router.post(
    '/committee-list',
    verifyUser,
    validateAccess,
    sessionController.getCommitteeList
);

// API 3.2 Start Session:
router.post(
    '/start',
    validate(sessionValidation.startSession, { keyByField: true }),
    verifyUser,
    validateAccess,
    sessionController.startSession
);

// API 3.3 Stop Session:
router.post(
    '/stop',
    validate(sessionValidation.stopSession, { keyByField: true }),
    verifyUser,
    validateAccess,
    sessionController.stopSession
);

module.exports = router;
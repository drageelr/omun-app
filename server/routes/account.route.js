'use strict'

// Dependancies
var router = require('express').Router();
var validate = require('express-validation').validate;
var verifyUser = require('../services/jwt').verfiyUser;
var validateAccess = require('../services/access-validator').validateAccess;
var accountController = require('../controllers/account.controller');
var accountValidation = require('../validaitons/account.validation');

// API 1.1 Add Committee
router.post(
    '/add-committees',
    validate(accountValidation.addCommittees, { keyByField: true }),
    verifyUser,
    validateAccess,
    accountController.addCommittees
);

// API 1.2 Add Dias:
router.post(
    '/add-dias',
    validate(accountValidation.addDias, { keyByField: true }),
    verifyUser,
    validateAccess,
    accountController.addDias
);

// API 1.3 Add Delegates:
router.post(
    '/add-delegates',
    validate(accountValidation.addDelegates, { keyByField: true }),
    verifyUser,
    validateAccess,
    accountController.addDelegates
);

module.exports = router;
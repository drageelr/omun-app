'use strict'

var router = require('express').Router();
var validate = require('express-validation').validate;
var accountValidation = require('../validations/account.validation');
var accountController = require('../controllers/account.controller');
var jwt = require('../services/jwt');

// API 2.1: Create Admins
router.post(
    '/create/admin',
    validate(accountValidation.createAdmin, {keyByField: true}),
    jwt.verfiyUser,
    accountController.createAdmin
);

// API 2.2: Create Committees
router.post(
    '/create/committee',
    validate(accountValidation.createCommittee, {keyByField: true}),
    jwt.verfiyUser,
    accountController.createCommittee
);

// API 2.3: Create Countries
router.post(
    '/create/country',
    validate(accountValidation.createCountry, {keyByField: true}),
    jwt.verfiyUser,
    accountController.createCountry
);

// API 2.4: Create Dias
router.post(
    '/create/dias',
    validate(accountValidation.createDias, {keyByField: true}),
    jwt.verfiyUser,
    accountController.createDias
);

// API 2.5: Create Delegates
router.post(
    '/create/delegate',
    validate(accountValidation.createDelegate, {keyByField: true}),
    jwt.verfiyUser,
    accountController.createDelegate
);

// API 2.6: Change Password
router.post(
    '/change-password',
    validate(accountValidation.changePassword, {keyByField: true}),
    jwt.verfiyUser,
    accountController.changePassword
);

// Export router
module.exports = router;
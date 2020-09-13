'use strict'

// Dependancies
var router = require('express').Router();
var validate = require('express-validation').validate;
var verifyUser = require('../services/jwt').verfiyUser;
var validateAccess = require('../services/access-validator').validateAccess;
var authController = require('../controllers/auth.controller');
var authValidation = require('../validaitons/auth.validation');

// API 2.1 Login:
router.post(
    '/login',
    validate(authValidation.login, { keyByField: true }),
    authController.login
);

// API 2.2 Change Password:
router.post(
    '/change-password',
    validate(authValidation.changePassword, { keyByField: true }),
    verifyUser,
    validateAccess,
    authController.changePassword
);

module.exports = router;
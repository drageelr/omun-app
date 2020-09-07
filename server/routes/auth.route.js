'use strict'

// Dependancies
var router = require('express').Router();
var validate = require('express-validation').validate;
var verifyUser = require('../services/jwt').verfiyUser;
var authController = require('../controllers/auth.controller');
var authValidation = require('../validaitons/auth.validation');

// API 1.1 Login:
router.post(
    '/login',
    validate(authValidation.login, { keyByField: true }),
    // userController.login
);

// API 1.3 Change Password:
router.post(
    '/change-password',
    validate(authValidation.changePassword, { keyByField: true }),
    // verifyUser,
    // userController.changePassword
);

module.exports = router;
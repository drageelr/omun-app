'use strict'

var router = require('express').Router();
var validate = require('express-validation').validate;
var authValidation = require('../validations/auth.validation');
var authController = require('../controllers/auth.controller');

// API 1.1: Admin Login:
router.post(
    '/login/:type',
    validate(authValidation.login, {keyByField: true}),
    authController.login
);

// Export router
module.exports = router;
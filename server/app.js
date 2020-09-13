'use strict'

// Dependancies
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('./services/mongoose');
var { errorHandler } = require('./errors/errorhandler');
var accountRouter = require('./routes/account.route');
var authRouter = require('./routes/auth.route');
var sessionRouter;

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/account', accountRouter);
app.use('/api/auth', authRouter);
app.use('/api/session', sessionRouter);

app.use(errorHandler);

mongoose.connect();

module.exports = app;
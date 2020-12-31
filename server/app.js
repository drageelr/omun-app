'use strict'

// Dependancies
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var { errorHandler } = require('./errors/errorhandler')
var db = require('./services/mysql');

var authRouter = require('./routes/auth.route');
var accountRouter = require('./routes/account.route');
var sessionRouter = require('./routes/session.route');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/account', accountRouter);
app.use('/api/session', sessionRouter);


app.use(errorHandler);

db.con.connect();
db.defaultAdmin();
db.sessionTerminator();

module.exports = app;
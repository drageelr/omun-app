'use strict'

// Dependancies
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { errorHandler } = require('./errors/errorhandler')
var db = require('./services/mysql');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '/public')));

app.use(errorHandler);

db.con.connect();
db.defaultAdmin();

module.exports = app;
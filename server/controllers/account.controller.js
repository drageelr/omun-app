'use strict'

var db = require('../services/mysql');
var httpStatus = require('../services/http-status');
var customError = require('../errors/errors');
var hFuncs = require('../services/helper-funcs');
var { generate } = require('generate-password');
var { sendWelcomeEmail } = require('../services/nodemailer');

function genPass() {
    return generate({
        length: 10,
        numbers: true,
        symbols: false,
        lowercase: true,
        uppercase: true,
        excludeSimilarCharacters: true,
        strict: true
    });
}

exports.createAdmin = async (req, res, next) => {
    try {
        let params = req.body;

        if (params.user.type != "admin") { throw new customError.ForbiddenAccessError("you can't access this api"); }

        let queryStr = 'INSERT INTO admin (name, email, password) VALUES ';
        let valueStr = '';
        for (let i = 0; i < params.admins.length; i++) {
            if (valueStr != '') { valueStr += ', '; }
            params.admins[i].password = genPass()
            valueStr += '("' + params.admins[i].name + '", "' + params.admins[i].email + '", "' + hFuncs.hash(params.admins[i].password) + '")';
        }

        if (valueStr == '') { throw new customError.ValidationError("no data sent"); }

        let result = await db.query(queryStr + valueStr);

        let ids = [];
        for (let i = 0; i < params.admins.length; i++) {
            ids.push(result.insertId + i);
            sendWelcomeEmail(admins[i].email, admins[i].name, admins[i].password);
        }

        res.json({
            statusCode: 200,
            statusName: httpStatus.getName(200),
            message: "Admin(s) Created Successfully!",
            ids: ids
        });

    } catch(err) {
        next(err);
    }
}

exports.createCommittee = async (req, res, next) => {
    try {
        let params = req.body;

        if (params.user.type != "admin") { throw new customError.ForbiddenAccessError("you can't access this api"); }

        let queryStr = 'INSERT INTO committee (name, initials) VALUES ';
        let valueStr = '';
        for (let i = 0; i < params.committees.length; i++) {
            if (valueStr != '') { valueStr += ', '; }
            valueStr += '("' + params.committees[i].name + '", "' + params.committees[i].initials + '")';
        }

        if (valueStr == '') { throw new customError.ValidationError("no data sent"); }

        let result = await db.query(queryStr + valueStr);

        let ids = [];
        for (let i = 0; i < params.committees.length; i++) {
            ids.push(result.insertId + i);
        }

        res.json({
            statusCode: 200,
            statusName: httpStatus.getName(200),
            message: "Committee(s) Created Successfully!",
            ids: ids
        });

    } catch(err) {
        next(err);
    }
}

exports.createCountry = async (req, res, next) => {
    try {
        let params = req.body;

        if (params.user.type != "admin") { throw new customError.ForbiddenAccessError("you can't access this api"); }

        let queryStr = 'INSERT INTO country (name, initials, veto) VALUES ';
        let valueStr = '';
        for (let i = 0; i < params.countries.length; i++) {
            if (valueStr != '') { valueStr += ', '; }
            valueStr += '("' + params.countries[i].name + '", "' + params.countries[i].initials + '", ' + params.countries[i].veto + ')';
        }

        if (valueStr == '') { throw new customError.ValidationError("no data sent"); }

        let result = await db.query(queryStr + valueStr);

        let ids = [];
        for (let i = 0; i < params.countries.length; i++) {
            ids.push(result.insertId + i);
        }

        res.json({
            statusCode: 200,
            statusName: httpStatus.getName(200),
            message: "Country(s) Created Successfully!",
            ids: ids
        });

    } catch(err) {
        next(err);
    }
}

exports.createDias = async (req, res, next) => {
    try {
        let params = req.body;

        if (params.user.type != "admin") { throw new customError.ForbiddenAccessError("you can't access this api"); }

        let queryStr = 'INSERT INTO dias (name, email, password, committeeId) VALUES ';
        let valueStr = '';
        for (let i = 0; i < params.dias.length; i++) {
            if (valueStr != '') { valueStr += ', '; }
            params.dias[i].password = genPass()
            valueStr += '("' + params.dias[i].name + '", "' + params.dias[i].email + '", "' + hFuncs.hash(params.dias[i].password) + '", ' + params.dias[i].committeeId + ')';
        }

        if (valueStr == '') { throw new customError.ValidationError("no data sent"); }

        let result = await db.query(queryStr + valueStr);

        let ids = [];
        for (let i = 0; i < params.dias.length; i++) {
            ids.push(result.insertId + i);
            sendWelcomeEmail(dias[i].email, dias[i].name, dias[i].password);
        }

        res.json({
            statusCode: 200,
            statusName: httpStatus.getName(200),
            message: "Dias(s) Created Successfully!",
            ids: ids
        });

    } catch(err) {
        next(err);
    }
}

exports.createDelegate = async (req, res, next) => {
    try {
        let params = req.body;

        if (params.user.type != "admin") { throw new customError.ForbiddenAccessError("you can't access this api"); }

        let queryStr = 'INSERT INTO delegate (name, email, password, committeeId, countryId) VALUES ';
        let valueStr = '';
        for (let i = 0; i < params.delegates.length; i++) {
            if (valueStr != '') { valueStr += ', '; }
            params.delegates[i].password = genPass()
            valueStr += '("' + params.delegates[i].name + '", "' + params.delegates[i].email + '", "' + hFuncs.hash(params.delegates[i].password) + '", ' + params.delegates[i].committeeId + ', ' + params.delegates[i].countryId + ')';
        }

        if (valueStr == '') { throw new customError.ValidationError("no data sent"); }

        let result = await db.query(queryStr + valueStr);

        let ids = [];
        for (let i = 0; i < params.delegates.length; i++) {
            ids.push(result.insertId + i);
            sendWelcomeEmail(delegates[i].email, delegates[i].name, delegates[i].password);
        }

        res.json({
            statusCode: 200,
            statusName: httpStatus.getName(200),
            message: "Delegate(s) Created Successfully!",
            ids: ids
        });
        
    } catch(err) {
        next(err);
    }
}

exports.changePassword = async (req, res, next) => {
    try {
        let params = req.body;

        let checkQuery = 'SELECT * FROM ' + params.user.type + ' WHERE id = ' + params.user.id + ' AND password = "' + hFuncs.hash(params.oldPassword) + '"';
        let checkResult = await db.query(checkQuery);
        if (!checkResult.length) { throw new customError.ValidationError("invalid old password"); }

        await db.query('UPDATE ' + params.user.type + ' SET password = "' + hFuncs.hash(params.newPassword) + '" WHERE id = ' + params.user.id);

        res.json({
            statusCode: 200,
            statusName: httpStatus.getName(200),
            message: "Password Changed Successfully!"
        })

    } catch (err) {
        next(err);
    }
}
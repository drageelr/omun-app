'use strict'

var db = require('../services/mysql');
var httpStatus = require('../services/http-status');
var customError = require('../errors/errors');
var hFuncs = require('../services/helper-funcs');
var { generate } = require('generate-password');
var { sendWelcomeEmail } = require('../services/nodemailer');
var fs = require('fs');
var path = require('path');
var util = require('util');
const {default: PQueue} = require('p-queue');

let emailQueue = new PQueue({concurrency: 1});

let appendFile = util.promisify(fs.appendFile);

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
        let csvData = "";
        for (let i = 0; i < params.admins.length; i++) {
            ids.push(result.insertId + i);
            csvData += ids[i] + ',' + params.admins[i].name + ',' + params.admins[i].email + ',' + params.admins[i].password + '\n';
            // sendWelcomeEmail(params.admins[i].email, params.admins[i].name, params.admins[i].password, "Admin");
            emailQueue.add(async () => { await sendWelcomeEmail(params.admins[i].email, params.admins[i].name, params.admins[i].password, "Admin") });
        }

        await appendFile(path.join(__dirname, '../files/admins.csv'), csvData);

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

        let queryStr = 'INSERT INTO country (name, initials, veto, personality, imageName) VALUES ';
        let valueStr = '';
        for (let i = 0; i < params.countries.length; i++) {
            if (valueStr != '') { valueStr += ', '; }
            if (!params.countries[i].personality) { params.countries[i].personality = 0; }
            valueStr += '("' + params.countries[i].name + '", "' + params.countries[i].initials + '", ' + params.countries[i].veto + ', ' + params.countries[i].personality + ', ';
            if (!params.countries[i].imageName) {
                valueStr += 'null)';
            } else {
                valueStr += '"' + params.countries[i].imageName + '")';
            }
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

        let queryStr = 'INSERT INTO dias (name, email, title, password, committeeId) VALUES ';
        let valueStr = '';
        for (let i = 0; i < params.dias.length; i++) {
            if (valueStr != '') { valueStr += ', '; }
            params.dias[i].password = genPass()
            console.log("dias", params.dias[i].email, params.dias[i].password);
            valueStr += '("' + params.dias[i].name + '", "' + params.dias[i].email +  '", "' + params.dias[i].title + '", "' + hFuncs.hash(params.dias[i].password) + '", ' + params.dias[i].committeeId + ')';
        }

        if (valueStr == '') { throw new customError.ValidationError("no data sent"); }

        let result = await db.query(queryStr + valueStr);

        let ids = [];
        let csvData = "";
        for (let i = 0; i < params.dias.length; i++) {
            ids.push(result.insertId + i);
            csvData += ids[i] + ',' + params.dias[i].name + ',' + params.dias[i].email + ',' + params.dias[i].password + '\n';
            // sendWelcomeEmail(params.dias[i].email, params.dias[i].name, params.dias[i].password, "Dais");
            emailQueue.add(async () => { await sendWelcomeEmail(params.dias[i].email, params.dias[i].name, params.dias[i].password, "Dais") });
        }

        await appendFile(path.join(__dirname, '../files/dias.csv'), csvData);

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
            console.log("delegate", params.delegates[i].email, params.delegates[i].password);
            valueStr += '("' + params.delegates[i].name + '", "' + params.delegates[i].email + '", "' + hFuncs.hash(params.delegates[i].password) + '", ' + params.delegates[i].committeeId + ', ' + params.delegates[i].countryId + ')';
        }

        if (valueStr == '') { throw new customError.ValidationError("no data sent"); }

        let result = await db.query(queryStr + valueStr);

        let ids = [];
        let csvData = "";

        for (let i = 0; i < params.delegates.length; i++) {
            ids.push(result.insertId + i);
            csvData += ids[i] + ',' + params.delegates[i].name + ',' + params.delegates[i].email + ',' + params.delegates[i].password + '\n';
            // sendWelcomeEmail(params.delegates[i].email, params.delegates[i].name, params.delegates[i].password, "Delegate");
            emailQueue.add(async () => { await sendWelcomeEmail(params.delegates[i].email, params.delegates[i].name, params.delegates[i].password, "Delegate") });
        }

        await appendFile(path.join(__dirname, '../files/delegates.csv'), csvData);

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

exports.fetchAccounts = async (req, res, next) => {
    try {
        let params = req.body;

        if (params.user.type != "admin") { throw new customError.ForbiddenAccessError("you can't access this api"); }
        
        const accountTypes = ["delegate","admin","dias","country","committee"];
        if (!accountTypes.includes(params.accountType)) { throw new customError.ValidationError("invalid account type"); }
        
        let queryStr = `SELECT ${params.attributes.join(',')} FROM ${params.accountType}`;
        
        let result = await db.query(queryStr);
        
        let tabulatedData = result.map((item, i) => {
            let row = []
            params.attributes.forEach((attr) => {
                row.push(item[attr])
            })
            return row
        })

        res.json({
            statusCode: 200,
            statusName: httpStatus.getName(200),
            message: `${params.accountType}(s) Fetched Successfully!`,
            data: tabulatedData
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
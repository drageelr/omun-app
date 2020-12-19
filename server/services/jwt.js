'use strict'

// Dependancies
var jwt = require('jsonwebtoken');
var config = require('../config/config').vars;
var customError = require('../errors/errors');
var db = require('./mysql');

exports.signUser = (id, type, expiry) => {
    return jwt.sign({_id: id, type: type}, config.key, {expiresIn: expiry});
}

function decodeToken(token) {
    try {
        return jwt.verify(token, config.key);
    } catch(e) {
        return {err: e};
    }
}

exports.verfiyUser = async (req, res, next) => {
    try {
        let token = req.get("Authorization");
        if (token) {
            token = token.substring(7);
        } else {
            throw new customError.ForbiddenAccessError("no token given");
        }

        let decodedObj = decodeToken(token);
        if(decodedObj.err) throw new customError.ForbiddenAccessError("invalid token");

        let reqUser = await db.query('SELECT * FROM ' + decodedObj.type + ' WHERE id = ' + decodedObj.id + ' AND active = 1');
        if (!reqUser.length) {
            throw new customError.ForbiddenAccessError("invalid token");
        } else {
            req.body.user = decodedObj;
        }

        next();
    } catch(e) {
        next(e);
    }
}

module.exports.decodeToken = decodeToken;
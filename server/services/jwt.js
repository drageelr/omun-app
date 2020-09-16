'use strict'

// Dependancies
var jwt = require('jsonwebtoken');
var config = require('../config/config').vars;
var customError = require('../errors/errors');
var Dias = require('../models/dias.model');
var Delegate = require('../models/delegate.model');
var Admin = require('../models/admin.model');

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

        let reqUser = null;
        if (decodedObj.type == 'dias') {
            reqUser = await Dias.findById(decodedObj._id);
        } else if (decodedObj.type == 'del') {
            reqUser = await Delegate.findById(decodedObj._id);
        } else if (decodedObj.type == 'admin') {
            reqUser = await Admin.findById(decodedObj._id);
        }
        
        if (reqUser) {
            req.body.user = decodedObj;
        } else {
            throw new customError.ForbiddenAccessError("invalid token");
        }

        next();
    } catch(e) {
        next(e);
    }
}

module.exports.decodeToken = decodeToken;
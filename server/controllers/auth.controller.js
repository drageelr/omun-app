'use strict'

// Dependancies
var jwt = require('../services/jwt');
var httpStatus = require('../services/http-status');
var customError = require('../errors/errors');
var Dias = require('../models/dias.model');
var Delegate = require('../models/delegate.model');
var Admin = require('../models/admin.model');

exports.login = async (req, res, next) => {
    try {
        let params = req.body;

        let reqUser = null;
        if (params.type == 'dias') {
            reqUser = await Dias.findOne({email: params.email, password: params.password}, 'name');
        } else if (params.type == 'del') {
            reqUser = await Delegate.findOne({email: params.email, password: params.password}, 'name');
        } else if (params.type == 'admin') {
            reqUser = await Admin.findOne({email: params.email, password: params.password}, 'name');
        }

        if (!reqUser) throw new customError.AuthenticationError("invalid username or password");

        let token = jwt.signUser(reqUser._id, params.type, '1d');

        res.json({
            statusCode: 200,
            statusName: httpStatus.getName(200),
            message: "Login Successful!",
            name: reqUser.name,
            token: token
        });
    } catch(e) {
        next(e);
    }
}

exports.changePassword = async (req, res, next) => {
    try {
        let params = req.body;

        let reqUser = null;

        if (params.user.type == 'dias') {
            reqUser = await Dias.findById(params.user._id, 'password');
        } else if (params.type == 'del') {
            reqUser = await Delegate.findById(params.user._id, 'password');
        } else if (params.type == 'admin') {
            reqUser = await Admin.findById(params.user._id, 'password');
        }

        if (reqUser.password != params.oldPassword) throw new customError.AuthenticationError("invalid oldPassword");

        await reqUser.update({password: params.newPassword});

        res.json({
            statusCode: 203,
            statusName: httpStatus.getName(203),
            message: "Password Changed Successfully!"
        });
    } catch(e) {
        next(e);
    }
}
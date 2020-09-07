'use strict'

// Dependancies
var jwt = require('../services/jwt');
var httpStatus = require('../services/http-status');
var customError = require('../errors/errors');


exports.login = async (req, res, next) => {
    try {
        let params = req.body;

        let reqUser = null;
        if (params.type == 'dias') {
            
        }

        let reqUser = await User.findOne({email: params.email, password: params.password});
        if (!reqUser) throw new customError.AuthenticationError("invalid username or password");

        let token = jwt.signUser(reqUser._id, '1h');

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

        let reqUser = await User.findById(params._id, 'password');
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
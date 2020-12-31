'use strict'

var db = require('../services/mysql');
var jwt = require('../services/jwt');
var httpStatus = require('../services/http-status');
var customError = require('../errors/errors');
var hFuncs = require('../services/helper-funcs');

exports.login = async (req, res, next) => {
    try {
        let params = req.body;
        let rParams = req.params;

        if (rParams.type != 'admin' && rParams.type != 'delegate' && rParams.type != 'dias') { throw new customError.NotFoundError("invalid route"); }

        let reqUser = await db.query('SELECT * FROM ' + rParams.type + ' WHERE email = "' + params.email + '" AND password = "' + hFuncs.hash(params.password) + '"');
        if (!reqUser.length) { throw new customError.AuthenticationError("invalid credentials"); }
        if (!reqUser[0].active) { throw new customError.AuthenticationError("account not active"); }

        let token = jwt.signUser(reqUser[0].id, rParams.type);
        
        let user = {
            id: reqUser[0].id,
            name: reqUser[0].name
        };

        if (rParams.type == 'dias' || rParams.type == 'delegate') {
            user.committeeId = reqUser[0].committeeId;
        }

        res.json({
            statusCode: 200,
            statusName: httpStatus.getName(200),
            message: "Login Successful!",
            token: token,
            user 
        });

    } catch(err) {
        next(err);
    }
}
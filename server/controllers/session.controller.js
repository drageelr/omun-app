'use strict'

var db = require('../services/mysql');
var jwt = require('../services/jwt');
var httpStatus = require('../services/http-status');
var customError = require('../errors/errors');
var hFuncs = require('../services/helper-funcs');

exports.startSession = async (req, res, next) => {
    try {
        let params = req.body;

        if (params.user.type != 'admin' && params.user.type != 'dias') { throw new customError.ForbiddenAccessError("you are not allowed to access this api"); }

        let committeeId = params.committeeId;
        if (params.user.type == 'dias') {
            let reqDias = await db.query('SELECT committeeId FROM dias WHERE id = ' + params.user.id);
            committeeId = reqDias[0].committeeId;
        }

        

    } catch (err) {
        next(err);
    }
}

exports.stopSession = async (req, res, next) => {
    try {
        let params = req.body;

    } catch (err) {
        next(err);
    }
}
'use strict'

var db = require('../services/mysql');
var jwt = require('../services/jwt');
var httpStatus = require('../services/http-status');
var customError = require('../errors/errors');
var hFuncs = require('../services/helper-funcs');
var { createNameSpace, stopNameSpace } = require('../services/socketIO/socketIO');

exports.startSession = async (req, res, next) => {
    try {
        let params = req.body;

        if (params.user.type != 'admin' && params.user.type != 'dias') { throw new customError.ForbiddenAccessError("you are not allowed to access this api"); }

        let committeeId = params.committeeId;
        if (params.user.type == 'dias') {
            let reqDias = await db.query('SELECT committeeId FROM dias WHERE id = ' + params.user.id);
            committeeId = reqDias[0].committeeId;
        }

        let sessionCheck = await db.query('SELECT * FROM session WHERE active = 1 AND committeeId = ' + committeeId);
        if (sessionCheck.length) { throw new customError.DuplicateResourceError("a session is already running for this committee"); }

        await db.query('INSERT INTO session (active, committeeId, type) VALUES (1, ' + committeeId + ', "IDLE")');
        
        let err = createNameSpace(committeeId);
        if (err) { throw err; }
        
        res.json({
            statusCode: 200,
            statusName: httpStatus.getName(200),
            message: "Session Started Successfully!"
        });

    } catch (err) {
        next(err);
    }
}

exports.stopSession = async (req, res, next) => {
    try {
        let params = req.body;

        if (params.user.type != 'admin' && params.user.type != 'dias') { throw new customError.ForbiddenAccessError("you are not allowed to access this api"); }

        let committeeId = params.committeeId;
        if (params.user.type == 'dias') {
            let reqDias = await db.query('SELECT committeeId FROM dias WHERE id = ' + params.user.id);
            committeeId = reqDias[0].committeeId;
        }

        let err = await stopNameSpace(committeeId);
        if (err) { throw err; }

        res.json({
            statusCode: 200,
            statusName: httpStatus.getName(200),
            message: "Session Stoped Successfully!",
        });

    } catch (err) {
        next(err);
    }
}

exports.joinSession = async (req, res, next) => {
    try {
        let params = req.body;

        let committeeId = params.committeeId;
        if (params.user.type !== 'admin') {
            let reqDias = await db.query('SELECT committeeId FROM ' + params.user.type + ' WHERE id = ' + params.user.id);
            committeeId = reqDias[0].committeeId;
        }

        let reqSession = await db.query('SELECT id FROM session WHERE active = 1 AND committeeId = ' + committeeId);

        if (!reqSession.length) { throw new customError.NotFoundError("committe session is not in progress"); }

        res.json({
            statusCode: 200,
            statusName: httpStatus.getName(200),
            message: "Session " + reqSession[0].id + " is in progress!",
            sessionId: reqSession[0].id
        });

    } catch (err) {
        next(err);
    }
}
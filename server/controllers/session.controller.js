'use strict'

var httpStatus = require('../services/http-status');
var customError = require('../errors/errors');
var hFuncs = require('../services/helper-funcs');
var Committee = require('../models/committee.model');

exports.getCommitteeList = async (req, res, next) => {
    try {
        let reqCommittees = await Committee.find({}, 'committeeId name sessionStatus')
    
        if (!reqCommittees.length) { throw new customError.NotFoundError("no committees found") }

        let committees = [];
        for (let i = 0; i < reqCommittees.length; i++) {
            committees.push(hFuncs.duplicateObject(reqCommittees[i], ["committeeId", "name", "sessionStatus"]));
        }

        res.json({
            statusCode: 200,
            statusName: httpStatus.getName(200),
            message: "Committees Fetched Successfuly!",
            committees: committees
        });
    } catch (e) {
        next(e)
    }
}

exports.startSession = async (req, res, next) => {
    try {
        let committeeId = req.body.committeeId;

        let reqCommittee = await Committee.findOne({committeeId: committeeId}, '_id');

        if (!reqCommittee) {throw new customError.NotFoundError("committee not found") }

        await Committee.findByIdAndUpdate({_id: reqCommittee._id}, {sessionStatus: true});

        res.json({
            statusCode: 200,
            statusName: httpStatus.getName(200),
            message: "Session Started Successfuly"
        })
    } catch(e) {
        next(e);
    }
}

exports.stopSession = async (req, res, next) => {
    try {
        let committeeId = req.body.committeeId;

        let reqCommittee = await Committee.findOne({committeeId: committeeId}, '_id');

        if (!reqCommittee) {throw new customError.NotFoundError("committee not found") }

        await Committee.findByIdAndUpdate({_id: reqCommittee._id}, {sessionStatus: false});

        res.json({
            statusCode: 200,
            statusName: httpStatus.getName(200),
            message: "Session Stoped Successfuly"
        })
    } catch(e) {
        next(e);
    }
}
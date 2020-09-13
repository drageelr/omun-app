'use strict'

// Dependancies
var jwt = require('../services/jwt');
var httpStatus = require('../services/http-status');
var customError = require('../errors/errors');
var { sendWelcomeEmail } = require('../services/nodemailer');
var { generate } = require('generate-password');
var Dias = require('../models/dias.model');
var Delegate = require('../models/delegate.model');
var Committee = require('../models/committee.model');

function genPass() {
    return generate({
        length: 30,
        numbers: true,
        symbols: true,
        lowercase: true,
        uppercase: true,
        excludeSimilarCharacters: true,
        strict: true
    });
}

exports.addCommittees = async (req, res, next) => {
    try {
        let committees = req.body.committees;

        for(let i = 0; i < committees.length; i++) {
            let newCom = new Committee({
                name: committees[i].name
            });

            await newCom.save();
        }

        res.json({
            statusCode: 200,
            statusName: httpStatus.getName(200),
            message: "Add Committees Successful!",
        })
    } catch(e) {
        next(e);
    }
}

exports.addDias = async (req, res, next) => {
    try {
        let dias = req.body.dias;

        for(let i = 0; i < dias.length; i++) {
            let pass = genPass();
            
            let newDias = new Dias({
                email: dias[i].email,
                name: dias[i].name,
                password: pass
            });

            await newDias.save();
        
            sendWelcomeEmail(dias[i].email, dias[i].name, pass);
        }

        res.json({
            statusCode: 200,
            statusName: httpStatus.getName(200),
            message: "Add Dias Successful!",
        });
    } catch(e) {
        next(e);
    }
}

exports.addDelegates = async (req, res, next) => {
    try {
        let delegates = req.body.delegates;

        for(let i = 0; i < delegates.length; i++) {
            let cmt = await Committee.findOne({name: delegates[i].committee}, '_id');

            if (!cmt) throw new customError.ValidationError("committee with name '" + delegates[i].committee + "' does not exist");
            
            let pass = genPass();

            let newDelegate = new Delegate({
                email: delegates[i].email,
                name: delegates[i].name,
                password: pass,
                country: delegates[i].country,
                committeeId: cmt._id
            });

            await newDelegate.save();

            sendWelcomeEmail(delegates[i].email, delegates[i].name, pass);
        }

        res.json({
            statusCode: 200,
            statusName: httpStatus.getName(200),
            message: "Add Delegates Successful!",
        });
    } catch(e) {
        next(e);
    }
}
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
var Admin = require('../models/admin.model');
var hFuncs = require('../services/helper-funcs');

function genPass() {
    return generate({
        length: 30,
        numbers: true,
        symbols: false,
        lowercase: true,
        uppercase: true,
        excludeSimilarCharacters: true,
        strict: true
    });
}

function createSeats(n) {
    let seats = [];
    for (let i = 0; i < n; i++) {
        let seat = {
            seatId: i + 1,
            blocked: false,
            delegateId: -1,
        };

        seats.push(seat);
    }
    return seats;
}

exports.addCommittees = async (req, res, next) => {
    try {
        let committees = req.body.committees;

        let seats = createSeats(50);

        for(let i = 0; i < committees.length; i++) {
            let newCom = new Committee({
                name: committees[i],
                sessionStatus: false,
                seats: seats,
                logs: [{content: hFuncs.createLog("System", "Committee created.")}]
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
                committeeId: cmt._id,
                blockId: -1
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

exports.defaultAdmin = async () => {
    try {
        let reqAdmin = await Admin.findOne({});
        if (!reqAdmin) {
            reqAdmin = new Admin({
                email: "admin123@omunapp.com",
                name: "OMUN Admin",
                password: "Admin12345"
            });

            reqAdmin.save();
            console.log("New Admin: admin123@omunapp.com Admin12345");
        }
    } catch (e) {
        console.log(e);
    }
}
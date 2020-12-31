'use strict'

var db = require('../mysql');
var jwt = require('../jwt');
var customError = require('../../errors/errors');
var hFuncs = require('../helper-funcs');
var { errorHandler } = require('./socketIOerrorhandler');
var { validate } = require('./socketIOvalidator');
var { validateAccess } = require('./socketIOaccessvalidator');
var IOreqhandlers = require('./socketIOreqhandlers');
const { namespaceUsers } = require('./socketIOusers');
const { all } = require('../../app');

const reqEvents = {
    // Chat Management
    'del-chat-fetch|DEL': IOreqhandlers.handleDelChatFetchForDel,
    'del-chat-fetch': IOreqhandlers.handleDelChatFetchForRest,
    'dias-chat-fetch|DEL': IOreqhandlers.handleDiasChatFetchForDel,
    'dias-chat-fetch|DIAS': IOreqhandlers.handleDiasChatFetchForDias,
    'del-chat-send': IOreqhandlers.handleDelChatSend,
    'dias-chat-send': IOreqhandlers.handleDiasChatSend,

    // Log & Notification Management
    'log-fetch': IOreqhandlers.handleLogFetch,
    'notif-fetch': IOreqhandlers.handleNotificationFetch,
    'notif-send': IOreqhandlers.handleNotificationSend,

    // Seat Management
    'seat-sit': IOreqhandlers.handleSeatSit,
    'seat-unsit': IOreqhandlers.handleSeatUnSit,
    'seat-placard': IOreqhandlers.handleSeatPlacard,

    // MOD & GSL Management
    'topic-create': IOreqhandlers.handleTopicCreate,
    'topic-edit': IOreqhandlers.handleTopicEdit,
    'topic-fetch': IOreqhandlers.handleTopicFetch,
    'topic-speaker-create': IOreqhandlers.handleTopicSpeakerCreate,
    'topic-speaker-edit': IOreqhandlers.handleTopicSpeakerEdit,
    'topic-speaker-fetch': IOreqhandlers.handleTopicSpeakerFetch,
    'gsl-create': IOreqhandlers.handleGSLCreate,
    'gsl-edit': IOreqhandlers.handleGSLEdit,
    'gsl-fetch': IOreqhandlers.handleGSLFetch,

    // Session Management
    'session-edit': IOreqhandlers.handleSessionEdit
};

async function sendStartInfo(socket) {
    try {        
        let user = socket.userObj;
        
        var { io } = require('../../bin/www');
        let nsp = io.of("/" + user.committeeId);

        let reqCommittee = await db.query('SELECT * FROM committee WHERE id = ' + user.committeeId);
        if (!reqCommittee.length) { throw new customError.NotFoundError("committee not found"); }

        let reqSession = await db.query('SELECT * FROM session WHERE committeeId = ' + user.committeeId + ' AND active = 1 AND id = ' + user.sessionId);
        if (!reqSession.length) { throw new customError.NotFoundError("active session not found"); }

        let reqSeats = await db.query('SELECT * FROM seat WHERE committeeId = ' + user.committeeId + ' ORDER BY id');

        let allDelegates = await db.query('SELECT * FROM delegate WHERE committeeId = ' + user.committeeId);

        let allDias = await db.query('SELECT * FROM dias WHERE committeeId = ' + user.committeeId);

        let allCountries = await db.query('SELECT * FROM country');

        // let reqNotifications = db.query('SELECT * FROM notification WHERE committeeId = ' + user.committeeId + ' sessionId = ' + user.sessionId + ' ORDER BY id');


        // await Promise.all([reqSeats, allDelegates, allCountries, /*reqNotifications,*/ allDias]);

        let committee = {
            id: reqCommittee[0].id,
            name: reqCommittee[0].name,
            intials: reqCommittee[0].intials
        }

        let session = {
            id: reqSession[0].id,
            topicId: reqSession[0].topicId,
            speakerId: reqSession[0].speakerId,
            speakerTime: reqSession[0].speakerTime,
            topicTime: reqSession[0].topicTime,
            type: reqSession[0].type
        }

        let seats = [];
        for (let i = 0; i < reqSeats.length; i++) {
            seats.push(hFuncs.duplicateObject(reqSeats[i], ['id', 'delegateId', 'placard']));
        }

        let delegates = [];
        for (let i = 0; i < allDelegates.length; i++) {
            delegates.push(hFuncs.duplicateObject(allDelegates[i], ['id', 'countryId']));
        }

        let dias = [];
        for (let i = 0; i < allDias.length; i++) {
            dias.push(hFuncs.duplicateObject(allDias[i], ['id', 'name', 'title']));
        }

        let countries = [];
        for (let i = 0; i < allCountries.length; i++) {
            countries.push(hFuncs.duplicateObject(allCountries[i], ['id', 'name', 'initials']));
        }

        let connectedDelegates = [];
        let conDel = [];
        if (namespaceUsers[nsp.name].delegate){
            conDel = Object.keys(namespaceUsers[nsp.name].delegate);
        }

        for (let i = 0; i < conDel.length; i++) {
            connectedDelegates.push(conDel[i]);
        }

        let connectedAdmins = [];
        let conAdmins = [];
        if (namespaceUsers[nsp.name].admin) {
            conAdmins = Object.values(namespaceUsers[nsp.name].admin);
        }
        
        for (let i = 0; i < conAdmins.length; i++) {
            let userDetails = nsp.sockets.get(conAdmins[i]).userObj;
            connectedAdmins.push(hFuncs.duplicateObject(userDetails, ['id', 'name']));
        }

        let connectedDias = [];
        let conDias = [];
        if (namespaceUsers[nsp.name].dias) {
            conDias = Object.keys(namespaceUsers[nsp.name].dias);
        }
        
        for (let i = 0; i < conDias.length; i++) {
            connectedDias.push(conDias[i]);
        }


        // let notifications = [];
        // for (let i = 0; i < reqNotifications.length; i++) {
        //     notifications.push(hFuncs.duplicateObject(reqNotifications[i], ['id', 'message', 'timestamp']));
        // }

        let resObj = {
            committee: committee,
            session: session,
            seats: seats,
            delegates: delegates,
            dias: dias,
            countries: countries,
            connectedDelegates: connectedDelegates,
            connectedAdmins: connectedAdmins,
            connectedDias: connectedDias,
            // notifications: notifications
        }

        // let logs = [];
        // if (user.type != 'delegate') {
        //     for (let i = 0; i < reqLogs.length; i++) {
        //         logs.push(reqLogs[i], ['id', 'message', 'timestamp']);
        //     }
        //     resObj.logs = logs;
        // }
        socket.emit('RES|info-start', resObj);
        
    } catch (err) {
        errorHandler(socket, err);
    }
}

function generateEventListener(socket, event) {
    let tempFunc = async (params) => {
        try {
            let accErr = validateAccess(event, socket.userObj.type);
            if (accErr) { throw accErr; }

            let valErr = validate(event, params);
            if (valErr) { throw valErr; }

            let [ res, procErr ] = await reqEvents[event](socket, params, event);
            if (procErr) { throw procErr; }

            if (res) {
                socket.emit('RES|' + event, res);
            }
        } catch (err) {
            errorHandler(socket, err);
        }
    }
    return tempFunc;
}

function attachEventListeners(socket) {
    for (let e in reqEvents) {
        socket.on('REQ|' + e, generateEventListener(socket, e));
    }
}

function createNameSpace(committeeId) {
    try {
        let namespaces = Object.keys(namespaceUsers);

        for (let i = 0; i < namespaces.length; i++) {
            if (namespaces[i] == "/" + committeeId) { throw new customError.DuplicateResourceError("committee session already in progress"); }
        }

        namespaceUsers["/" + committeeId] = {};
        
        var { io } = require('../../bin/www');
        let nsp = io.of("/" + committeeId);

        nsp.on('connection', async socket => {
            try {
                let token = socket.handshake.query.token;
                if (!token) { throw new customError.AuthenticationError("no token supplied"); }

                let userObj = jwt.decodeToken(token);
                if (userObj.err) { throw new customError.AuthenticationError("invalid token"); }

                let reqUser = await db.query('SELECT * FROM ' + userObj.type + ' WHERE id = ' + userObj.id + ' AND active = 1');
                if (!reqUser.length) { throw new customError.AuthenticationError("account inactive or deleted"); }

                let givenCommitteeId = parseInt(nsp.name.split('/')[1]);

                let reqSession = await db.query('SELECT * FROM session WHERE committeeId = ' + givenCommitteeId + ' AND active = 1');
                if (!reqSession.length) { throw new customError.ValidationError("session not running or invalid committee"); }

                if (userObj.type != 'admin') {
                    if (reqUser[0].committeeId != givenCommitteeId) { throw new customError.ForbiddenAccessError("you cannot connect with this committee"); }
                }

                if(!namespaceUsers[nsp.name][userObj.type]) { namespaceUsers[nsp.name][userObj.type] = {}; }
                
                let userIdsKey = Object.keys(namespaceUsers[nsp.name][userObj.type])
                for (let i = 0; i < userIdsKey.length; i++) {
                    if (userObj.id == userIdsKey[i]) { throw new customError.DuplicateResourceError("duplicate connection to committee"); }
                }
                
                namespaceUsers[nsp.name][userObj.type][userObj.id] = socket.id;
                
                socket.userObj = {
                    type: userObj.type,
                    id: userObj.id,
                    name: reqUser[0].name,
                    committeeId: givenCommitteeId,
                    sessionId: reqSession[0].id,
                    nsp: "/" + givenCommitteeId
                };

                if (userObj.type == 'delegate') {
                    socket.userObj.countryId = reqUser[0].countryId;
                } else if (userObj.type == 'dias') {
                    socket.userObj.title = reqUser[0].title;
                }

                await sendStartInfo(socket);

                attachEventListeners(socket);

                socket.join(socket.userObj.committeeId + '|' + socket.userObj.type)

            } catch(err) {
                errorHandler(socket, err);
                socket.destroy();
            }
        });

        return undefined;
    } catch(err) {
        return err;
    }
}

async function stopNameSpace(committeeId) {
    try {
        let namespaces = Object.keys(namespaceUsers);
        
        let n = 0;
        for ( ; n < namespaces.length; n++) {
            if (namespaces[n] == "/" + committeeId) { break; }
        }
        if (n == namespaces.length) { throw new customError.NotFoundError("no running session for this committee found"); }

        var { io } = require('../../bin/www');
        let sockets = io.of("/" + committeeId).sockets;

        await db.query('UPDATE session SET active = 0 WHERE active = 1 AND committeeId = ' + committeeId);

        let sKeys = Object.keys(sockets);
        for (let i = 0; i < sKeys.length; i++) {
            sockets[sKeys[i]].disconnect(true);
        }

        delete namespaceUsers["/" + committeeId];

        return undefined;
    } catch(err) {
        return err;
    }
}

module.exports.createNameSpace = createNameSpace;
module.exports.stopNameSpace = stopNameSpace;
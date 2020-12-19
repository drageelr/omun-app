'use strict'

var { io } = require('../bin/www');
var db = require('./mysql');
var jwt = require('./jwt');
var customError = require('../errors/errors');
var { errorHandler } = require('./socketIOerrorhandler');
var hFuncs = require('./helper-funcs');

/**
 * '/committeeId': { 'type': {id: 'socketId'} }
 * "committeId" is an integer which denotes namespace
 * "type" is a string which denotes "admin", "dias" or "delegate"
 * "id" is an integer represents user's id in DB
 * "socketId" is a string that represents the unique id of the user in the connected namespace
 */
const namespaceUsers = {};

function sendStartInfo(socket) {
    try {
        let user = socket.userObj;
        let nsp = io.of("/" + committeeId);

        let reqCommittee = await db.query('SELECT * FROM committee WHERE id = ' + user.committeeId);
        if (!reqCommittee.length) { throw new customError.NotFoundError("committee not found"); }

        let reqSession = await db.query('SELECT * FROM session WHERE committeeId = ' + user.committeeId + ' AND active = 1 AND id = ' + user.sessionId);
        if (!reqSession.length) { throw new customError.NotFoundError("active session not found"); }

        let reqSeats = db.query('SELECT * FROM seat WHERE committeeId = ' + user.committeeId + 'ORDER BY id');

        let allDelegates = db.query('SELECT * FROM delegate WHERE committeeId = ' + user.committeeId);

        let allCountries = db.query('SELECT * FROM country');

        let reqNotifications = db.query('SELECT * FROM notification WHERE committeeId = ' + user.committeeId + ' sessionId = ' + user.sessionId + ' ORDER BY id');

        let reqLogs = undefined;
        let reqTopicQuery = 'SELECT * FROM topic WHERE committeeId = ' + user.committeeId + ' AND sessionId = ' + user.sessionId + ' AND visible = 1';
        if (user.type != 'delegate') {
            let reqLogs = await db.query('SELECT * FROM log WHERE committeeId = ' + user.committeeId + ' sessionId = ' + user.sessionId + ' ORDER BY id');
            reqTopicQuery = 'SELECT * FROM topic WHERE committeeId = ' + user.committeeId + ' AND sessionId = ' + user.sessionId;
        }

        let reqTopics = db.query(reqTopicQuery);

        await Promise.all(reqSeats, allDelegates, allCountries, reqNotifications, reqTopics);

        let committee = {
            id: reqCommittee[0].id,
            name: reqCommittee[0].name,
            intials: reqCommittee[0].intials
        }

        let session = {
            id: reqSession[0].id,
            topicId: reqSession[0].topicId,
            speakerId: reqSession[0].speakerId,
            type: reqSession[0].type
        }

        let seats = [];
        for (let i = 0; i < reqSeats.length; i++) {
            seats.push(reqSeats[i], ['id', 'delegateId', 'placard']);
        }

        let delegates = [];
        for (let i = 0; i < allDelegates.length; i++) {
            delegates.push(hFuncs.duplicateObject(allDelegates, ['id', 'countryId']));
        }

        let countries = [];
        for (let i = 0; i < countries; i++) {
            countries.push(allCountries, ['id', 'name', 'initials']);
        }

        let connectedDelegates = [];
        let conDel = Object.keys(namespaceUsers[nsp.name].delegate);
        for (let i = 0; i < conDel.length; i++) {
            connectedDelegates.push(conDel[i]);
        }

        let connectedAdmins = [];
        let conAdmins = Object.values(namespaceUsers[nsp.name].admin);
        for (let i = 0; i < conAdmins.length; i++) {
            let userDetails = nsp.sockets[conAdmins[i]].userObj;
            connectedAdmins.push(userDetails, ['id', 'name']);
        }

        let connectedDias = [];
        let conDias = Object.values(namespaceUsers[nsp.name].dias);
        for (let i = 0; i < conDias.length; i++) {
            let userDetails = nsp.sockets[conDias[i]].userObj;
            connectedDias.push(userDetails, ['id', 'name', 'title']);
        }

        let notifications = [];
        for (let i = 0; i < reqNotifications.length; i++) {
            notifications.push(reqNotifications[i], ['id', 'message', 'timestamp']);
        }

        let resObj = {
            committee: committee,
            session: session,
            seats: seats,
            delegates: delegates,
            countries: countries,
            connectedDelegates: connectedDelegates,
            connectedAdmins: connectedAdmins,
            connectedDias: connectedDias,
            notifications: notifications
        }

        let logs = [];
        if (user.type != 'delegate') {
            for (let i = 0; i < reqLogs.length; i++) {
                logs.push(reqLogs[i], ['id', 'message', 'timestamp']);
            }
            resObj.logs = logs;
        }

        socket.emit('info-start', resObj);        
        
    } catch (err) {
        errorHandler(socket, err);
    }
}

function sendChatInfo(socket) {
    try {

    } catch(err) {
        errorHandler(socket, err);
    }
}

function createNameSpace(committeeId) {
    let namespaces = Object.keys(io.nsps);

    if (typeof committeeId != 'string') { committeeId = toString(committeeId); }

    for (let i = 0; i < namespaces.length; i++) {
        if (namespaces[i] == committeeId) { return; }
    }

    namespaceUsers["/" + committeeId] = {};

    let nsp = io.of("/" + committeeId);

    nsp.on('connection', async socket => {
        try {
            let token = socket.handshake.query.token;
            if (!token) { throw new customError.AuthenticationError("no token supplied"); }

            let userObj = jwt.decodeToken(token);
            if (userObj.err) { throw new customError.AuthenticationError("invalid token"); }

            let reqUser = await db.query('SELECT * FROM ' + userObj.type + ' WHERE id = ' + userObj.type + ' AND active = 1');
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

            socket.userObj = {
                type: userObj.type,
                id: userObj.id,
                name: reqUser[0].name,
                committeeId: givenCommitteeId,
                sessionId: reqSession[0].id
            };

            if (userObj.type == 'delegate') {
                socket.userObj.countryId = reqUser[0].countryId;
            } else if (userObj.type == 'dias') {
                socket.userObj.title = reqUser[0].title;
            }

            sendStartInfo(socket);
        } catch(err) {
            errorHandler(socket, err);
            socket.destroy();
        }
    });
}

function stopNameSpace(committeeId) {

}
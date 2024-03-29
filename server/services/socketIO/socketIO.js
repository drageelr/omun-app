'use strict'

var db = require('../mysql');
var jwt = require('../jwt');
var customError = require('../../errors/errors');
var hFuncs = require('../helper-funcs');
var { errorHandler } = require('./socketIOerrorhandler');
var { validate } = require('./socketIOvalidator');
var { validateAccess } = require('./socketIOaccessvalidator');
var IOreqhandlers = require('./socketIOreqhandlers');
const { namespaceUsers, addUser, deleteUser, fetchSocketId, fetchUsers, createNamespaceObj, deleteNamespaceObj, attachFunc } = require('./socketIOusers');

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
    'session-edit': IOreqhandlers.handleSessionEdit,
    'session-timer': IOreqhandlers.handleSessionTimer,

    // Committee Management
    'committee-link': IOreqhandlers.handleCommitteeLink
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

        let topicName = "N/A";
        if (reqSession[0].topicId) {
            let topic = await db.query('SELECT description FROM topic WHERE id = ' + reqSession[0].topicId + ' AND committeeId = ' + user.committeeId);
            if (topic.length) { topicName = topic[0].description; }
        }

        let speakerName = "N/A";
        let speakerImage = "N/A";
        if (reqSession[0].speakerId) {
            let speaker = await db.query('SELECT name, imageName FROM country WHERE id IN (SELECT countryId FROM delegate WHERE id = ' + reqSession[0].speakerId + ')');
            speakerName = speaker[0].name;
            if (speaker[0].imageName) {
                speakerImage = speaker[0].imageName;
            }
        }

        let reqSeats = await db.query('SELECT * FROM seat WHERE committeeId = ' + user.committeeId + ' ORDER BY id');

        let allDelegates = await db.query('SELECT * FROM delegate WHERE committeeId = ' + user.committeeId);

        let allDias = await db.query('SELECT * FROM dias WHERE committeeId = ' + user.committeeId);

        let allCountries = await db.query('SELECT * FROM country');

        let committee = {
            id: reqCommittee[0].id,
            name: reqCommittee[0].name,
            intials: reqCommittee[0].intials,
            zoomLink: reqCommittee[0].zoomLink,
            driveLink: reqCommittee[0].driveLink
        }

        let session = {
            id: reqSession[0].id,
            topicId: reqSession[0].topicId,
            topicName: topicName,
            speakerId: reqSession[0].speakerId,
            speakerName: speakerName,
            speakerImage: speakerImage,
            speakerTime: reqSession[0].speakerTime,
            topicTime: reqSession[0].topicTime,
            type: reqSession[0].type
        }

        let seats = {};
        for (let i = 0; i < reqSeats.length; i++) {
            seats[reqSeats[i].id] = hFuncs.duplicateObject(reqSeats[i], ['delegateId', 'placard'])
        }

        let delegates = {};
        for (let i = 0; i < allDelegates.length; i++) {
            delegates[allDelegates[i].id] = hFuncs.duplicateObject(allDelegates[i], ['countryId']);
        }

        let dias = {};
        for (let i = 0; i < allDias.length; i++) {
            dias[allDias[i].id] = hFuncs.duplicateObject(allDias[i], ['name', 'title']);
        }

        let countries = {};
        for (let i = 0; i < allCountries.length; i++) {
            countries[allCountries[i].id] = hFuncs.duplicateObject(allCountries[i], ['name', 'initials', 'imageName']);
        }

        let connectedDelegates = [];
        let conDel = [];
        // if (namespaceUsers[nsp.name].delegate){
        //     conDel = Object.keys(namespaceUsers[nsp.name].delegate);
        // }
        conDel = Object.keys(fetchUsers(nsp.name, 'delegate'));
        for (let i = 0; i < conDel.length; i++) {
            connectedDelegates.push(conDel[i]);
        }

        let connectedAdmins = {};
        let conAdmins = [];
        // if (namespaceUsers[nsp.name].admin) {
        //     conAdmins = Object.values(namespaceUsers[nsp.name].admin);
        // }
        conAdmins = Object.values(fetchUsers(nsp.name, 'admin'));
        for (let i = 0; i < conAdmins.length; i++) {
            let userDetails = nsp.sockets.get(conAdmins[i]);
            userDetails = userDetails.userObj;
            connectedAdmins[userDetails.id] = hFuncs.duplicateObject(userDetails, ['name']);
        }

        let connectedDias = [];
        let conDias = [];
        // if (namespaceUsers[nsp.name].dias) {
        //     conDias = Object.keys(namespaceUsers[nsp.name].dias);
        // }
        conDias = Object.keys(fetchUsers(nsp.name, 'dias'));
        for (let i = 0; i < conDias.length; i++) {
            connectedDias.push(conDias[i]);
        }

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
        }

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
        let namespaceCreated = createNamespaceObj('/'+committeeId);
        if (!namespaceCreated) { throw new customError.DuplicateResourceError("committee session already in progress"); }
        
        var { io } = require('../../bin/www');
        let nsp = io.of("/" + committeeId);

        let funcAttached = attachFunc('/' + committeeId);
        if (!funcAttached) { return undefined; }

        nsp.on('connection', async socket => {
            try {
                socket.on('disconnect', async (reason) => {
                    let user = socket.userObj;
                    if (user) {
                        let currentNsp = io.of("/" + committeeId);
                        currentNsp.emit('RES|session-con', {
                            type: user.type,
                            userId: user.id,
                            connected: false
                        });
                        
                        if (user.type == "delegate") {
                            let occupiedSeat = await db.query('SELECT id FROM seat WHERE committeeId = ' + committeeId + ' AND delegateId = ' + user.id);
                            if (occupiedSeat.length) {
                                let unoccupySeat = await db.query('UPDATE seat SET delegateId = null, placard = 0 WHERE id = ' + occupiedSeat[0].id + ' AND delegateId = ' + user.id);
                                if (unoccupySeat.changedRows) { currentNsp.emit('RES|seat-unsit', {id: occupiedSeat[0].id}); }
                            }
                        }
                        deleteUser("/" + committeeId, user.type, user.id);
                    }
                    console.log(socket.id, "DISCONNECTED:", reason);
                });

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

                let userAdded = addUser(nsp.name, userObj.type, userObj.id, socket.id);
                // if (!userAdded) { throw new customError.DuplicateResourceError("duplicate connection to committee"); }
                
                if (!userAdded) {
                    let socketId = fetchSocketId(nsp.name, userObj.type, userObj.id);
                    if (socketId !== undefined) {
                        let oldSocket = nsp.sockets.get(socketId); 
                        errorHandler(oldSocket, new customError.DuplicateResourceError("connection closed becuase of duplicate login"));
                        oldSocket.disconnect(true);
                    }
                    if (userObj.type == "delegate") {
                        let occupiedSeat = await db.query('SELECT id FROM seat WHERE committeeId = ' + givenCommitteeId + ' AND delegateId = ' + userObj.id);
                        if (occupiedSeat.length) {
                            let unoccupySeat = await db.query('UPDATE seat SET delegateId = null, placard = 0 WHERE id = ' + occupiedSeat[0].id + ' AND delegateId = ' + userObj.id);
                            if (unoccupySeat.changedRows) { nsp.emit('RES|seat-unsit', {id: occupiedSeat[0].id}); }
                        }
                    }
                    deleteUser(nsp.name, userObj.type, userObj.id);
                    addUser(nsp.name, userObj.type, userObj.id, socket.id);
                }

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

                socket.broadcast.emit('RES|session-con', {
                    type: userObj.type,
                    userId: userObj.id,
                    connected: true
                });



            } catch(err) {
                errorHandler(socket, err);
                socket.disconnect(true);
            }
        });

        return undefined;
    } catch(err) {
        return err;
    }
}

async function stopNameSpace(committeeId) {
    try {
        // let namespaces = Object.keys(namespaceUsers);
        
        // let n = 0;
        // for ( ; n < namespaces.length; n++) {
        //     if (namespaces[n] == "/" + committeeId) { break; }
        // }
        // if (n == namespaces.length) { throw new customError.NotFoundError("no running session for this committee found"); }

        var { io } = require('../../bin/www');
        // let sockets = io.of("/" + committeeId).sockets;

        await db.query('UPDATE session SET active = 0 WHERE active = 1 AND committeeId = ' + committeeId);

        let sockets = io.of("/" + committeeId).sockets;
        let sKeys = Object.keys(sockets);
        for (let i = 0; i < sKeys.length; i++) {
            sockets[sKeys[i]].disconnect(true);
        }

        // delete namespaceUsers["/" + committeeId]; //deleteNS
        let namespaceDeleted = deleteNamespaceObj('/'+committeeId);
        if (!namespaceDeleted) { throw new customError.NotFoundError("no running session for this committee found"); }

        // delete io.nsps['/'+committeeId];

        return undefined;
    } catch(err) {
        return err;
    }
}

module.exports.createNameSpace = createNameSpace;
module.exports.stopNameSpace = stopNameSpace;
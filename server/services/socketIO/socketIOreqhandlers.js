'use strict'

var { io } = require('../../bin/www');
var db = require('../mysql');
var customError = require('../../errors/errors');
var hFuncs = require('../helper-funcs');
const { namespaceUsers, fetchSocketId } = require('./socketIOusers');

function emitToSocket(nspName, socketId, event, data = undefined) {
    let sockets = io.of(nspName).sockets;
    let socket = sockets[socketId];
    let resEvent = "RES|" + event;
    if (socket) {
        if (data) {
            socket.emit(resEvent, data);
        } else {
            socket.emit(resEvent);
        }
    }
}

function broadcastToRoom(room, event, data = undefined) {
    let resEvent = "RES|" + event;
    if (data) {
        io.of(room).emit(resEvent, data);
    } else {
        io.of(room).emit(resEvent);
    }
}

exports.handleDelChatFetchForDel = async (socket, params, event) => {
    try {
        let user = socket.userObj;
        let fetchFrom = params.lastMessageId;
        if (fetchFrom < 1) {
            let maxMsgId = await db.query('SELECT MAX(id) FROM chat_message_del_del WHERE '
                + 'committeId = ' + user.committeeId + ' AND '
                + 'sessionId = ' + user.sessionId + ' AND '
                + 'senderDelegateId IN (' + user.id + ', ' + params.delegateId + ') AND '
                + 'recipientDelegateId IN (' + user.id + ', ' + params.delegateId + ')'
            );
            if (!maxMsgId[0]['MAX(id)']) { fetchFrom = 0; }
            else { fetchFrom = maxMsgId[0]['MAX(id)']; }
        }
        let fetchTill = fetchFrom - 10;
        let result = await db.query('SELECT id, senderDelegateId, recipientDelegateId, message, timestamp FROM chat_message_del_del WHERE '
            + 'committeeId = ' + user.committeeId + ' AND '
            + 'sessionId = ' + user.sessionId + ' AND '
            + 'senderDelegateId IN (' + user.id + ', ' + params.delegateId + ') AND '
            + 'recipientDelegateId IN (' + user.id + ', ' + params.delegateId + ') AND '
            + 'id < ' + fetchFrom + ' AND '
            + 'id > ' + fetchTill + ' ORDER BY id ASC'
        );
        
        let chat = [];
        for (let i = 0; i < result.length; i++) {
            chat.push(hFuncs.duplicateObject(result[i], ['id', 'senderDelegateId', 'recipientDelegateId', 'message', 'timestamp']));
        }

        let res = {
            delegateId: params.delegateId,
            chat: chat
        };

        return [res, undefined];

    } catch (err) {
        return [{}, err];
    }
}

exports.handleDelChatFetchForRest = async (socket, params, event) => {
    try {
        let user = socket.userObj;
        let fetchFrom = params.lastMessageId;
        if (fetchFrom < 1) {
            let maxMsgId = await db.query('SELECT MAX(id) FROM chat_message_del_del WHERE '
                + 'committeId = ' + user.committeeId + ' AND '
                + 'sessionId = ' + user.sessionId + ' AND '
                + 'senderDelegateId IN (' + params.delegate1Id + ', ' + params.delegate2Id + ') AND '
                + 'recipientDelegateId IN (' + params.delegate1Id + ', ' + params.delegate2Id + ')'
            );
            if (!maxMsgId[0]['MAX(id)']) { fetchFrom = 0; }
            else { fetchFrom = maxMsgId[0]['MAX(id)']; }
        }
        let fetchTill = fetchFrom - 10;
        let result = await db.query('SELECT id, senderDelegateId, recipientDelegateId, message, timestamp FROM chat_message_del_del WHERE '
            + 'committeeId = ' + user.committeeId + ' AND '
            + 'sessionId = ' + user.sessionId + ' AND '
            + 'senderDelegateId IN (' + params.delegate1Id + ', ' + params.delegate2Id + ') AND '
            + 'recipientDelegateId IN (' + params.delegate1Id + ', ' + params.delegate2Id + ') AND '
            + 'id < ' + fetchFrom + ' AND '
            + 'id > ' + fetchTill + ' ORDER BY id ASC'
        );
        
        let chat = [];
        for (let i = 0; i < result.length; i++) {
            chat.push(hFuncs.duplicateObject(result[i], ['id', 'senderDelegateId', 'recipientDelegateId', 'message', 'timestamp']));
        }

        let res = {
            delegate1Id: params.delegate1Id,
            delegate2Id: params.delegate2Id,
            chat: chat
        };

        return [res, undefined];
    } catch(err) {
        return [{}, err];
    }
}

exports.handleDiasChatFetchForDel = async (socket, params, event) => {
    try {
        let user = socket.userObj;
        let fetchFrom = params.lastMessageId;
        if (fetchFrom < 1) {
            let maxMsgId = await db.query('SELECT MAX(id) FROM chat_message_del_dias WHERE '
                + 'committeId = ' + user.committeeId + ' AND '
                + 'sessionId = ' + user.sessionId + ' AND '
                + 'delegateId = ' + user.id + ' AND '
                + 'diasId = ' + params.diasId
            );
            if (!maxMsgId[0]['MAX(id)']) { fetchFrom = 0; }
            else { fetchFrom = maxMsgId[0]['MAX(id)']; }
        }
        let fetchTill = fetchFrom - 10;
        let result = await db.query('SELECT id, delegateId, diasId, message, diasSent, timestamp FROM chat_message_del_dias WHERE '
            + 'committeeId = ' + user.committeeId + ' AND '
            + 'sessionId = ' + user.sessionId + ' AND '
            + 'delegateId = ' + user.id + ' AND '
            + 'diasId = ' + params.diasId + ' AND '
            + 'id < ' + fetchFrom + ' AND '
            + 'id > ' + fetchTill + ' ORDER BY id ASC'
        );
        
        let chat = [];
        for (let i = 0; i < result.length; i++) {
            chat.push(hFuncs.duplicateObject(result[i], ['id', 'delegateId', 'diasId', 'message', 'diasSent', 'timestamp']));
        }

        let res = {
            diasId: params.diasId,
            chat: chat
        };

        return [res, undefined];
    } catch(err) {
        return [{}, err];
    }
}

exports.handleDiasChatFetchForDias = async (socket, params, event) => {
    try {
        let user = socket.userObj;
        let fetchFrom = params.lastMessageId;
        if (fetchFrom < 1) {
            let maxMsgId = await db.query('SELECT MAX(id) FROM chat_message_del_dias WHERE '
                + 'committeId = ' + user.committeeId + ' AND '
                + 'sessionId = ' + user.sessionId + ' AND '
                + 'delegateId = ' + params.delegateId + ' AND '
                + 'diasId = ' + user.id
            );
            if (!maxMsgId[0]['MAX(id)']) { fetchFrom = 0; }
            else { fetchFrom = maxMsgId[0]['MAX(id)']; }
        }
        let fetchTill = fetchFrom - 10;
        let result = await db.query('SELECT id, delegateId, diasId, message, diasSent, timestamp FROM chat_message_del_dias WHERE '
            + 'committeeId = ' + user.committeeId + ' AND '
            + 'sessionId = ' + user.sessionId + ' AND '
            + 'delegateId = ' + params.delegateId + ' AND '
            + 'diasId = ' + user.id + ' AND '
            + 'id < ' + fetchFrom + ' AND '
            + 'id > ' + fetchTill + ' ORDER BY id ASC'
        );
        
        let chat = [];
        for (let i = 0; i < result.length; i++) {
            chat.push(hFuncs.duplicateObject(result[i], ['id', 'delegateId', 'diasId', 'message', 'diasSent', 'timestamp']));
        }

        let res = {
            delegateId: params.delegateId,
            chat: chat
        };

        return [res, undefined];
    } catch(err) {
        return [{}, err];
    }
}

exports.handleDelChatSend = async (socket, params, event) => {
    try {
        let user = socket.userObj;

        let recipDelegate = await db.query('SELECT id FROM delegate WHERE id = ' + params.delegateId + ' committeeId = ' + user.committeeId);
        if (!recipDelegate.length) { throw new customError.NotFoundError("delegate not found in current committee"); }

        let timestampCreated = hFuncs.parseDate();

        let result = await db.query('INSERT INTO chat_message_del_del (committeeId, sessionId, senderDelegateId, recipientDelegateId, message, timestamp) VALUES ('
            + user.committeeId + ', ' + user.sessionId + ', ' + user.id, + ', ' + params.delegateId + ', "' + params.message + '", "' + timestampCreated + '")'
        );

        let res = {
            id: result.insertId,
            senderDelegateId: user.id,
            recipientDelegateId: params.delegateId,
            message: params.message,
            timestamp: timestampCreated
        }

        emitToSocket(user.nsp, fetchSocketId(user.nsp, "delegate", params.delegateId), event, res);

        broadcastToRoom(user.committeeId + '|' + "admin", event, res);
        broadcastToRoom(user.committeeId + '|' + "dias", event, res);

        return [res, undefined];

    } catch(err) {
        retrun [{}, err];
    }
}

exports.handleDiasChatSend = async (socket, params, event) => {
    try {
        let user = socket.userObj;

        let res = {
            diasId: user.id,
            delegateId: params.userId,
            message: params.message,
            diasSent: 1,
            timestamp: hFuncs.parseDate()
        }

        let recpUserType = "delegate";
        if (user.type == "delegate") { res.delegateId = user.id; res.diasId = params.userId; resdiasSent = 0; recpUserType = "dias"; }

        let recipUser = await db.query('SELECT id FROM ' + recpUserType + ' WHERE id = ' + params.userId + ' committeeId = ' + user.committeeId);
        if (!recipUser.length) { throw new customError.NotFoundError("delegate not found in current committee"); }

        let result = await db.query('INSERT INTO chat_message_del_dias (committeeId, sessionId, diasId, delegateId, message, timestamp) VALUES ('
            + user.committeeId + ', ' + user.sessionId + ', ' + res.diasId, + ', ' + res.delegateId + ', "' + res.message + '", "' + res.timestamp + '")'
        );

        res.id = result.insertId;

        emitToSocket(user.nsp, fetchSocketId(user.nsp, recpUserType, params.userId), event, res);

        return [res, undefined];
    } catch(err) {
        retrun [{}, err];
    }
}
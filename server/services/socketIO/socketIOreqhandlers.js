'use strict'

var { io } = require('../../bin/www');
var db = require('../mysql');
var customError = require('../../errors/errors');
var hFuncs = require('../helper-funcs');
const { namespaceUsers, fetchSocketId } = require('./socketIOusers');
const { param } = require('../../routes/auth.route');

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

async function generateAndBroadcastLog(committeeId, sessionId, message, timestamp) {
    try {
        let resLog = {
            message: message,
            timestamp: timestamp
        }

        let resultLog = await db.query('INSERT INTO log (committeeId, sessionId, message, timestamp) VALUES ('
            + committeeId + ', ' + sessionId  + ', "' + message + '", "' + timestamp + '")'
        );

        resLog.id = resultLog.insertId;

        broadcastToRoom(committeeId + '|' + "admin", 'log-send', resLog);
        broadcastToRoom(committeeId + '|' + "dias", 'log-send', resLog);

        return undefined;
    } catch(err) {
        return err;
    }
}

// Chat Management

exports.handleDelChatFetchForDel = async (socket, params, event) => {
    try {
        let user = socket.userObj;
        
        let fetchFrom = params.lastMessageId;
<<<<<<< HEAD
        if (fetchFrom < 1) { 
            fetchFrom = '(SELECT MAX(id) + 1 FROM chat_message_del_del WHERE committeeId = ' + user.committeeId + ' AND sessionId = ' + user.sessionId + ' AND senderDelegateId IN (' + user.id + ', ' + params.delegateId + ') AND recipientDelegateId IN (' + user.id + ', ' + params.delegateId + '))'; 
=======
        if (fetchFrom < 1) {
            let maxMsgId = await db.query('SELECT MAX(id) FROM chat_message_del_del WHERE '
                + 'committeeId = ' + user.committeeId + ' AND '
                + 'sessionId = ' + user.sessionId + ' AND '
                + 'senderDelegateId IN (' + user.id + ', ' + params.delegateId + ') AND '
                + 'recipientDelegateId IN (' + user.id + ', ' + params.delegateId + ')'
            );
            if (!maxMsgId[0]['MAX(id)']) { fetchFrom = 0; }
            else { fetchFrom = maxMsgId[0]['MAX(id)']; }
>>>>>>> 270cab60c17700a5b65d1feba98767940c55b3de
        }

        let result = await db.query('SELECT id, senderDelegateId, recipientDelegateId, message, timestamp FROM (SELECT id, senderDelegateId, recipientDelegateId, message, timestamp FROM chat_message_del_del WHERE '
            + 'committeeId = ' + user.committeeId + ' AND '
            + 'sessionId = ' + user.sessionId + ' AND '
            + 'senderDelegateId IN (' + user.id + ', ' + params.delegateId + ') AND '
            + 'recipientDelegateId IN (' + user.id + ', ' + params.delegateId + ') AND '
            + 'id < ' + fetchFrom + ' ORDER BY id DESC LIMIT 10) sub ORDER BY id ASC'
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
            fetchFrom = '(SELECT MAX(id) + 1 FROM chat_message_del_del WHERE committeeId = ' + user.committeeId + ' AND sessionId = ' + user.sessionId + ' AND senderDelegateId IN (' + params.delegate1Id + ', ' + params.delegate2Id + ') AND recipientDelegateId IN (' + params.delegate1Id + ', ' + params.delegate2Id + '))'; 
        }

        let result = await db.query('SELECT id, senderDelegateId, recipientDelegateId, message, timestamp FROM (SELECT id, senderDelegateId, recipientDelegateId, message, timestamp FROM chat_message_del_del WHERE '
            + 'committeeId = ' + user.committeeId + ' AND '
            + 'sessionId = ' + user.sessionId + ' AND '
            + 'senderDelegateId IN (' + params.delegate1Id + ', ' + params.delegate2Id + ') AND '
            + 'recipientDelegateId IN (' + params.delegate1Id + ', ' + params.delegate2Id + ') AND '
            + 'id < ' + fetchFrom + ' ORDER BY id DESC LIMIT 10) sub ORDER BY id ASC'
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
            fetchFrom = '(SELECT MAX(id) + 1 FROM chat_message_del_dias WHERE committeId = ' + user.committeeId + ' AND sessionId = ' + user.sessionId + ' AND delegateId = ' + user.id + ' AND diasId = ' + params.diasId + ')';
        }

        let result = await db.query('SELECT id, delegateId, diasId, message, diasSent, timestamp FROM (SELECT id, delegateId, diasId, message, diasSent, timestamp FROM chat_message_del_dias WHERE '
            + 'committeeId = ' + user.committeeId + ' AND '
            + 'sessionId = ' + user.sessionId + ' AND '
            + 'delegateId = ' + user.id + ' AND '
            + 'diasId = ' + params.diasId + ' AND '
            + 'id < ' + fetchFrom + ' ORDER BY id DESC LIMIT 10) sub ORDER BY id ASC'
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
            fetchFrom = '(SELECT MAX(id) + 1 FROM chat_message_del_dias WHERE committeId = ' + user.committeeId + ' AND sessionId = ' + user.sessionId + ' AND delegateId = ' + params.delegateId + ' AND diasId = ' + user.id + ')';
        }

        let result = await db.query('SELECT id, delegateId, diasId, message, diasSent, timestamp FROM (SELECT id, delegateId, diasId, message, diasSent, timestamp FROM chat_message_del_dias WHERE '
            + 'committeeId = ' + user.committeeId + ' AND '
            + 'sessionId = ' + user.sessionId + ' AND '
            + 'delegateId = ' + params.delegateId + ' AND '
            + 'diasId = ' + user.id + ' AND '
            + 'id < ' + fetchFrom + ' ORDER BY id DESC LIMIT 10) sub ORDER BY id ASC'
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

// Log & Notification Management

exports.handleLogFetch = async (socket, params, event) => {
    try {
        let user = socket.userObj;

        let fetchFrom = params.lastMessageId;
        if (fetchFrom < 1) { fetchFrom = '(SELECT MAX(id) + 1 FROM log)'; }
        
        let result = await db.query('SELECT id, message, timestamp FROM (SELECT id, message, timestamp FROM log WHERE '
            + 'committeeId = ' + user.committeeId + ' AND '
            + 'sessionId = ' + user.sessionId + ' AND '
            + 'id < ' + fetchFrom + ' ORDER BY id DESC LIMIT 10) sub ORDER BY id ASC'
        );

        let logs = [];
        for (let i = 0; i < result.length; i++) {
            logs.push(hFuncs.duplicateObject(result[i], ['id', 'message', 'timestamp']));
        }

        let res = {
            logs: logs
        };

        return [res, undefined];
    } catch(err) {
        retrun [{}, err];
    }
}

exports.handleNotificationFetch = async (socket, params, event) => {
    try {
        let user = socket.userObj;

        let fetchFrom = params.lastMessageId;
        if (fetchFrom < 1) { fetchFrom = '(SELECT MAX(id) + 1 FROM notification)'; }
        
        let result = await db.query('SELECT id, diasId, message, timestamp FROM (SELECT id, diasId, message, timestamp FROM notification WHERE '
            + 'committeeId = ' + user.committeeId + ' AND '
            + 'sessionId = ' + user.sessionId + ' AND '
            + 'id < ' + fetchFrom + ' ORDER BY id DESC LIMIT 10) sub ORDER BY id ASC'
        );

        let notifications = [];
        for (let i = 0; i < result.length; i++) {
            notifications.push(hFuncs.duplicateObject(result[i], ['id', 'diasId', 'message', 'timestamp']));
        }

        let res = {
            notifications: notifications
        };

        return [res, undefined];
    } catch(err) {
        retrun [{}, err];
    }
}

exports.handleNotificationSend = async (socket, params, event) => {
    try {
        let user = socket.userObj;

        let res = {
            diasId: user.id,
            message: params.message,
            timestamp: hFuncs.parseDate()
        }

        let result = await db.query('INSERT INTO notification (committeeId, sessionId, diasId, message, timestamp) VALUES ('
            + user.committeeId + ', ' + user.sessionId  + ', ' + res.diasId + ', "' + res.message + '", "' + res.timestamp + '")'
        );
        
        res.id = result.insertId;

        broadcastToRoom(user.committeeId + '|' + "admin", event, res);
        broadcastToRoom(user.committeeId + '|' + "dias", event, res);
        broadcastToRoom(user.committeeId + '|' + "delegate", event, res);

        return [undefined, undefined];
    } catch(err) {
        return [{}, err];
    }
}

// Seat Management

exports.handleSeatSit = async (socket, params, event) => {
    try {
        let user = socket.userObj;

        let reqSitting = await db.query('SELECT id FROM seat WHERE '
            + 'id = ' + params.seatId + ' AND '
            + 'committeeId = ' + params.committeeId + ' AND '
            + 'delegateId = ' + params.delegateId
        );

        if (reqSitting.length) { throw new customError.DuplicateResourceError("you are already sitting on another seat"); }

        let timestampAltered = hFuncs.parseDate();

        let result = await db.query('UPDATE seat SET delegateId = ' + user.id + ' AND placard = 0 WHERE '
            + 'id = ' + params.seatId + ' AND '
            + 'committeeId = ' + params.committeeId + ' AND '
            + 'delegateId = null'
        ); 

        if (!result.changedRows) { throw new customError.DuplicateResourceError("someone is sitting in that seat"); }

        let res = {
            id: params.seatId,
            delegateId: params.delegateId,
            placard: 0
        }

        broadcastToRoom(user.committeeId + '|' + "admin", event, res);
        broadcastToRoom(user.committeeId + '|' + "dias", event, res);
        broadcastToRoom(user.committeeId + '|' + "delegate", event, res);

        let logErr = await generateAndBroadcastLog(user.committeeId, user.sessionId, '|V-AUD|: {delegateId: ' + params.delegateId + '} sat in {seatId: ' + params.seatId + '}', timestampAltered);
        if (logErr) { throw logErr; }

        return[undefined, undefined];
    } catch(err) {
        return [{}, err];
    }
}

exports.handleSeatUnSit = async (socket, params, event) => {
    try {
        let user = socket.userObj;

        let timestampAltered = hFuncs.parseDate();

        let result = await db.query('UPDATE seat SET delegateId = null AND placard = 0 WHERE '
            + 'committeeId = ' + params.committeeId + ' AND '
            + 'delegateId = ' + user.id
        ); 

        if (!result.changedRows) { throw new customError.NotFoundError("you are NOT sitting on any seat"); }

        let seatId = await db.query('SELECT id FROM seat WHERE '
            + 'committeeId = ' + user.committeeId + ' AND '
            + 'delegateId = ' + user.id 
        );

        if (!result.changedRows) { throw new customError.NotFoundError("unexpected error while leaving seat"); }

        let res = {
            id: seatId[0].id,
            delegateId: null,
            placard: 0
        }

        let logErr = await generateAndBroadcastLog(user.committeeId, user.sessionId, '|V-AUD|: {delegateId: ' + params.delegateId + '} left seat {seatId: ' + params.seatId + '}', timestampAltered);
        if (logErr) { throw logErr; }

        return[undefined, undefined];
    } catch(err) {
        return [{}, err];
    }
}

exports.handleSeatPlacard = async (socket, params, event) => {
    try {
        let user = socket.userObj;

        let timestampAltered = hFuncs.parseDate();

        let result = await db.query('UPDATE seat SET placard = ' + params.placard +  ' WHERE '
            + 'committeeId = ' + params.committeeId + ' AND '
            + 'delegateId = ' + user.id
        ); 

        if (!result.changedRows) { throw new customError.NotFoundError("can't raise/lower placard because you are NOT sitting on any seat"); }

        let seatId = await db.query('SELECT id FROM seat WHERE '
            + 'committeeId = ' + user.committeeId + ' AND '
            + 'delegateId = ' + user.id 
        );

        if (!result.changedRows) { throw new customError.NotFoundError("unexpected error while leaving seat"); }

        let res = {
            id: seatId[0].id,
            delegateId: user.id,
            placard: params.placard
        }

        broadcastToRoom(user.committeeId + '|' + "admin", event, res);
        broadcastToRoom(user.committeeId + '|' + "dias", event, res);
        broadcastToRoom(user.committeeId + '|' + "delegate", event, res);

        let logErr = await generateAndBroadcastLog(user.committeeId, user.sessionId, '|V-AUD|: {delegateId: ' + params.delegateId + '} changed placard status to {placard: ' + res.placard + '}', timestampAltered);
        if (logErr) { throw logErr; }

        return[undefined, undefined];
    } catch(err) {
        return [{}, err];
    }
}

// Topic & GSL Management
exports.handleTopicCreate = async (socket, params, event) => {
    try {
        let user = socket.userObj;

        let reqDelegate = await db.query('SELECT id FROM delegate WHERE id = ' + params.delegateId + ' AND committeeId = ' + params.committeeId);
        if (!reqDelegate.length) { throw new customError.NotFoundError("delegate not found in current committee"); }
    
        let timestampCreated = hFuncs.parseDate();

        let result = await db.query('INSERT INTO topic (committeeId, sessionId, delegateId, description, totalTime, speakerTime, timestamp) VALUES ('
            + user.committeeId + ', ' + user.sessionId + ', ' + params.delegateId + ', "' + params.description + '", ' + params.totalTime + ', ' + params.speakerTime + ', "' + timestampCreated + '")'
        );

        let res = {
            id: result[0].insertId,
            delegateId: params.delegateId,
            description: params.description,
            totalTime: params.totalTime,
            speakerTime: params.speakerTime,
            visible: 1,
            timestamp: timestampCreated
        }

        broadcastToRoom(user.committeeId + '|' + "admin", event, res)
        broadcastToRoom(user.committeeId + '|' + "dias", event, res)
        broadcastToRoom(user.committeeId + '|' + "delegate", event, res)

        let logErr = await generateAndBroadcastLog(user.committeeId, user.sessionId, '|GSL-MOD|: {diasId: ' + user.diasId + '} created {topicId: ' + res.id + '}', timestampCreated);
        if (logErr) { throw logErr; }

        return [undefined, undefined];
    } catch(err) {
        return [{}, err];
    }
}

exports.handleTopicEdit = async (socket, params, event) => {
    try {
        let user = socket.userObj;

        if (params.delegateId !== undefined) {
            let reqDelegate = await db.query('SELECT id FROM delegate WHERE id = ' + params.delegateId + ' AND committeeId = ' + params.committeeId);
            if (!reqDelegate.length) { throw new customError.NotFoundError("delegate not found in current committee"); }
        }

        let res = {
            id: params.topicId,
        }

        const keys = ['delegateId', 'description', 'totalTime', 'speakerTime', 'visible'];
        const kType = [0, 1, 0, 0, 0];
        let updateQueryStr = 'UPDATE topic SET ';
        let whereQueryStr = ' WHERE id = ' + params.topicId + ' AND committeeId = ' + user.committeeId;
        for (let i = 0; i < keys.length; i++) {
            if (params[keys[i]] !== undefined) {
                res[keys[i]] = params[keys[i]];
                if (updateQueryStr != 'UPDATE topic SET ') { updateQueryStr += ' AND '; }
                updateQueryStr += keys[i] + ' = ';
                if (kType[i]) { updateQueryStr += '"'; }
                updateQueryStr += params[keys[i]];
                if (kType[i]) { updateQueryStr += '"'; }
            }
        }

        if (updateQueryStr == 'UPDATE topic SET ') { throw new customError.ValidationError("please specify fields to edit"); }

        let timestampAltered = hFuncs.parseDate();

        let result = await db.query(updateQueryStr + whereQueryStr);

        if (!result.changedRows) { throw new customError.NotFoundError("topic does not exist"); }

        broadcastToRoom(user.committeeId + '|' + "admin", event, res)
        broadcastToRoom(user.committeeId + '|' + "dias", event, res)
        broadcastToRoom(user.committeeId + '|' + "delegate", event, res)

        let logErr = await generateAndBroadcastLog(user.committeeId, user.sessionId, '|GSL-MOD|: {diasId: ' + user.diasId + '} edited {topicId: ' + res.id + '}', timestampAltered);
        if (logErr) { throw logErr; }

        return [undefined, undefined];
    } catch(err) {
        return [{}, err];
    }
}

exports.handleTopicFetch = async (socket, params, event) => {
    try {
        let user = socket.userObj;

        let fetchFrom = params.lastMessageId;
        if (fetchFrom < 1) {
            let maxTopicId = await db.query('SELECT MAX(id) FROM log WHERE '
                + 'committeeId = ' + user.committeeId + ' AND '
                + 'sessionId = ' + user.sessionId
            );
            if (!maxLogId[0]['MAX(id)']) { fetchFrom = 0; }
            else { fetchFrom = maxLogId[0]['MAX(id)']; }
        }
        let fetchTill = fetchFrom - 10;


    } catch(err) {
        return [{}, undefined];
    }
}

exports.handleTopicSpeakerCreate = async (socket, params, event) => {
    try {
        let user = socket.userObj;

        let reqTopic = await db.query('SELECT id FROM topic WHERE id = ' + params.topicId + ' AND committeeId = ' + user.committeeId);
        if (!reqTopic.length) { throw new customError.NotFoundError("topic not found"); }

        let reqDelegate = await db.query('SELECT id FROM delegate WHERE id = ' + params.delegateId + ' AND committeeId = ' + params.committeeId);
        if (!reqDelegate.length) { throw new customError.NotFoundError("delegate not found in current committee"); }
    
        let timestampCreated = hFuncs.parseDate();

        let result = await db.query('INSERT INTO topic_speaker (topicId, delegateId, review, timestamp) VALUES ('
            + params.topicId + ', ' + params.delegateId + ', "N/A", "' + timestampCreated + '")'
        );

        let res = {
            id: result[0].insertId,
            topicId: params.topicId,
            delegateId: params.delegateId,
            review: "N/A",
            spokenTime: 0,
            visible: 1,
            timestamp: timestampCreated
        }

        broadcastToRoom(user.committeeId + '|' + "admin", event, res)
        broadcastToRoom(user.committeeId + '|' + "dias", event, res)
        broadcastToRoom(user.committeeId + '|' + "delegate", event, res)

        let logErr = await generateAndBroadcastLog(user.committeeId, user.sessionId, '|GSL-MOD|: {diasId: ' + user.diasId + '} created {topicSpeakerId: ' + res.id + ', topicId: ' + res.topicId + '}', timestampCreated);
        if (logErr) { throw logErr; }

        return [undefined, undefined];
    } catch(err) {
        return [{}, err];
    }
}

exports.handleTopicSpeakerEdit = async (socket, params, event) => {
    try {
        let user = socket.userObj;

        if (params.delegateId !== undefined) {
            let reqDelegate = await db.query('SELECT id FROM delegate WHERE id = ' + params.delegateId + ' AND committeeId = ' + params.committeeId);
            if (!reqDelegate.length) { throw new customError.NotFoundError("delegate not found in current committee"); }
        }

        let res = {
            id: params.topicSpeakerId,
            topicId: params.topicId
        }

        const keys = ['delegateId', 'review', 'spokenTime', 'visible'];
        const kType = [0, 1, 0, 0];
        let updateQueryStr = 'UPDATE topic_speaker SET ';
        let whereQueryStr = ' WHERE id = ' + params.topicSpeakerId  + ' AND topicId = ' + params.topicId;
        for (let i = 0; i < keys.length; i++) {
            if (params[keys[i]] !== undefined) {
                res[keys[i]] = params[keys[i]];
                if (updateQueryStr != 'UPDATE topic_speaker SET ') { updateQueryStr += ' AND '; }
                updateQueryStr += keys[i] + ' = ';
                if (kType[i]) { updateQueryStr += '"'; }
                updateQueryStr += params[keys[i]];
                if (kType[i]) { updateQueryStr += '"'; }
            }
        }

        if (updateQueryStr == 'UPDATE topic_speaker SET ') { throw new customError.ValidationError("please specify fields to edit"); }

        let timestampAltered = hFuncs.parseDate();

        let result = await db.query(updateQueryStr + whereQueryStr);

        if (!result.changedRows) { throw new customError.NotFoundError("topic or topic_speaker does not exist"); }

        broadcastToRoom(user.committeeId + '|' + "admin", event, res)
        broadcastToRoom(user.committeeId + '|' + "dias", event, res)
        broadcastToRoom(user.committeeId + '|' + "delegate", event, res)

        let logErr = await generateAndBroadcastLog(user.committeeId, user.sessionId, '|GSL-MOD|: {diasId: ' + user.diasId + '} edited {topicSpeakerId: ' + res.id + ', topicId: ' + res.topicId + '}', timestampAltered);
        if (logErr) { throw logErr; }

        return [undefined, undefined];
    } catch(err) {
        return [{}, err];
    }
}

exports.handleTopicSpeakerFetch = async (socket, params, event) => {
    try {
        let user = socket.userObj;

        
    } catch(err) {
        return [{}, undefined];
    }
}

exports.handleGSLCreate = async (socket, params, event) => {
    try {
        let user = socket.userObj;

        let reqDelegate = await db.query('SELECT id FROM delegate WHERE id = ' + params.delegateId + ' AND committeeId = ' + params.committeeId);
        if (!reqDelegate.length) { throw new customError.NotFoundError("delegate not found in current committee"); }
    
        let timestampCreated = hFuncs.parseDate();

        let result = await db.query('INSERT INTO gsl (committeeId, delegateId, review, timestampAdded) VALUES ('
            + user.committeeId + ', ' + params.delegateId + ', "N/A", "' + timestampCreated + '")'
        );

        let res = {
            id: result[0].insertId,
            delegateId: params.delegateId,
            review: "N/A",
            spokenTime: 0,
            visible: 1,
            timestampAdded: timestampCreated,
            timestampSpoken: null
        }

        broadcastToRoom(user.committeeId + '|' + "admin", event, res)
        broadcastToRoom(user.committeeId + '|' + "dias", event, res)
        broadcastToRoom(user.committeeId + '|' + "delegate", event, res)

        let logErr = await generateAndBroadcastLog(user.committeeId, user.sessionId, '|GSL-MOD|: {diasId: ' + user.diasId + '} added {gslId: ' + res.id + '}', timestampCreated);
        if (logErr) { throw logErr; }

        return [undefined, undefined];
    } catch(err) {
        return [{}, err];
    }
}

exports.handleGSLEdit = async (socket, params, event) => {
    try {
        let user = socket.userObj;

        if (params.delegateId !== undefined) {
            let reqDelegate = await db.query('SELECT id FROM delegate WHERE id = ' + params.delegateId + ' AND committeeId = ' + params.committeeId);
            if (!reqDelegate.length) { throw new customError.NotFoundError("delegate not found in current committee"); }
        }

        let res = {
            id: params.topicSpeakerId,
            topicId: params.topicId
        }

        if (params.timestampSpoken) {
            params.timestampSpoken = hFuncs.parseDate();
        }

        const keys = ['delegateId', 'review', 'spokenTime', 'visible', 'timestampSpoken'];
        const kType = [0, 1, 0, 0, 1];
        let updateQueryStr = 'UPDATE gsl SET ';
        let whereQueryStr = ' WHERE id = ' + params.topicSpeakerId  + ' AND topicId = ' + params.topicId;
        for (let i = 0; i < keys.length; i++) {
            if (params[keys[i]] !== undefined) {
                res[keys[i]] = params[keys[i]];
                if (updateQueryStr != 'UPDATE gsl SET ') { updateQueryStr += ' AND '; }
                updateQueryStr += keys[i] + ' = ';
                if (kType[i]) { updateQueryStr += '"'; }
                updateQueryStr += params[keys[i]];
                if (kType[i]) { updateQueryStr += '"'; }
            }
        }

        if (updateQueryStr == 'UPDATE gsl SET ') { throw new customError.ValidationError("please specify fields to edit"); }

        let timestampAltered = hFuncs.parseDate();

        let result = await db.query(updateQueryStr + whereQueryStr);

        if (!result.changedRows) { throw new customError.NotFoundError("gsl does not exist"); }

        broadcastToRoom(user.committeeId + '|' + "admin", event, res)
        broadcastToRoom(user.committeeId + '|' + "dias", event, res)
        broadcastToRoom(user.committeeId + '|' + "delegate", event, res)

        let logErr = await generateAndBroadcastLog(user.committeeId, user.sessionId, '|GSL-MOD|: {diasId: ' + user.diasId + '} edited {gslId: ' + res.id + '}', timestampAltered);
        if (logErr) { throw logErr; }

        return [undefined, undefined];
    } catch(err) {
        return [{}, err];
    }
}

exports.handleGSLFetch = async (socket, params, event) => {
    try {
        let user = socket.userObj;

        
    } catch(err) {
        return [{}, undefined];
    }
}

// Session Management

exports.handleSessionEdit = async (socket, params, event) => {
    try {
        let user = socket.userObj;

        if (params.speakerId !== undefined) {
            let reqDelegate = await db.query('SELECT id FROM delegate WHERE id = ' + params.speakerId + ' AND committeeId = ' + params.committeeId);
            if (!reqDelegate.length) { throw new customError.NotFoundError("delegate not found in current committee"); }
        }

        let res = {};

        const keys = ['topicId', 'speakerId', 'speakerTime', 'topicTime', 'type'];
        const kType = [0, 0, 0, 0, 1];
        let updateQueryStr = 'UPDATE session SET ';
        let whereQueryStr = ' WHERE id = ' + user.sessionId  + ' AND committeeId = ' + user.committeeId;
        for (let i = 0; i < keys.length; i++) {
            if (params[keys[i]] !== undefined) {
                res[keys[i]] = params[keys[i]];
                if (updateQueryStr != 'UPDATE session SET ') { updateQueryStr += ' AND '; }
                updateQueryStr += keys[i] + ' = ';
                if (kType[i]) { updateQueryStr += '"'; }
                updateQueryStr += params[keys[i]];
                if (kType[i]) { updateQueryStr += '"'; }
            }
        }

        if (updateQueryStr == 'UPDATE session SET ') { throw new customError.ValidationError("please specify fields to edit"); }

        let timestampAltered = hFuncs.parseDate();

        let result = await db.query(updateQueryStr + whereQueryStr);

        if (!result.changedRows) { throw new customError.NotFoundError("unexpected error"); }

        broadcastToRoom(user.committeeId + '|' + "admin", event, res)
        broadcastToRoom(user.committeeId + '|' + "dias", event, res)
        broadcastToRoom(user.committeeId + '|' + "delegate", event, res)

        let logErr = await generateAndBroadcastLog(user.committeeId, user.sessionId, '|SESSION|: {diasId: ' + user.diasId + '} edited the session', timestampAltered);
        if (logErr) { throw logErr; }

        return [undefined, undefined];
    } catch(err) {
        return [{}, err];
    }
}
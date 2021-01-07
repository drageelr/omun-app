'use strict'

var db = require('../mysql');
var customError = require('../../errors/errors');
var hFuncs = require('../helper-funcs');
const { namespaceUsers, fetchSocketId } = require('./socketIOusers');

function emitToSocket(nspName, socketId, event, data = undefined) {
    var { io } = require('../../bin/www');
    let sockets = io.of(nspName).sockets;
    let socket = sockets.get(socketId);
    let resEvent = "RES|" + event;
    if (socket) {
        if (data) {
            socket.emit(resEvent, data);
        } else {
            socket.emit(resEvent);
        }
    }
}

function broadcastToRoom(nsp, room, event, data = undefined) {
    let resEvent = "RES|" + event;
    var { io } = require('../../bin/www');
    if (data) {
        io.of(nsp).to(room).emit(resEvent, data);
    } else {
        io.of(nsp).to(room).emit(resEvent);
    }
}

async function generateAndBroadcastLog(nsp, committeeId, sessionId, message, timestamp) {
    try {
        let resLog = {
            message: message,
            timestamp: timestamp
        }

        let resultLog = await db.query('INSERT INTO log (committeeId, sessionId, message, timestamp) VALUES ('
            + committeeId + ', ' + sessionId  + ', "' + message + '", "' + timestamp + '")'
        );

        let getId = await db.query('SELECT id FROM log WHERE '
            + 'committeeId = ' + committeeId + ' AND '
            + 'sessionId = ' + sessionId + ' AND '
            + 'message = "' + message + '" AND '
            + 'timestamp = "' + timestamp + '"'
        );

        resLog.id = getId[0].id;

        broadcastToRoom(nsp, committeeId + '|' + "admin", 'log-send', resLog);
        broadcastToRoom(nsp, committeeId + '|' + "dias", 'log-send', resLog);

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
        if (fetchFrom < 1) { 
            fetchFrom = '(SELECT MAX(id) + 1 FROM chat_message_del_del WHERE committeeId = ' + user.committeeId + ' AND sessionId = ' + user.sessionId + ' AND senderDelegateId IN (' + user.id + ', ' + params.delegateId + ') AND recipientDelegateId IN (' + user.id + ', ' + params.delegateId + '))'; 
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
            fetchFrom = '(SELECT MAX(id) + 1 FROM chat_message_del_dias WHERE committeeId = ' + user.committeeId + ' AND sessionId = ' + user.sessionId + ' AND delegateId = ' + user.id + ' AND diasId = ' + params.diasId + ')';
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
            fetchFrom = '(SELECT MAX(id) + 1 FROM chat_message_del_dias WHERE committeeId = ' + user.committeeId + ' AND sessionId = ' + user.sessionId + ' AND delegateId = ' + params.delegateId + ' AND diasId = ' + user.id + ')';
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

        let recipDelegate = await db.query('SELECT id FROM delegate WHERE id = ' + params.delegateId + ' AND committeeId = ' + user.committeeId);
        if (!recipDelegate.length) { throw new customError.NotFoundError("delegate not found in current committee"); }

        let timestampCreated = hFuncs.parseDate();

        let result = await db.query('INSERT INTO chat_message_del_del (committeeId, sessionId, senderDelegateId, recipientDelegateId, message, timestamp) VALUES ('
            + user.committeeId + ', ' + user.sessionId + ', ' + user.id + ', ' + params.delegateId + ', "' + params.message + '", "' + timestampCreated + '")'
        );

        let getId = await db.query('SELECT id FROM chat_message_del_del WHERE '
            + 'committeeId = ' + user.committeeId + ' AND '
            + 'sessionId = ' + user.sessionId + ' AND '
            + 'senderDelegateId = ' + user.id + ' AND '
            + 'recipientDelegateId = ' + params.delegateId + ' AND '
            + 'message = "' + params.message + '" AND '
            + 'timestamp = "' + timestampCreated + '"'
        );

        let res = {
            id: getId[0].id,
            senderDelegateId: user.id,
            recipientDelegateId: params.delegateId,
            message: params.message,
            timestamp: timestampCreated
        }

        emitToSocket(user.nsp, fetchSocketId(user.nsp, "delegate", params.delegateId), event, res);

        broadcastToRoom(user.nsp, user.committeeId + '|' + "admin", event, res);
        broadcastToRoom(user.nsp, user.committeeId + '|' + "dias", event, res);

        return [res, undefined];

    } catch(err) {
        return [{}, err];
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
        if (user.type == "delegate") { res.delegateId = user.id; res.diasId = params.userId; res.diasSent = 0; recpUserType = "dias"; }

        let recipUser = await db.query('SELECT id FROM ' + recpUserType + ' WHERE id = ' + params.userId + ' AND committeeId = ' + user.committeeId);
        if (!recipUser.length) { throw new customError.NotFoundError("delegate not found in current committee"); }

        let result = await db.query('INSERT INTO chat_message_del_dias (committeeId, sessionId, diasSent, diasId, delegateId, message, timestamp) VALUES ('
            + user.committeeId + ', ' + user.sessionId + ', ' + res.diasSent + ', ' + res.diasId + ', ' + res.delegateId + ', "' + res.message + '", "' + res.timestamp + '")'
        );

        let getId = await db.query('SELECT id FROM chat_message_del_dias WHERE '
            + 'committeeId = ' + user.committeeId + ' AND '
            + 'sessionId = ' + user.sessionId + ' AND '
            + 'diasId = ' + res.diasId + ' AND '
            + 'delegateId = ' + res.delegateId + ' AND '
            + 'message = "' + res.message + '" AND '
            + 'timestamp = "' + res.timestamp + '"'
        );

        res.id = getId[0].id;

        emitToSocket(user.nsp, fetchSocketId(user.nsp, recpUserType, params.userId), event, res);

        return [res, undefined];
    } catch(err) {
        return [{}, err];
    }
}

// Log & Notification Management

exports.handleLogFetch = async (socket, params, event) => {
    try {
        let user = socket.userObj;

        let fetchFrom = params.lastLogId;
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
        return [{}, err];
    }
}

exports.handleNotificationFetch = async (socket, params, event) => {
    try {
        let user = socket.userObj;

        let fetchFrom = params.lastNotifId;
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
        return [{}, err];
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

        let getId = await db.query('SELECT id FROM notification WHERE '
            + 'committeeId = ' + user.committeeId + ' AND '
            + 'sessionId = ' + user.sessionId + ' AND '
            + 'diasId = ' + res.diasId + ' AND '
            + 'message = "' + res.message + '" AND '
            + 'timestamp = "' + res.timestamp + '"'
        );
        
        res.id = getId[0].id;

        broadcastToRoom(user.nsp, user.committeeId + '|' + "admin", event, res);
        broadcastToRoom(user.nsp, user.committeeId + '|' + "dias", event, res);
        broadcastToRoom(user.nsp, user.committeeId + '|' + "delegate", event, res);

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
            + 'committeeId = ' + user.committeeId + ' AND '
            + 'delegateId = ' + user.id
        );

        if (reqSitting.length) { throw new customError.DuplicateResourceError("you are already sitting on another seat"); }

        let timestampAltered = hFuncs.parseDate();

        let result = await db.query('UPDATE seat SET delegateId = ' + user.id + ', placard = 0 WHERE '
            + 'id = ' + params.seatId + ' AND '
            + 'committeeId = ' + user.committeeId + ' AND '
            + 'delegateId IS null'
        ); 

        if (!result.changedRows) { throw new customError.DuplicateResourceError("someone is sitting in that seat"); }

        let res = {
            id: params.seatId,
            delegateId: user.id
        }

        broadcastToRoom(user.nsp, user.committeeId + '|' + "admin", event, res);
        broadcastToRoom(user.nsp, user.committeeId + '|' + "dias", event, res);
        broadcastToRoom(user.nsp, user.committeeId + '|' + "delegate", event, res);

        let logErr = await generateAndBroadcastLog(user.nsp, user.committeeId, user.sessionId, '|V-AUD|: {delegateId: ' + user.id + '} sat in {seatId: ' + params.seatId + '}', timestampAltered);
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

        let seatId = await db.query('SELECT id FROM seat WHERE '
            + 'committeeId = ' + user.committeeId + ' AND '
            + 'delegateId = ' + user.id 
        );
        
        if (!seatId.length) { throw new customError.NotFoundError("you are NOT sitting on any seat"); }
        
        let result = await db.query('UPDATE seat SET delegateId = null, placard = 0 WHERE '
            + 'id = ' + seatId[0].id + ' AND '
            + 'committeeId = ' + user.committeeId + ' AND '
            + 'delegateId = ' + user.id
        ); 

        if (!result.changedRows) { throw new customError.NotFoundError("error leaving seat, maybe the seat is already unoccupied"); }

        let res = {
            id: seatId[0].id
        }

        broadcastToRoom(user.nsp, user.committeeId + '|' + "admin", event, res);
        broadcastToRoom(user.nsp, user.committeeId + '|' + "dias", event, res);
        broadcastToRoom(user.nsp, user.committeeId + '|' + "delegate", event, res);

        let logErr = await generateAndBroadcastLog(user.nsp, user.committeeId, user.sessionId, '|V-AUD|: {delegateId: ' + user.id + '} left seat {seatId: ' + res.id + '}', timestampAltered);
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
        
        let seatId = await db.query('SELECT id FROM seat WHERE '
            + 'committeeId = ' + user.committeeId + ' AND '
            + 'delegateId = ' + user.id 
        );

        if (!seatId.length) { throw new customError.NotFoundError("can't raise/lower placard because you are NOT sitting on any seat"); }

        let result = await db.query('UPDATE seat SET placard = ' + params.placard +  ' WHERE '
            + 'committeeId = ' + user.committeeId + ' AND '
            + 'delegateId = ' + user.id
        );

        if (!result.changedRows) { throw new customError.NotFoundError("placard already in that state"); }

        let res = {
            id: seatId[0].id,
            placard: params.placard
        }

        broadcastToRoom(user.nsp, user.committeeId + '|' + "admin", event, res);
        broadcastToRoom(user.nsp, user.committeeId + '|' + "dias", event, res);
        broadcastToRoom(user.nsp, user.committeeId + '|' + "delegate", event, res);

        let logErr = await generateAndBroadcastLog(user.nsp, user.committeeId, user.sessionId, '|V-AUD|: {delegateId: ' + user.id + '} changed placard status to {placard: ' + res.placard + '}', timestampAltered);
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

        let reqDelegate = await db.query('SELECT id FROM delegate WHERE id = ' + params.delegateId + ' AND committeeId = ' + user.committeeId);
        if (!reqDelegate.length) { throw new customError.NotFoundError("delegate not found in current committee"); }
    
        let timestampCreated = hFuncs.parseDate();

        let result = await db.query('INSERT INTO topic (committeeId, sessionId, delegateId, description, totalTime, speakerTime, timestamp) VALUES ('
            + user.committeeId + ', ' + user.sessionId + ', ' + params.delegateId + ', "' + params.description + '", ' + params.totalTime + ', ' + params.speakerTime + ', "' + timestampCreated + '")'
        );

        let getId = await db.query('SELECT id FROM topic WHERE '
            + 'committeeId = ' + user.committeeId + ' AND '
            + 'sessionId = ' + user.sessionId + ' AND '
            + 'delegateId = ' + params.delegateId + ' AND '
            + 'description = "' + params.description + '" AND '
            + 'totalTime = ' + params.totalTime + ' AND '
            + 'speakerTime = ' + params.speakerTime + ' AND '
            + 'timestamp = "' + timestampCreated + '"'
        );

        let res = {
            id: getId[0].id,
            delegateId: params.delegateId,
            description: params.description,
            totalTime: params.totalTime,
            speakerTime: params.speakerTime,
            visible: 1,
            timestamp: timestampCreated
        }

        broadcastToRoom(user.nsp, user.committeeId + '|' + "admin", event, res)
        broadcastToRoom(user.nsp, user.committeeId + '|' + "dias", event, res)
        broadcastToRoom(user.nsp, user.committeeId + '|' + "delegate", event, res)

        let logErr = await generateAndBroadcastLog(user.nsp, user.committeeId, user.sessionId, '|GSL-MOD|: [' + user.title + ' ' + user.name + '] created {topicId: ' + res.id + '}', timestampCreated);
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
            let reqDelegate = await db.query('SELECT id FROM delegate WHERE id = ' + params.delegateId + ' AND committeeId = ' + user.committeeId);
            if (!reqDelegate.length) { throw new customError.NotFoundError("delegate not found in current committee"); }
        }

        let res = {
            id: params.topicId,
        }

        const keys = ['delegateId', 'description', 'totalTime', 'speakerTime', 'visible'];
        const kType = [0, 1, 0, 0, 0];
        let edits = '';
        let updateQueryStr = 'UPDATE topic SET ';
        let whereQueryStr = ' WHERE id = ' + params.topicId + ' AND committeeId = ' + user.committeeId;
        for (let i = 0; i < keys.length; i++) {
            if (params[keys[i]] !== undefined) {
                res[keys[i]] = params[keys[i]];
                edits += keys[i] + ', ';
                if (updateQueryStr != 'UPDATE topic SET ') { updateQueryStr += ', '; }
                updateQueryStr += keys[i] + ' = ';
                if (kType[i]) { updateQueryStr += '"'; }
                updateQueryStr += params[keys[i]];
                if (kType[i]) { updateQueryStr += '"'; }
            }
        }

        if (updateQueryStr == 'UPDATE topic SET ') { throw new customError.ValidationError("please specify fields to edit"); }

        let timestampAltered = hFuncs.parseDate();

        let result = await db.query(updateQueryStr + whereQueryStr);

        if (!result.changedRows) { throw new customError.NotFoundError("topic does not exist or you provided an old value for a field"); }

        broadcastToRoom(user.nsp, user.committeeId + '|' + "admin", event, res)
        broadcastToRoom(user.nsp, user.committeeId + '|' + "dias", event, res)
        broadcastToRoom(user.nsp, user.committeeId + '|' + "delegate", event, res)

        let logErr = await generateAndBroadcastLog(user.nsp, user.committeeId, user.sessionId, '|GSL-MOD|: [' + user.title + ' ' + user.name + '] edited (' + edits + ') for {topicId: ' + res.id + '}', timestampAltered);
        if (logErr) { throw logErr; }

        return [undefined, undefined];
    } catch(err) {
        return [{}, err];
    }
}

exports.handleTopicFetch = async (socket, params, event) => {
    try {
        let user = socket.userObj;

        let fetchFrom = params.lastTopicId;
        if (fetchFrom < 1) {
            fetchFrom = '(SELECT MAX(id) + 1 FROM topic WHERE committeeId = ' + user.committeeId + ')';
        }

        let selectQuery = 'SELECT id, delegateId, description, totalTime, speakerTime, visible, timestamp FROM (SELECT id, delegateId, description, totalTime, speakerTime, visible, timestamp FROM topic WHERE ';
        let restQuery = 'committeeId = ' + user.committeeId + ' AND id < ' + fetchFrom + ' ORDER BY id DESC LIMIT 10) sub ORDER BY id ASC'

        let result = await db.query(selectQuery + restQuery);

        let topics = [];
        for (let i = 0; i < result.length; i++) {
            topics.push(hFuncs.duplicateObject(result[i], ['id', 'delegateId', 'description', 'totalTime', 'speakerTime', 'visible', 'timestamp']));
        }

        let res = {
            topics: topics
        };

        return [res, undefined];
    } catch(err) {
        return [{}, undefined];
    }
}

exports.handleTopicSpeakerCreate = async (socket, params, event) => {
    try {
        let user = socket.userObj;

        let reqTopic = await db.query('SELECT id FROM topic WHERE id = ' + params.topicId + ' AND committeeId = ' + user.committeeId);
        if (!reqTopic.length) { throw new customError.NotFoundError("topic not found"); }

        let reqDelegate = await db.query('SELECT id, countryId FROM delegate WHERE id = ' + params.delegateId + ' AND committeeId = ' + user.committeeId);
        if (!reqDelegate.length) { throw new customError.NotFoundError("delegate not found in current committee"); }

        let timestampCreated = hFuncs.parseDate();

        let result = await db.query('INSERT INTO topic_speaker (topicId, delegateId, review, timestamp) VALUES ('
            + params.topicId + ', ' + params.delegateId + ', "N/A", "' + timestampCreated + '")'
        );

        let getId = await db.query('SELECT id FROM topic_speaker WHERE '
            + 'delegateId = ' + params.delegateId + ' AND '
            + 'review = "N/A" AND '
            + 'timestamp = "' + timestampCreated + '"'
        );

        let res = {
            id: getId[0].id,
            topicId: params.topicId,
            delegateId: params.delegateId,
            review: "N/A",
            spokenTime: 0,
            visible: 1,
            timestamp: timestampCreated
        }

        broadcastToRoom(user.nsp, user.committeeId + '|' + "admin", event, res)
        broadcastToRoom(user.nsp, user.committeeId + '|' + "dias", event, res)
        broadcastToRoom(user.nsp, user.committeeId + '|' + "delegate", event, res)

        let reqCountry = await db.query('SELECT name FROM country WHERE id = ' + reqDelegate[0].countryId);

        let logErr = await generateAndBroadcastLog(user.nsp, user.committeeId, user.sessionId, '|GSL-MOD|: [' + user.title + ' ' + user.name + '] added [' + reqCountry[0].name + '] to {topicId: ' + res.topicId + '}', timestampCreated);
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
            let reqDelegate = await db.query('SELECT id FROM delegate WHERE id = ' + params.delegateId + ' AND committeeId = ' + user.committeeId);
            if (!reqDelegate.length) { throw new customError.NotFoundError("delegate not found in current committee"); }
        }

        let res = {
            id: params.topicSpeakerId,
            topicId: params.topicId
        }

        const keys = ['delegateId', 'review', 'spokenTime', 'visible'];
        const kType = [0, 1, 0, 0];
        let edits = '';
        let updateQueryStr = 'UPDATE topic_speaker SET ';
        let whereQueryStr = ' WHERE id = ' + params.topicSpeakerId  + ' AND topicId = ' + params.topicId;
        for (let i = 0; i < keys.length; i++) {
            if (params[keys[i]] !== undefined) {
                if (keys[i] != 'review') { res[keys[i]] = params[keys[i]]; }
                edits += keys[i] + ', ';
                if (updateQueryStr != 'UPDATE topic_speaker SET ') { updateQueryStr += ', '; }
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

        broadcastToRoom(user.nsp, user.committeeId + '|' + "delegate", event, res);

        if (params.review !== undefined) { res.review = params.review; }

        broadcastToRoom(user.nsp, user.committeeId + '|' + "admin", event, res);
        broadcastToRoom(user.nsp, user.committeeId + '|' + "dias", event, res);

        let logErr = await generateAndBroadcastLog(user.nsp, user.committeeId, user.sessionId, '|GSL-MOD|: [' + user.title + ' ' + user.name + '] edited (' + edits +  ') for {gslId: ' + res.id + '}', timestampAltered);
        if (logErr) { throw logErr; }

        return [undefined, undefined];
    } catch(err) {
        return [{}, err];
    }
}

exports.handleTopicSpeakerFetch = async (socket, params, event) => {
    try {
        let user = socket.userObj;

        let queryStr = 'SELECT id, delegateId, review, spokenTime, visible, timestamp FROM topic_speaker WHERE topicId IN (SELECT topicId FROM session WHERE id = ' + user.sessionId + ' AND committeeId =  ' + user.committeeId + ')';
        let keys = ['id', 'delegateId', 'spokenTime', 'visible', 'timestamp'];

        if (user.type !== "delegate") {
            keys.push('review');
        }

        let result = await db.query(queryStr);

        let topicSpeakers = [];
        
        for (let i = 0; i < result.length; i++) {
            topicSpeakers.push(hFuncs.duplicateObject(result[i], keys));
        }

        let res = {
            topicSpeakers: topicSpeakers
        }

        return [res, undefined];
    } catch(err) {
        return [{}, undefined];
    }
}

exports.handleGSLCreate = async (socket, params, event) => {
    try {
        let user = socket.userObj;

        let reqDelegate = await db.query('SELECT id FROM delegate WHERE id = ' + params.delegateId + ' AND committeeId = ' + user.committeeId);
        if (!reqDelegate.length) { throw new customError.NotFoundError("delegate not found in current committee"); }
    
        let timestampCreated = hFuncs.parseDate();

        let result = await db.query('INSERT INTO gsl (committeeId, delegateId, review, timestampAdded) VALUES ('
            + user.committeeId + ', ' + params.delegateId + ', "N/A", "' + timestampCreated + '")'
        );

        let getId = await db.query('SELECT id FROM gsl WHERE '
            + 'committeeId = ' + user.committeeId + ' AND '
            + 'delegateId = ' + params.delegateId + ' AND '
            + 'review = "N/A" AND '
            + 'timestampAdded = "' + timestampCreated + '"'
        );

        let res = {
            id: getId[0].id,
            delegateId: params.delegateId,
            spokenTime: 0,
            visible: 1,
            timestampAdded: timestampCreated,
            timestampSpoken: null
        }

        broadcastToRoom(user.nsp, user.committeeId + '|' + "delegate", event, res)

        res.review = "N/A";

        broadcastToRoom(user.nsp, user.committeeId + '|' + "admin", event, res)
        broadcastToRoom(user.nsp, user.committeeId + '|' + "dias", event, res)
        

        let logErr = await generateAndBroadcastLog(user.nsp, user.committeeId, user.sessionId, '|GSL-MOD|: [' + user.title + ' ' + user.name + '] added {gslId: ' + res.id + '}', timestampCreated);
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
            let reqDelegate = await db.query('SELECT id FROM delegate WHERE id = ' + params.delegateId + ' AND committeeId = ' + user.committeeId);
            if (!reqDelegate.length) { throw new customError.NotFoundError("delegate not found in current committee"); }
        }

        let res = {
            id: params.gslId,
        }

        if (params.timestampSpoken) {
            params.timestampSpoken = hFuncs.parseDate();
        }

        const keys = ['delegateId', 'review', 'spokenTime', 'visible', 'timestampSpoken'];
        const kType = [0, 1, 0, 0, 1];
        let edits = '';
        let updateQueryStr = 'UPDATE gsl SET ';
        let whereQueryStr = ' WHERE id = ' + params.gslId + ' AND committeeId = ' + user.committeeId;
        for (let i = 0; i < keys.length; i++) {
            if (params[keys[i]] !== undefined) {
                if (keys[i] != 'review') { res[keys[i]] = params[keys[i]]; }
                edits += keys[i] + ', ';
                if (updateQueryStr != 'UPDATE gsl SET ') { updateQueryStr += ', '; }
                updateQueryStr += keys[i] + ' = ';
                if (kType[i]) { updateQueryStr += '"'; }
                updateQueryStr += params[keys[i]];
                if (kType[i]) { updateQueryStr += '"'; }
            }
        }

        if (updateQueryStr == 'UPDATE gsl SET ') { throw new customError.ValidationError("please specify fields to edit"); }

        let timestampAltered = hFuncs.parseDate();

        let result = await db.query(updateQueryStr + whereQueryStr);

        if (!result.changedRows) { throw new customError.NotFoundError("gsl does not exist or you provided an old value for a field"); }

        broadcastToRoom(user.nsp, user.committeeId + '|' + "delegate", event, res);

        if (params.review !== undefined) { res.review = params.review; }

        broadcastToRoom(user.nsp, user.committeeId + '|' + "admin", event, res);
        broadcastToRoom(user.nsp, user.committeeId + '|' + "dias", event, res);

        let logErr = await generateAndBroadcastLog(user.nsp, user.committeeId, user.sessionId, '|GSL-MOD|: [' + user.title + ' ' + user.name + '] edited (' + edits +  ') for {gslId: ' + res.id + '}', timestampAltered);
        if (logErr) { throw logErr; }

        return [undefined, undefined];
    } catch(err) {
        return [{}, err];
    }
}

exports.handleGSLFetch = async (socket, params, event) => {
    try {
        let user = socket.userObj;

        let fetchFrom = params.lastGSLId;
        if (fetchFrom < 1) {
            fetchFrom = '(SELECT MAX(id) + 1 FROM gsl WHERE committeeId = ' + user.committeeId + ')';
        }

        let selectQuery = 'SELECT id, delegateId, review, spokenTime, visible, timestampAdded, timestampSpoken FROM (SELECT id, delegateId, review, spokenTime, visible, timestampAdded, timestampSpoken FROM gsl WHERE ';
        let restQuery = 'committeeId = ' + user.committeeId + ' AND id < ' + fetchFrom + ' ORDER BY id DESC LIMIT 10) sub ORDER BY id ASC';
        let keys = ['id', 'delegateId', 'spokenTime', 'visible', 'timestampAdded', 'timestampSpoken'];

        if (user.type != "delegate") {
            keys.push('review');
        }

        let result = await db.query(selectQuery + restQuery);

        let gsl = [];
        for (let i = 0; i < result.length; i++) {
            gsl.push(hFuncs.duplicateObject(result[i], keys));
        }

        let res = {
            gsl: gsl
        }

        return [res, undefined];
    } catch(err) {
        return [{}, undefined];
    }
}

// Session Management

exports.handleSessionEdit = async (socket, params, event) => {
    try {
        let user = socket.userObj;

        let res = {};

        if (params.speakerId === 0) {
            params.speakerId = null;
            res.speakerName = "N/A";
            res.speakerImage = "N/A";
        } else if (params.speakerId !== undefined) {
            let reqDelegate = await db.query('SELECT id, countryId FROM delegate WHERE id = ' + params.speakerId + ' AND committeeId = ' + user.committeeId);
            if (!reqDelegate.length) { throw new customError.NotFoundError("delegate not found in current committee"); }
            let speaker = await db.query('SELECT name, imageName FROM country WHERE id = ' + reqDelegate[0].countryId);
            res.speakerName = speaker[0].name;
            if (speaker[0].speakerImage) {
                res.speakerImage = speaker[0].speakerImage;
            }
        }

        if (params.topicId === 0) {
            params.topicId = null;
            res.topicName = "N/A";
        } else if (params.topicId !== undefined) {
            let reqTopic = await db.query('SELECT id, description FROM topic WHERE id = ' + params.topicId + ' AND committeeId = ' + user.committeeId);
            if (!reqTopic.length) { throw new customError.NotFoundError("topic not found in current committee"); }
            res.topicName = reqTopic[0].description;
        }

        const keys = ['topicId', 'speakerId', 'speakerTime', 'topicTime', 'type'];
        const kType = [0, 0, 0, 0, 1];
        let edits = '';
        let updateQueryStr = 'UPDATE session SET ';
        let whereQueryStr = ' WHERE id = ' + user.sessionId  + ' AND committeeId = ' + user.committeeId;
        for (let i = 0; i < keys.length; i++) {
            if (params[keys[i]] !== undefined) {
                res[keys[i]] = params[keys[i]];
                edits += keys[i] + ', ';
                if (updateQueryStr != 'UPDATE session SET ') { updateQueryStr += ', '; }
                updateQueryStr += keys[i] + ' = ';
                if (kType[i]) { updateQueryStr += '"'; }
                updateQueryStr += params[keys[i]];
                if (kType[i]) { updateQueryStr += '"'; }
            }
        }

        if (updateQueryStr == 'UPDATE session SET ') { throw new customError.ValidationError("please specify fields to edit"); }

        let timestampAltered = hFuncs.parseDate();

        let result = await db.query(updateQueryStr + whereQueryStr);

        if (!result.changedRows) { throw new customError.NotFoundError("no new value given, value remains unchanged"); }

        broadcastToRoom(user.nsp, user.committeeId + '|' + "admin", event, res)
        broadcastToRoom(user.nsp, user.committeeId + '|' + "dias", event, res)
        broadcastToRoom(user.nsp, user.committeeId + '|' + "delegate", event, res)

        let logErr = await generateAndBroadcastLog(user.nsp, user.committeeId, user.sessionId, '|SESSION|: [' + user.title + ' ' + user.name + '] edited (' + edits + ') in the session', timestampAltered);
        if (logErr) { throw logErr; }

        return [undefined, undefined];
    } catch(err) {
        return [{}, err];
    }
}

exports.handleSessionTimer = async (socket, params, event) => {
    try {
        let user = socket.userObj;
        const dataArr = ['RESETED', 'PAUSED', 'STARTED'];
        let dataTimer = 'SPEAKER TIMER';

        let timestampAltered = hFuncs.parseDate();

        let res = {
            speakerTimer: params.speakerTimer,
            toggle: params.toggle
        };

        if (params.value) {
            res.value = params.value;
        }

        broadcastToRoom(user.nsp, user.committeeId + '|' + "admin", event, res);
        broadcastToRoom(user.nsp, user.committeeId + '|' + "dias", event, res);
        broadcastToRoom(user.nsp, user.committeeId + '|' + "delegate", event, res);
        
        if (!res.speakerTimer) {
            dataTimer = 'TOPIC TIMER';
        }

        let logErr = await generateAndBroadcastLog(user.nsp, user.committeeId, user.sessionId, '|TIMER|: [' + user.title + ' ' + user.name + '] ' + dataArr[res.toggle] + ' the ' + dataTimer, timestampAltered);
        if (logErr) { throw logErr; }

        return [undefined, undefined];
    } catch(err) {
        return [{}, err];
    }
}

// Committee Management

exports.handleCommitteeLink = async (socket, params, event) => {
    try {
        let user = socket.userObj;

        let res = {};
        let updateQueryStr = 'UPDATE committee SET ';
        let whereQueryStr = ' WHERE id = ' + user.committeeId;
        let edits = '';

        if (params.zoomLink !== undefined) { res.zoomLink = params.zoomLink; updateQueryStr += 'zoomLink = "' + params.zoomLink + '"'; edits += 'zoomLink, ' }
        if (params.driveLink !== undefined) { 
            res.driveLink = params.driveLink;
            if (updateQueryStr != 'UPDATE committee SET ') { updateQueryStr += ' AND '; }
            updateQueryStr += 'driveLink = "' + params.driveLink + '"';
            edits += 'driveLink';
        }

        if (res.zoomLink === undefined && res.driveLink === undefined) { throw new customError.ValidationError("no value supplied for the link"); }

        let timestampAltered = hFuncs.parseDate();

        await db.query(updateQueryStr + whereQueryStr);

        broadcastToRoom(user.nsp, user.committeeId + '|' + "admin", event, res);
        broadcastToRoom(user.nsp, user.committeeId + '|' + "dias", event, res);
        broadcastToRoom(user.nsp, user.committeeId + '|' + "delegate", event, res);

        let logErr = await generateAndBroadcastLog(user.nsp, user.committeeId, user.sessionId, '|COMMITTEE|: [' + user.title + ' ' + user.name + '] updated ' + edits, timestampAltered);
        if (logErr) { throw logErr; }

        return [undefined, undefined];
    } catch(err) {
        return [{}, err];
    }
}

exports.handleNetPing = async (socket, params, event) => {
    try {
        let user = socket.userObj;

        let res = {
            timestamp: hFuncs.parseDate(),
        };

        return [res, undefined];
    } catch(err) {
        return [{}, err];
    }
}
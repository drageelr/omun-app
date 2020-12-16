// 'use strict'

// const WebSocket = require('ws');
// const customError = require('../errors/errors');
// const jwt = require('../services/jwt');
// const Admin = require('../models/admin.model');
// const Dias = require('../models/dias.model');
// const Delegate = require('../models/delegate.model');
// const Committee = require('../models/committee.model');
// const { wsMessageHandler } = require('./ws-handler');
// const url = require('url');
// const { duplicateObject } = require('./helper-funcs');

// const WebSocketServers = {};

// function handleEventListeners(wss) {
//     // wss.userIds = [];

//     wss.on('connection', (ws, req, user, committeeName) => {
//         ws.user = duplicateObject(user, ["_id", "id", "type", "committeeId"]);
//         ws.on('message', (message) => {
//             wsMessageHandler(message, ws);
//         });
//         // ws.on('close', (wss) => {
            
//         // });
//         let res = {
//             type: "DATA",
//             message: "Welcome to " + committeeName + "!"
//         }
//         ws.send(JSON.stringify(res));
//     });
// }

// function getQueryParams(query) {
//     try {
//         let queries = query.split('&');
//         if (queries.length !== 2) { return false; }
//         queries = queries.map((i) => i.split('='));
//         if (queries[0].length !== 2 || queries[1].length !== 2) { return false; }
//         return { token: queries[0][1], committeeId: queries[1][1] };
//     } catch (e) {
//         console.log(e);
//         return false;
//     }
// }


// exports.handleHTTPUpgrade = async (req, socket, head) => {
//     try {
//         const parsedURL = url.parse(req.url) 
//         const pathname = parsedURL.pathname;

//         if (pathname != '/api/session/ws') { throw new customError.NotFoundError("resource not found") }

//         let queryObj = getQueryParams(parsedURL.query);
//         if (queryObj == false) { throw new customError.AuthenticationError("no credentials supplied"); }
//         let token = queryObj.token
//         let committeeId = queryObj.committeeId;
//         let decodedObj = jwt.decodeToken(token);
        
//         let reqUser = false;
//         let reqCommittee = false;
//         if (decodedObj.type == 'admin') {
//             reqUser = await Admin.findById(decodedObj._id, 'adminId');
//             reqCommittee = await Committee.findOne({committeeId: committeeId}, '_id sessionStatus name');
//             if (reqUser) { decodedObj.id = reqUser.adminId; }
//         } else if (decodedObj.type == 'dias') {
//             reqUser = await Dias.findById(decodedObj._id, 'diasId');
//             reqCommittee = await Committee.findOne({committeeId: committeeId}, '_id sessionStatus name');
//             if (reqUser) { decodedObj.id = reqUser.diasId; }
//         } else if (decodedObj.type == 'del') {
//             reqUser = await Delegate.findById(decodedObj._id, 'delegateId committeeId');
//             if (reqUser) {
//                 reqCommittee = await Committee.findOne(reqUser.committeeId, '_id sessionStatus');
//                 decodedObj.id = reqUser.delegateId;
//             }
//         }

//         if (!reqUser || !reqCommittee) { throw new customError.ForbiddenAccessError("invalid header(s)"); }
//         if (!reqCommittee.sessionStatus) { throw new customError.ForbiddenAccessError("session not running"); }

//         let wss = WebSocketServers[reqCommittee._id];
//         if (!wss) {
//             wss = WebSocketServers[reqCommittee._id] = new WebSocket.Server({ noServer: true, clientTracking: true });
//             handleEventListeners(wss);
//         }
        
//         // let dupConnection = false;
//         // for (let i = 0; i < wss.userIds.size; i++) {
//         //     if (wss.userIds[i].id == decodedObj.id && wss.userIds[i].type == decodedObj.type) {
//         //         dupConnection = true;
//         //         break;
//         //     }
//         // }

//         // if (dupConnection) { throw new customError.DuplicateResourceError("connection already exists"); }
        
//         wss.handleUpgrade(req, socket, head, (ws) => {
//             let userObj = {
//                 _id: decodedObj._id,
//                 id: decodedObj.id,
//                 type: decodedObj.type,
//                 committeeId: reqCommittee._id
//             }
//             // wss.userIds.push({id: decodedObj.id, type: decodedObj.type});
//             wss.emit('connection', ws, req, userObj, reqCommittee.name);
//         });

//     } catch(e) {
//         console.log(e);
//         socket.destroy();
//     }
// }
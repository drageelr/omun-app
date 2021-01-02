import React, {Component, useState} from 'react'
import './MainScreen.css'
import InformationBar from './Items/InfoBar/InformationBar'
import Buttons from './Items/Buttons/Buttons'
import Zoom from './Items/Zoom/Zoom'
import Notification from './Items/Notification/Notification'
import VirtualAud from './Items/VirtualAud/VirtualAud'
import MessageBox from './Items/MessageBox/MessageBox'
import io, { Socket } from "socket.io-client"
import { Button } from '@material-ui/core'

let socket;

function MainScreen(){
    let [messages, setMessages] = useState([]);
    
    let tempEmission = [];
    let tempSocket = {};

    React.useEffect(()=>{
        const {committeeId, token} = sessionStorage;
        console.log(window.serverURI+`/${committeeId}?token=${token}`)
        socket = io(window.serverURI+`/${committeeId}?token=${token}`);
        tempSocket = socket;

        // Emitted by Server on Join
        socket.on('RES|info-start', resInfoStart);

        // Error Handler
        socket.on('err', (err) => console.log('err:', err));

        /**
         * RES Event Handlers
         */

        // Chat Management
        socket.on('RES|del-chat-fetch|DEL', resDelChatFetchDel); // Recieved By: ["delegate"]
        socket.on('RES|del-chat-fetch', resDelChatFetch); // Recieved By: ["admin", "dias"]
        socket.on('RES|dias-chat-fetch|DEL', resDiasChatFetchDel); // Recieved By: ["delegate"]
        socket.on('RES|dias-chat-fetch|DIAS', resDiasChatFetchDias); // Recieved By: ["dias"]
        socket.on('RES|del-chat-send', resDelChatSend); // Recieved By: ["admin", "dias", "delegate"]
        socket.on('RES|dias-chat-send', resDiasChatSend); // Recieved By: ["dias", "delegate"]

        // Log & Notification Management
        socket.on('RES|log-fetch', resLogFetch); // Recieved By: ["admin", "dias"]
        socket.on('RES|log-send', resLogSend); // Recieved By: ["admin", "dias"]
        socket.on('RES|notif-fetch', resNotifFetch); // Recieved By: ["admin", "dias", "delegate"]
        socket.on('RES|notif-send', resNotifSend); // Recieved By: ["admin", "dias", "delegate"]

        // Seat Management
        socket.on('RES|seat-sit', resSeatSit); // Recieved By: ["admin", "dias", "delegate"]
        socket.on('RES|seat-unsit', resSeatUnsit); // Recieved By: ["admin", "dias", "delegate"]
        socket.on('RES|seat-placard', resSeatPlacard); // Recieved By: ["admin", "dias", "delegate"]

        // MOD & GSL Management
        socket.on('RES|topic-create', resTopicCreate); // Recieved By: ["admin", "dias", "delegate"]
        socket.on('RES|topic-edit', resTopicEdit); // Recieved By: ["admin", "dias", "delegate"]
        socket.on('RES|topic-fetch', resTopicFetch); // Recieved By: ["admin", "dias", "delegate"]
        socket.on('RES|topic-speaker-create', resTopicSpeakerCreate); // Recieved By: ["admin", "dias", "delegate"]
        socket.on('RES|topic-speaker-edit', resTopicSpeakerEdit); // Recieved By: ["admin", "dias", "delegate"]
        socket.on('RES|topic-speaker-fetch', resTopicSpeakerFetch); // Recieved By: ["admin", "dias", "delegate"]
        socket.on('RES|gsl-create', resGSLCreate); // Recieved By: ["admin", "dias", "delegate"]
        socket.on('RES|gsl-edit', resGSLEdit); // Recieved By: ["admin", "dias", "delegate"]
        socket.on('RES|gsl-fetch', resGSLFetch); // Recieved By: ["admin", "dias", "delegate"]

        // Session Management
        socket.on('RES|session-edit', resSessionEdit); // Recieved By: ["admin", "delegate", "dias"]
        socket.on('RES|session-timer', resSessionTimer); // Recieved By: ["admin", "delegate", "dias"]
        socket.on('RES|session-con', resSessionCon); // Recieved By: ["admin", "delegate", "dias"]

        /**
         * REQ Event Emission
         */

        // Chat Management
        /* 0 */tempEmission.push({event: 'REQ|del-chat-fetch|DEL', req: getDelChatFetchDel()}) // Access: ["delegate"]
        /* 1 */tempEmission.push({event: 'REQ|del-chat-fetch', req: getDelChatFetch()}); // Access: ["admin", "dias"]
        /* 2 */tempEmission.push({event: 'REQ|dias-chat-fetch|DEL', req: getDiasChatFetchDel()}) // Access: ["delegate"]
        /* 3 */tempEmission.push({event: 'REQ|dias-chat-fetch|DIAS', req: getDiasChatFetchDias()}) // Access: ["dias"]
        /* 4 */tempEmission.push({event: 'REQ|del-chat-send', req: getDelChatSend()}) // Access: ["delegate"]
        /* 5 */tempEmission.push({event: 'REQ|dias-chat-send', req: getDiasChatSend()}); // Access: ["dias", "delegate"]

        // Log & Notification Management
        /* 6 */tempEmission.push({event: 'REQ|log-fetch', req: getLogFetch()}); // Access: ["admin", "dias"]
        /* 7 */tempEmission.push({event: 'REQ|notif-fetch', req: getNotifFetch()}); // Access: ["admin", "dias", "delegate"]
        /* 8 */tempEmission.push({event: 'REQ|notif-send', req: getNotifSend()}); // Access: ["dias"]

        // Seat Management
        /* 9 */tempEmission.push({event: 'REQ|seat-sit', req: getSeatSit()}); // Access: ["delegate"]
        /* 10 */tempEmission.push({event: 'REQ|seat-unsit', req: getSeatUnsit()}); // Access: ["delegate"]
        /* 11 */tempEmission.push({event: 'REQ|seat-placard', req: getSeatPlacard()}); // Access: ["delegate"]

        // MOD & GSL Management
        /* 12 */tempEmission.push({event: 'REQ|topic-create', req: getTopicCreate()}); // Access: ["dias"]
        /* 13 */tempEmission.push({event: 'REQ|topic-edit', req: getTopicEdit()}); // Access: ["dias"]
        /* 14 */tempEmission.push({event: 'REQ|topic-fetch', req: getTopicFetch()}); // Access: ["admin", "dias", "delegate"]
        /* 15 */tempEmission.push({event: 'REQ|topic-speaker-create', req: getTopicSpeakerCreate()}); // Access: ["dias"]
        /* 16 */tempEmission.push({event: 'REQ|topic-speaker-edit', req: getTopicSpeakerEdit()}); // Access: ["dias"]
        /* 17 */tempEmission.push({event: 'REQ|topic-speaker-fetch', req: getTopicSpeakerFetch()}); // Access: ["admin", "dias", "delegate"]
        /* 18 */tempEmission.push({event: 'REQ|gsl-create', req: getGSLCreate()}); // Access: ["dias"]
        /* 19 */tempEmission.push({event: 'REQ|gsl-edit', req: getGSLEdit()}); // Access: ["dias"]
        /* 20 */tempEmission.push({event: 'REQ|gsl-fetch', req: getGSLFetch()}); // Access: ["admin", "dias", "delegate"]

        // Session Management
        /* 21 */tempEmission.push({event: 'REQ|session-edit', req: getSessionEdit()}); // Access: ["dias"]
        /* 22 */tempEmission.push({event: 'REQ|session-timer', req: getSessionTimer()}); // Access: ["dias"]

    }, []);

    function tempOnClick() {
        let findex = prompt("Enter Socket Emit Function Number");
        if (findex >= tempEmission.length || findex < 0) { alert("Out Of Bounds"); return; }
        let req = tempEmission[findex].req;
        let event = tempEmission[findex].event;
        let keys = Object.keys(req);
        for (let i = 0; i < keys.length; i++) {
            let currentData = req[keys[i]];
            let givenData = prompt("Enter Value For '" + keys[i] + "'");
            if (typeof currentData == "number") {
                givenData = parseInt(givenData);
            } else if (typeof currentData == "boolean") {
                if (givenData == '0' || givenData == 'false') {
                    givenData = false;
                } else {
                    givenData = true;
                }
            }
            req[keys[i]] = givenData;
        }
        console.log(event + ':', req);
        tempSocket.emit(event, req);
    }

    function resInfoStart(res) { 
        console.log('RES|info-start:', res);
    }

    function resDelChatFetchDel(res) {
        /**
         * When this is recieved you have to append the array of the target delegate (specified by "delegateId")
         * and using "chat[i].id" check where to append in the array (usually at the start so don't need to check all elements)
         * and using "senderDelegateId" and "recipientDelegateId" check whether target delegate sent this or this delegate sent this
         */
        
        /**
         * res = {
         *      delegateId: Number,
         *      chat: [{
         *          id: Number,
         *          senderDelegateId: Number,
         *          recipientDelegateId: Number,
         *          message: String.min(1).max(250),
         *          timestamp: String.format('YYYY-MM-DD HH:mm:ss')
         *      }]
         * }
         */
        console.log('RES|del-chat-fetch|DEL:', res);
    }

    function resDelChatFetch(res) {
         /**
         * When this is recieved you have to append the array of the target chat between 2 delegates (specified by "delegate1Id" and "delegate2Id")
         */
        
        /**
         * res = {
         *      delegate1Id: Number,
         *      delegate2Id: Number,
         *      chat: [{
         *          id: Number,
         *          senderDelegateId: Number,
         *          recipientDelegateId: Number,
         *          message: String.min(1).max(250),
         *          timestamp: String.format('YYYY-MM-DD HH:mm:ss')
         *      }]
         * }
         */
        console.log('RES|del-chat-fetch:', res);
    }

    function resDiasChatFetchDel(res) {
        /**
         * When this is recieved you have to append the array of the target dias (specified by "diasId")
         * and using "chat[i].id" check where to append in the array (usually at the start so don't need to check all elements)
         * and using "diasSent" check whether dias sent or delegate sent this message
         */
        
        /**
         * res = {
         *      diasId: Number,
         *      chat: [{
         *          id: Number,
         *          delegateId: Number,
         *          diasId: Number,
         *          message: String.min(1).max(250),
         *          diasSent: Boolean,
         *          timestamp: String.format('YYYY-MM-DD HH:mm:ss')
         *      }]
         * }
         */
        console.log('RES|dias-chat-fetch|DEL:', res);
    }

    function resDiasChatFetchDias(res) {
        /**
         * When this is recieved you have to append the array of the target delegate (specified by "delegateId")
         * and using "chat[i].id" check where to append in the array (usually at the start so don't need to check all elements)
         * and using "diasSent" check whether dias sent or delegate sent this message
         */
        
        /**
         * res = {
         *      delegateId: Number,
         *      chat: [{
         *          id: Number,
         *          delegateId: Number,
         *          diasId: Number,
         *          message: String.min(1).max(250),
         *          diasSent: Boolean,
         *          timestamp: String.format('YYYY-MM-DD HH:mm:ss')
         *      }]
         * }
         */
        console.log('RES|dias-chat-fetch|DIAS:', res);
    }

    function resDelChatSend(res) {
        /**
         * This is received by all admins, all dias but only sender and reciever delegates
         * When received, append in the chat array of the target delegate which can be checked by:
         *      Recved by Delegate:
         *          Match the own id with the given ids to identify target delegate
         *      Recved by Admin:
         *          Simply store in the array you have for these 2 delegates 
         */

        /**
         * res = {
         *      id: Number,
         *      senderDelegateId: Number,
         *      recipientDelegateId: Number,
         *      message: String.min(1).max(250),
         *      timestamp: String.format('YYYY-MM-DD HH:mm:ss')
         * }
         */
        console.log('RES|del-chat-send:', res);
    }

    function resDiasChatSend(res) {
        /**
         * This is received by the delegate and dias that is communicating with each other
         * When received, append in the chat array of the target user
         */

        /**
         * res = {
         *      id: Number,
         *      delegateId: Number,
         *      diasId: Number,
         *      message: String.min(1).max(250),
         *      diasSent: Boolean,
         *      timestamp: String.format('YYYY-MM-DD HH:mm:ss')
         * }
         */
        console.log('RES|dias-chat-send:', res);
    }

    function resLogFetch(res) {
        /**
         * When this is received you have to append the array
         * use the "id" to check where to append (usually it will be in the start)
         */

        /**
         * res = {
         *      logs: [{
         *          id: Number,
         *          message: String.min(1).max(500),
         *          timestamp: String.format('YYYY-MM-DD HH:mm:ss')
         *      }]
         * }
         */
        console.log('RES|log-fetch:', res)
    }

    function resLogSend(res) {
        /**
         * This is received by every admin and/or dias present in the committee
         * Just append the logs at the end
         */

        /**
         * res = {
         *      id: Number,
         *      message: String.min(1).max(500),
         *      timestamp: String.format('YYYY-MM-DD HH:mm:ss')
         * }
         */
        console.log('RES|log-send:', res);
    }

    function resNotifFetch(res) {
        /**
         * When this is received you have to append the array
         * use the "id" to check where to append (usually it will be in the start)
         * use "diasId" to get their name to be displayed with the notification
         */

        /**
         * res = {
         *      notifications: [{
         *          id: Number,
         *          diasId: Number,
         *          message: String.min(1).max(500),
         *          timestamp: String.format('YYYY-MM-DD HH:mm:ss')
         *      }]
         * }
         */
        console.log('RES|notif-fetch:', res)
    }

    function resNotifSend(res) {
        /**
         * This is received by every admin, dias and/or delegate present in the committee
         * Just append the notification at the end
         */

        /**
         * res = {
         *      id: Number,
         *      diasId: Number,
         *      message: String.min(1).max(500),
         *      timestamp: String.format('YYYY-MM-DD HH:mm:ss')
         * }
         */
        console.log('RES|notif-send:', res);
    }

    function resSeatSit(res) {
         /**
         * When recieved set the seat (specified by "id") values:
         * "delegateId:" given "delegateId"
         * "placard": false
         */

        /**
         * res = {
         *      id: Number.min(1).max(50),
         *      delegateId: Number
         * }
         */

        console.log('RES|seat-sit:', res);
    }

    function resSeatUnsit(res) {
        /**
         * When recieved set the seat (specified by "id") values:
         * "delegateId:" null
         * "placard": false
         */

        /**
         * res = {
         *      id: Number.min(1).max(50)
         * }
         */
        console.log('RES|seat-unsit:', res);
    }

    function resSeatPlacard(res) {
        /**
         * When recieved set the seat (specified by "id") placard value to given "placard"
         */

        /**
         * res = {
         *      id: Number.min(1).max(50),
         *      placard: Boolean
         * }
         */
        console.log('RES|seat-placard:', res);
    }

    function resTopicCreate(res) {
        /**
         * This is received by every admin, dias and/or delegate present in the committee
         * Just append the topics at the top
         */

        /**
         * res = {
        *       id: Number,
        *       delegateId: Number,
        *       description: String.min(0).max(250)
        *       totalTime: Number,
        *       speakerTime: Number,
        *       visible: Boolean,
        *       timestamp: String.format('YYYY-MM-DD HH:mm:ss')
         * }
         */
        console.log('RES|topic-create:', res);
    }
    
    function resTopicEdit(res) {
        /**
         * This is received by every admin, dias and/or delegate present in the committee
         * Just alter the topic identified by "id" in topics
         * NOTE: only edited attributes received
         */

        /**
         * res = {
        *       id: Number, // Always sent
        *       delegateId: Number,
        *       description: String.min(0).max(250)
        *       totalTime: Number,
        *       speakerTime: Number,
        *       visible: Boolean,
        *       timestamp: String.format('YYYY-MM-DD HH:mm:ss')
         * }
         */
        console.log('RES|topic-edit:', res);
    }

    function resTopicFetch(res) {
        /**
         * When this is received you have to append the array
         * use the "id" to check where to append (usually it will be in the start)
         */
        
        /**
         * res = {
         *      id: Number, // Always sent
         *      delegateId: Number,
         *      description: String.min(0).max(250)
         *      totalTime: Number,
         *      speakerTime: Number,
         *      visible: Boolean,
         *      timestamp: String.format('YYYY-MM-DD HH:mm:ss')
         * }
         */
        console.log('RES|topic-fetch:', res);
    }

    function resTopicSpeakerCreate(res) {

    }

    function resTopicSpeakerEdit(res) {

    }

    function resTopicSpeakerFetch(res) {

    }

    function resGSLCreate(res) {
        /**
         * This is received by every admin, dias and/or delegate present in the committee
         * Just append the gsl at the top
         */

        /**
         * res = {
         *      id: Number,
         *      delegateId: Number,
         *      review: String.min(0).max(500) // Not received by delegate
         *      totalTime: Number,
         *      spokenTime: 0,
         *      visible: Boolean,
         *      timestampAdded: String.format('YYYY-MM-DD HH:mm:ss')
         *      timestampAdded: String.format('YYYY-MM-DD HH:mm:ss') // Can be null
         * }
         */
        console.log('RES|gsl-create:', res);
    }

    function resGSLEdit(res) {
        /**
         * This is received by every admin, dias and/or delegate present in the committee
         * Just alter the topic identified by "id" in gsl
         * NOTE: only edited attributes received
         */

        /**
         * res = {
         *      id: Number, // Always sent
         *      delegateId: Number,
         *      review: String.min(0).max(500) // Not received by delegate
         *      totalTime: Number,
         *      spokenTime: 0,
         *      visible: Boolean,
         *      timestampAdded: String.format('YYYY-MM-DD HH:mm:ss')
         *      timestampAdded: String.format('YYYY-MM-DD HH:mm:ss') // Can be null
         * }
         */
        console.log('RES|gsl-edit:', res);
    }

    function resGSLFetch(res) {
         /**
         * When this is received you have to append the array
         * use the "id" to check where to append (usually it will be in the start)
         */

        /**
         * res = {
         *      gsl: [{
         *          id: Number, // Always sent
         *          delegateId: Number,
         *          review: String.min(0).max(500) // Not received by delegate
         *          totalTime: Number,
         *          spokenTime: 0,
         *          visible: Boolean,
         *          timestampAdded: String.format('YYYY-MM-DD HH:mm:ss')
         *          timestampAdded: String.format('YYYY-MM-DD HH:mm:ss') // Can be null
         *      }]
         * }
         */
        console.log('RES|gsl-fetch:', res)
    }

    function resSessionEdit(res) {
        /**
         * This is received by every admin, dias and/or delegate present in the committee
         * Just alter the fields that are recieved
         * NOTE: All are optional
         */
        
        /**
         * res = {
         *      topicId: Number,
         *      speakerId: Number,
         *      speakerTime: Number,
         *      topicTime: Number,
         *      type: String.min(0).max(10) // can be null
         * }
         */

        console.log('RES|session-edit:', res);
    }

    function resSessionTimer(res) {
        /**
         * When received apply the appropraite result on the specified timer
         */

        /**
         * res = {
         *      speakerTimer: Boolean,
         *      toggle: Number // 0->reset 1->pause 2->play
         * }
         */
        console.log('RES|session-timer:', res);
    }

    function resSessionCon(res) {
        /**
         * Tells whether a member connected or disconnected
         */

        /**
         * res = {
         *      type: String ("admin", "dias", "delegate"),
         *      userId: Number,
         *      connected: Boolean
         * }
         */
        console.log('RES|session-con:', res);
    }

    function getDelChatFetchDel() {
        /**
         * This function is used to fetch last 10 messages of this delegate's chat with target delegate
         * This event is supposed to be emitted when the loading sign is clicked in a chat box
         */
        
        let req = {
            // id of target delegate
            delegateId: 2,
            // id of the oldest message (if no message then send 0)
            lastMessageId: 0
        };

        return req;
    }

    function getDelChatFetch() {
        /**
         * This function is used to fetch last 10 messages of the chat between the 2 delegates
         * This event is supposed to be emitted when the loading sign is clicked in a chat box
         */
        
        let req = {
            // id of delegate 1
            delegate1Id: 2,
            // id of delegate 1
            delegate2Id: 2,
            // id of the oldest message (if no message then send 0)
            lastMessageId: 0
        };

        return req;
    }

    function getDiasChatFetchDel() {
        /**
         * This function is used to fetch last 10 messages of this delegate's chat with target dias
         * This event is supposed to be emitted when the loading sign is clicked in a chat box
         */
        
        let req = {
            // id of target dias
            diasId: 2,
            // id of the oldest message (if no message then send 0)
            lastMessageId: 0
        };

        return req;
    }

    function getDiasChatFetchDias() {
        /**
         * This function is used to fetch last 10 messages of this dias's chat with target delegate
         * This event is supposed to be emitted when the loading sign is clicked in a chat box
         */
        
        let req = {
            // id of target delegate
            delegateId: 2,
            // id of the oldest message (if no message then send 0)
            lastMessageId: 0
        };

        return req;
    }

    function getDelChatSend() {
        /**
         * This function is used to send message to target delegate
         * This event is supposed to be emitted when the send button is pressed on the chat box
         */
        
        let req = {
            // id of target delegate
            delegateId: 2,
            // message to send "String.min(1).max(250)"
            message: "Hello Bro!"
        };

        return req;
    }

    function getDiasChatSend() {
        /**
         * This function is used to send message to target user
         * This event is supposed to be emitted when the send button is pressed on the chat box
         */
        
        let req = {
            // id of target user
            userId: 2,
            // message to send "String.min(1).max(250)"
            message: "Hello Bro!"
        };

        return req;
    }

    function getLogFetch() {
        /**
         * This function is used to fetch last 10 logs
         * This event is supposed to be emitted when the loading sign is clicked in the log box
         */

        let req = {
            // id of the oldest log (if no log then send 0)
            lastLogId: 0
        };

        return req;
    }

    function getNotifFetch() {
        /**
         * This function is used to fetch last 10 notifications
         * This event is supposed to be emitted when the loading sign is clicked in the notifications box
         */

        let req = {
            // id of the oldest notification (if no notification then send 0)
            lastNotifId: 0
        };

        return req;
    }

    function getNotifSend() {
        /**
         * This function is used to send notification
         * This event is supposed to be emitted when the send button is pressed on the notification box
         */
        
        let req = {
            // message to send "String.min(1).max(250)"
            message: "Hello Committee!"
        };

        return req;
    }

    function getSeatSit() {
        /**
         * Emit this when delegate wants to sit somewhere
         */

        let req = {
            // Number.min(1).max(50)
            seatId: 1
        };

        return req;
    }

    function getSeatUnsit() {
        /**
         * Called by delegate when they press on leave seat
         */

        return {};
    }

    function getSeatPlacard() {
        /**
         * Just called to toggle placard value (either true or false)
         */

        let req = {
            // raise -> true | lower -> false
            placard: true
        };

        return req;
    }

    function getTopicCreate() {
        /**
         * Call this when a new topic is to be created
         */

        let req = {
            // id of the delegate who proposed this topic
            delegateId: 2,
            // desc of topic
            description: "Topic Desc",
            // total time for the topic
            totalTime: 120,
            // individual speaker time for the topic
            speakerTime: 30
        }

        return req;
    }

    function getTopicEdit() {
        /**
         * Only "topicId" is required, rest is optional
         * This will be used to edit the topic by the dias
         */


        let req = {
            // id of topic to edit
            topicId: 1, // REQUIRED
            // id of the delegate who proposed this topic
            delegateId: 2,
            // desc of topic
            description: "Topic Desc",
            // total time for the topic
            totalTime: 120,
            // individual speaker time for the topic
            speakerTime: 30,
            // to toggle visiblity for delegates
            visible: true
        }

        return req;
    }

    function getTopicFetch() {
        /**
         * This function is used to fetch last 10 topics (will fetch only visible ones for "delegates" automatically)
         * This event is supposed to be emitted when the loading sign is clicked in the topics box
         */

        let req = {
            // id of the oldest topic (if no topic then send 0)
            lastTopicId: 0
        }

        return req;
    }

    function getTopicSpeakerCreate() {

    }

    function getTopicSpeakerEdit() {

    }

    function getTopicSpeakerFetch() {

    }

    function getGSLCreate() {
        /**
         * Call this when a new gsl is to be created
         */

        let req = {
            // id of the delegate to add
            delegateId: 2,
        }

        return req;
    }

    function getGSLEdit() {
        /**
         * Only "gslId" is required, rest is optional
         * This will be used to edit the gsl by the dias and some auto features
         */


        let req = {
            // id of gsl to edit
            gslId: 1, // REQUIRED
            // id of the delegate to change
            delegateId: 2,
            // review for speaker "String.min(0).max(500)"
            review: "Speaker Review",
            // time that the delegate spoke for
            spokenTime: 30,
            // to toggle visiblity for delegates
            visible: true,
            // will tell server to timestamp
            timestampSpoken: true
        }

        return req;
    }

    function getGSLFetch() {
        /**
         * This function is used to fetch last 10 topics (will fetch only visible ones for "delegates" automatically)
         * This event is supposed to be emitted when the loading sign is clicked in the topics box
         */

        let req = {
            // id of the oldest topic (if no topic then send 0)
            lastGSLId: 0
        }

        return req;
    }

    function getSessionEdit() {
        
        let req = {
            // to change topic
            topicId: 1,
            // to change current speaker
            speakerId: 1,
            // whenever speaker total duration changed
            speakerTime: 1,
            // whenever topic total duration changed
            topicTime: 1,
            // whenever button toggled
            type: "IDLE"
        };

        return req;
    }

    function getSessionTimer() {
        /**
         * Will be used to play/pause/reset both speaker and topic timers
         */

        let req = {
            // true->SpeakerTimer false->TopicTimer
            speakerTimer: true,
            // 0->reset 1->pause 2->play
            toggle: 0,
        };

        return req;
    }

    return(
        <div className='parent'>
            <div className= 'Information-Bar'><InformationBar/>
                <div style={{marginTop:'2vh'}} className='Zoom'><Zoom/>
                    <Button onClick={tempOnClick} color="primary" size="large">TEMP BUTTON</Button>
                    <div  style={{marginTop:'2vh'}} className='Buttons'><Buttons/></div>
                </div>
            </div>
            <div className='Notifications'><Notification/>
                <div style={{marginTop:'2vh'}} className='Virtual-Aud'><VirtualAud/>
                    <div style={{marginTop:'2vh' , paddingRight:'20px'}} className='MessageBox'><MessageBox/></div>
                </div>
            </div>
            
            
        </div>
        
    )
    
}

export default MainScreen
import React, {Component, useState} from 'react'
import './MainScreen.css'
import InformationBar from './Items/InfoBar/InformationBar'
import Zoom from './Items/Zoom/Zoom'
import Notification from './Items/Notification/Notification'
import VirtualAud from './Items/VirtualAud/VirtualAud'
import MessageBox from './Items/MessageBox/MessageBox'
import io from "socket.io-client"
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import DescriptionIcon from '@material-ui/icons/Description'
import { Button } from '@material-ui/core'

let socket;
let user;

export default function MainScreen(){
    let [chats, setChats] = useState({});
    let [connected, setConnected] = useState(false);
    let [session, setSession] = useState({});
    let [seats, setSeats] = useState([]);
    let [connectedDias, setConnectedDias] = useState([]);
    let [connectedDelegates, setConnectedDelegates] = useState([]);
    let [connectedAdmins, setConnectedAdmins] = useState({});
    let [msgCounter, setMsgCounter] = useState(0);
    const [theirId, setTheirId] = React.useState('');
    let [info, setInfo] = useState({});
    let [userState, setUserState] = useState({});
    let tempEmission = [];
    let tempSocket = {};

    /*  
    info:
        committee: {id: 1, name: "Disarmament and International Security Committee"}
        connectedAdmins: []
        connectedDelegates: []
        connectedDias: ["1"] //id
        countries: (2) [{id, name, initials}]
        delegates: (2) [{id, country}]
        dias: (2) [{id, name, title}]
        seats: (50) [{id, delegateId, placard}]
        session: {id: 5, topicId: null, speakerId: null, speakerTime: 0, topicTime: 0, type: null}
    */


    React.useEffect(()=>{
        const { token, committeeId } = sessionStorage;
        let userSS = JSON.parse(sessionStorage.getItem('user')); //also extract user
        // console.log(userSS);
        user = userSS;
        setUserState(userSS);
        socket = io(window.serverURI+`/${committeeId}?token=${token}`);
        tempSocket = socket;

        // Emitted by Server on Join
        socket.on('RES|info-start', responseInfoStart);

        // Error Handler
        socket.on('err', (err) => {
            console.error('err:', err);
            alert(JSON.stringify(err));
        });

        /**
         * RES Event Handlers
         */

        // Chat Management
        socket.on('RES|del-chat-fetch|DEL', responseDelChatFetchDel); // Recieved By: ["delegate"]
        socket.on('RES|del-chat-fetch', responseDelChatFetch); // Recieved By: ["admin", "dias"]
        socket.on('RES|dias-chat-fetch|DEL', responseDiasChatFetchDel); // Recieved By: ["delegate"]
        socket.on('RES|dias-chat-fetch|DIAS', responseDiasChatFetchDias); // Recieved By: ["dias"]
        socket.on('RES|del-chat-send', responseDelChatSend); // Recieved By: ["admin", "dias", "delegate"]
        socket.on('RES|dias-chat-send', responseDiasChatSend); // Recieved By: ["dias", "delegate"]

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

        // Session Management

        // Extra Management

        /**
         * REQ Event Emission
         */

        // Chat Management
        // tempEmission.push({event: 'REQ|del-chat-fetch|DEL', req: requestDelChatFetchDel()}) // Access: ["delegate"]
        tempEmission.push({event: 'REQ|del-chat-fetch', req: requestDelChatFetch()}); // Access: ["admin", "dias"]
        // tempEmission.push({event: 'REQ|dias-chat-fetch|DEL', req: requestDiasChatFetchDel()}) // Access: ["delegate"]
        tempEmission.push({event: 'REQ|dias-chat-fetch|DIAS', req: requestDiasChatFetchDias()}) // Access: ["dias"]
        // tempEmission.push({event: 'REQ|del-chat-send', req: requestDelChatSend()}) // Access: ["delegate"]
        // tempEmission.push({event: 'REQ|dias-chat-send', req: requestDiasChatSend()}); // Access: ["dias", "delegate"]

        // Log & Notification Management
        tempEmission.push({event: 'REQ|log-fetch', req: getLogFetch()}); // Access: ["admin", "dias"]
        tempEmission.push({event: 'REQ|notif-fetch', req: getNotifFetch()}); // Access: ["admin", "dias", "delegate"]
        tempEmission.push({event: 'REQ|notif-send', req: getNotifSend()}); // Access: ["dias"]

        // Seat Management
        tempEmission.push({event: 'REQ|seat-sit', req: getSeatSit()}); // Access: ["delegate"]
        tempEmission.push({event: 'REQ|seat-unsit', req: getSeatUnsit()}); // Access: ["delegate"]
        tempEmission.push({event: 'REQ|seat-placard', req: getSeatPlacard()}); // Access: ["delegate"]

        // MOD & GSL Management

        // Session Management

        
        // Initial fetches
        // if (user.type=="delegate") {
        //     tempSocket.emit('REQ|del-chat-fetch|DEL', {})
        //     tempSocket.emit('REQ|dias-chat-fetch|DEL', {})
        // }
        // else if (user.type == "dias") {
        //     tempSocket.emit('REQ|del-chat-fetch')
        //     tempSocket.emit('REQ|dias-chat-fetch|DIAS', {})
        // }
        // else { //admin
        //     tempSocket.emit('REQ|del-chat-fetch', {})
        // }

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

    function responseInfoStart(res) { 
        console.log('RES|info-start:', res);
        let rawInfo = res;
        // need to store states for the following as they will be updated
        Object.keys(rawInfo.seats).forEach(seatId => {
            rawInfo.seats[seatId].id = seatId; 
        })// add seat id
        setSeats(Object.values(rawInfo.seats));
        setSession(rawInfo.session);
        setConnectedAdmins(rawInfo.connectedAdmins);
        setConnectedDias(rawInfo.connectedDias);
        setConnectedDelegates(rawInfo.connectedDelegates);
        setConnected(true);
        
        // include delegate countries inside delegate
        let updatedDelegates = rawInfo.delegates;
        Object.keys(rawInfo.delegates).forEach(delegateId => {
            const delegateInfo = rawInfo.delegates[delegateId];
            let delegateCountry = rawInfo.countries[delegateInfo.countryId]; // get delegate's country
            delegateCountry.countryName = delegateCountry.name;
            delete delegateCountry.name; //renamed country's name attribute so it does not replace delegate's
            updatedDelegates[delegateId] = {...delegateInfo, ...delegateCountry} //merge
        })
        rawInfo.delegates = updatedDelegates;
        
        // storing dias and delegates in list form as well
        rawInfo.diasList = [];
        Object.keys(rawInfo.dias).forEach(id => {
            rawInfo.diasList.push({id, ...rawInfo.dias[id]})
        })

        rawInfo.delegatesList = [];
        Object.keys(rawInfo.delegates).forEach(id => {
            rawInfo.delegatesList.push({id, ...rawInfo.delegates[id]})
        })


        setInfo(rawInfo);
    }

    function responseDelChatFetchDel(res) {
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
        const chatId = `${res.delegateId}|delegate`; //fetched chat with this delegate 
        const fetchedChatMsgs = res.chat.map(chatMsg => ({...chatMsg, senderId: chatMsg.senderDelegateId, senderType: 'delegate'}));
        console.log(chatId, fetchedChatMsgs);
        chats[chatId] = fetchedChatMsgs.concat(chats[chatId] !== undefined ? chats[chatId] : []);
        setChats(chats); //concat older chat messages to head of specific chat
        setMsgCounter(++msgCounter);
    }

    function responseDelChatFetch(res) {
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

    function responseDiasChatFetchDel(res) {
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
        const chatId = `${res.diasId}|dias`; //fetched this dias's chat
        const fetchedChatMsgs = res.chat.map(chatMsg => {
            const {diasId, diasSent, delegateId} = chatMsg;
            if (diasSent) {
                chatMsg.senderId = diasId;
                chatMsg.senderType = 'dias';
            }
            else {
                chatMsg.senderId = delegateId;
                chatMsg.senderType = 'delegate';
            }
            return chatMsg;
        });
        console.log(chatId, fetchedChatMsgs);
        chats[chatId] = fetchedChatMsgs.concat(chats[chatId] !== undefined ? chats[chatId] : []);
        setChats(chats); //concat older chat messages to head of specific chat
        setMsgCounter(++msgCounter);
    }

    function responseDiasChatFetchDias(res) {
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


    function responseDelChatSend(res) {
        /**
         * This is received by all admins, all dias but only sender and reciever delegates
         * When received, append in the chat array of the target delegate which can be checked by:
         *      Recved by Delegate:
         *          Match the own id with the given ids to identify target delegate
         *      Recved by Admin:
         *          Simply store in the array you have for these 2 delegates 
         */

        console.log('RES|del-chat-send:', res);
        const { id, message, timestamp, senderDelegateId, recipientDelegateId } = res;
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
        let moreAttributes = {
            senderId: senderDelegateId, 
            senderType: 'delegate'
        };
        
        if (Number(user.id) == senderDelegateId) {
            moreAttributes.theirChatId = `${recipientDelegateId}|delegate`;
        }
        else if (Number(user.id) == recipientDelegateId) {
            moreAttributes.theirChatId = `${senderDelegateId}|delegate`;
        }
        pushChatMsg({ id, message, timestamp, ...moreAttributes });
    }

    function responseDiasChatSend(res) {
        /**
         * This is received by the delegate and dias that is communicating with each other
         * When received, append in the chat array of the target user
         */

        console.log('RES|dias-chat-send:', res);
        const { id, delegateId, diasId, message, diasSent, timestamp } = res;
        /**
         * res = {
         *      id: Number,
         *      senderDelegateId: Number,
         *      recipientDelegateId: Number,
         *      message: String.min(1).max(250),
         *      timestamp: String.format('YYYY-MM-DD HH:mm:ss')
         * }
         */
        let moreAttributes = {
            senderId: diasSent ? diasId : delegateId, 
            senderType: diasSent ? 'dias' : 'delegate'
        };
        
        if (Number(user.id) == diasId && user.type == 'dias') {
            moreAttributes.theirChatId = `${delegateId}|delegate`;
        }
        else if (Number(user.id) == delegateId && user.type == 'delegate') {
            moreAttributes.theirChatId = `${diasId}|dias`;
        }

        pushChatMsg({ id, message, timestamp, ...moreAttributes });
        
    }


    function pushChatMsg(chatMsg) {
        const theirChatId = chatMsg.theirChatId;
        if (!chats[theirChatId]) {
            chats[theirChatId] = [];
        }
        console.log("Pushing",chatMsg, "at", theirChatId);

        chats[theirChatId].push(chatMsg);
        setChats(chats);
        setMsgCounter(++msgCounter); // to trigger the chat to update
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


    function requestDelChatFetch() {
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

    function requestDiasChatFetchDias() {
        /**
         * This function is used to fetch last 10 messages of this dias's chat with target delegate
         * This event is supposed to be emitted when the loading sign is clicked in a chat box
         */
        
        let req = { // id of target delegate
            delegateId: 2,// id of the oldest message (if no message then send 0)
            lastMessageId: 0
        };

        return req;
    }


    function fetchChat(chatId) { //userId, type = delegate / dias
        /**
         * This function is used to fetch last 10 messages of this delegate's chat with target delegate
         * This event is supposed to be emitted when the loading sign is clicked in a chat box
         */
        
        // getting id of oldest message in chat
        const [targetIdStr, targetType] = chatId.split('|');
        const targetId = Number(targetIdStr);
        
        let lastMessageId = 0;
        if (chats[chatId]) { //if already chat exists
            lastMessageId = chats[chatId][0].id; //first message in chat is last
        }

        console.log("fetchChat", chatId, lastMessageId);
        if (user.type == "delegate" && targetType == "delegate") {
            socket.emit('REQ|del-chat-fetch|DEL', {delegateId: targetId, lastMessageId});   // id of the oldest message (if no message then send 0)
        }
        else { //dias
            socket.emit('REQ|dias-chat-fetch|DEL', {diasId: targetId, lastMessageId});
        }
    }


    function sendMsg(targetId, targetType, message) { //userId, type = delegate / dias, message to send "String.min(1).max(250)"
        /**
         * This function is used to send message to target delegate/dias according to targetType
         * This event is supposed to be emitted when the send button is pressed on the chat box
         */
        console.log("sendMsg", targetId, targetType, message);
        if (user.type == "delegate" && targetType == "delegate") {
            socket.emit('REQ|del-chat-send', {delegateId: targetId, message}); 
        }
        else { //dias
            socket.emit('REQ|dias-chat-send', {userId: targetId, message});
        }
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
            // id of the oldest log (if no log then send 0)
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


    return(
        <div className='parent'>
            <div className= 'Information-Bar'><InformationBar/>
                <div style={{marginTop:'2vh'}} className='Zoom'><Zoom/>
                    <div  style={{marginTop:'2vh'}} className='Buttons'>
                        <div>
                            <Button variant="contained" color="primary" startIcon={<ExitToAppIcon/>} >Leave Session</Button>
                            &nbsp;&nbsp;
                            <Button variant="contained" color="grey.300" startIcon={<DescriptionIcon/>} >Files</Button>
                            &nbsp;&nbsp;
                            <Button onClick={tempOnClick} variant="contained" color="secondary">TEMP BUTTON</Button>
                        </div>
                    </div>
                </div>
            </div>
            
            {
                connected && 
                <div className='Notifications'><Notification/>
                    <div style={{marginTop:'2vh'}} className='Virtual-Aud'>
                        <VirtualAud 
                        seats={seats}
                        />
                        <div style={{marginTop:'2vh' , paddingRight:'20px'}} className='MessageBox'>
                            <MessageBox 
                            id={Number(userState.id)} 
                            type={userState.type} 
                            dias={info.dias}
                            delegates={info.delegates}
                            diasList={info.diasList} 
                            delegatesList={info.delegatesList}
                            currentChat={chats[theirId]}
                            setChats={setChats}
                            theirId={theirId}
                            setTheirId={setTheirId}
                            msgCounter={msgCounter}
                            sendMsg={sendMsg}
                            fetchChat={fetchChat}
                            />
                        </div>
                    </div>
                </div>
            }
            
            
        </div>
        
    )
    
}
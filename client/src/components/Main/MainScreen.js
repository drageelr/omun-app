import React, {useState} from 'react'
import './MainScreen.css'
import InformationBar from './Items/InfoBar/InformationBar'
import Notification from './Items/Notification/Notification'
import VirtualAud from './Items/VirtualAud/VirtualAud'
import MessageBox from './Items/MessageBox/MessageBox'
import io from "socket.io-client"
// import ExitToAppIcon from '@material-ui/icons/ExitToApp'
// import DescriptionIcon from '@material-ui/icons/Description'
import { Button, Tab, Tabs, Card, CardContent, Paper, CircularProgress, Backdrop, Snackbar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import Topics from './Items/Zoom/Topics'
import GSL from './Items/Zoom/GSL'
import RSL from './Items/Zoom/RSL'
import ButtonGroup from './Items/Buttons/ButtonGroup'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

let socket;
let user;
let currentChatId = '';
let tempEmission = [];
let committee = {};

export default function MainScreen() {
    const classes = useStyles();
    let [snackbarMsg, setSnackbarMsg] = useState('');
    let [chats, setChats] = useState({});
    let [connected, setConnected] = useState(false);
    let [seatsState, setSeats] = useState([]);
    let [seated, setSeated] = useState(false);
    let [placard, setPlacard] = useState(false);
    let [sessionState, setSession] = useState({});
    let [committeeState, setCommittee] = useState({});
    let [timerState, setTimer] = useState({});
    let [connectedDias, setConnectedDias] = useState([]);
    let [connectedDelegates, setConnectedDelegates] = useState([]);
    let [connectedAdmins, setConnectedAdmins] = useState({});
    let [diasState, setDias] = useState({});
    let [delegatesState, setDelegates] = useState({});
    let [logs, setLogs] = useState([]);
    let [msgCounter, setMsgCounter] = useState(0);
    let [singleMsg, setSingleMsg] = useState(true); //scroll to bottom init
    let [singleNotif, setSingleNotif] = useState(true);
    let [reachedTop, setReachedTop] = useState(false);
    let [reachedNotifTop, setReachedNotifTop] = useState(false);
    let [currentChatIdState, setCurrentChatId] = React.useState('');
    let [infoState, setInfo] = useState({});
    let [userState, setUserState] = useState({});
    let [notifications, setNotifications] = useState([]);
    const [tabValue, setTabValue] = React.useState(0);    
    let tempSocket = {};
    let seats = [];
    let dias = {};
    let delegates = {};
    let info = {};
    let session = {};
    let timer = {};

    /*  
    info:
        committee: {id: 1, name: "Disarmament and International Security Committee"}
        connectedAdmins: []
        connectedDelegates: []
        connectedDias: ["1"] //id
        countries: (2) [{id, name, initials}]
        dias: {}
        delegates: {}
        delegatesList: (2) [{id, country}]
        diasList: (2) [{id, name, title}]
        seats: (50) [{id, delegateId, placard}]
        session: {id: 5, topicId: null, speakerId: null, speakerTime: 0, topicTime: 0, type: null}
    */


    React.useEffect(()=>{
        const { token, committeeId } = sessionStorage;
        let userSS = JSON.parse(sessionStorage.getItem('user')); //also extract user
        user = userSS;
        setUserState(userSS);
        socket = io(`${window.serverURI}/${committeeId}?token=${token}`, {forceNew: true});
        tempSocket = socket;

        // Emitted by Server on Join
        socket.on('RES|info-start', responseInfoStart);

        // Error Handler
        socket.on('err', (err) => {
            console.error('err:', err);
            setSnackbarMsg(`${err.name}: ${err.details}`);
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

        // Committee Management
        socket.on('RES|committee-link', resCommitteeLink); // Recieved By: ["admin", "delegate", "dias"]

        /**
         * REQ Event Emission
         */

        // Chat Management
        // tempEmission.push({event: 'REQ|del-chat-fetch|DEL', req: requestDelChatFetchDel()}) // Access: ["delegate"]
        // tempEmission.push({event: 'REQ|del-chat-fetch', req: requestDelChatFetch()}); // Access: ["admin", "dias"]
        // tempEmission.push({event: 'REQ|dias-chat-fetch|DEL', req: requestDiasChatFetchDel()}) // Access: ["delegate"]
        // tempEmission.push({event: 'REQ|dias-chat-fetch|DIAS', req: requestDiasChatFetchDias()}) // Access: ["dias"]
        // tempEmission.push({event: 'REQ|del-chat-send', req: requestDelChatSend()}) // Access: ["delegate"]
        // tempEmission.push({event: 'REQ|dias-chat-send', req: requestDiasChatSend()}); // Access: ["dias", "delegate"]
        /* 0 */tempEmission.push({event: 'REQ|del-chat-fetch|DEL', req: getDelChatFetchDel()}) // Access: ["delegate"]
        /* 1 */tempEmission.push({event: 'REQ|del-chat-fetch', req: {}}); // Access: ["admin", "dias"]
        /* 2 */tempEmission.push({event: 'REQ|dias-chat-fetch|DEL', req: {}}) // Access: ["delegate"]
        /* 3 */tempEmission.push({event: 'REQ|dias-chat-fetch|DIAS', req: {}}) // Access: ["dias"]
        /* 4 */tempEmission.push({event: 'REQ|del-chat-send', req: {}}) // Access: ["delegate"]
        /* 5 */tempEmission.push({event: 'REQ|dias-chat-send', req: {}}); // Access: ["dias", "delegate"]

        // Log & Notification Management
        /* 6 */tempEmission.push({event: 'REQ|log-fetch', req: getLogFetch()}); // Access: ["admin", "dias"]
        /* 7 */tempEmission.push({event: 'REQ|notif-fetch', req: getNotifFetch()}); // Access: ["admin", "dias", "delegate"]
        /* 8 */tempEmission.push({event: 'REQ|notif-send', req: getNotifSend()}); // Access: ["dias"]

        // Seat Management
        // /* 9 */tempEmission.push({event: 'REQ|seat-sit', req: getSeatSit()}); // Access: ["delegate"]
        // /* 10 */tempEmission.push({event: 'REQ|seat-unsit', req: getSeatUnsit()}); // Access: ["delegate"]
        // /* 11 */tempEmission.push({event: 'REQ|seat-placard', req: getSeatPlacard()}); // Access: ["delegate"]

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

    function responseInfoStart(res) { 
        console.log('RES|info-start:', res);
        info = res;
        // need to store states for the following as they will be updated
        Object.keys(info.seats).forEach(seatId => {
            info.seats[seatId].id = Number(seatId); 
        })// add seat id
        seats = Object.values(info.seats);

        // include delegate countries inside delegate
        delegates = info.delegates;
        Object.keys(delegates).forEach(delegateId => {
            const delegateInfo = delegates[delegateId];
            let delegateCountry = info.countries[delegateInfo.countryId]; // get delegate's country
            delegateCountry.countryName = delegateCountry.name;
            delete delegateCountry.name; //renamed country's name attribute so it does not replace delegate's
            delegates[delegateId] = {...delegateInfo, ...delegateCountry, unreadMessages: 0} //merge, also show unread messages
        })

        dias = info.dias;
        Object.keys(info.dias).forEach(diasId => {
            dias[diasId].unreadMessages = 0; // add unread messages to dias as well
        })
        
        // storing dias and delegates in list form as well
        info.diasList = [];
        Object.keys(dias).forEach(id => {
            info.diasList.push({id, ...dias[id]})
        })

        info.delegatesList = [];
        Object.keys(delegates).forEach(id => {
            info.delegatesList.push({id, ...delegates[id]})
        })
        
        let initSeated = false;
        seats.forEach(seat => { // check if the user was sitting
            if (seat.delegateId == Number(user.id)) { // found a seat with the user's id in seats initially
                initSeated = true;
            }
        });

        session = info.session;
        session.committeeName = info.committee.name;

        timer = {topicToggle: 0, speakerToggle: 1, speakerValue: info.session.speakerTime, topicValue: info.session.topicTime};
        
        committee = info.committee;

        setTimer(timer);
        setInfo(info);
        setSeated(initSeated);
        setSeats(seats);
        setDias(dias);
        setDelegates(delegates);
        setSession(session);
        setConnectedAdmins(info.connectedAdmins);
        setConnectedDias(info.connectedDias);
        setConnectedDelegates(info.connectedDelegates);
        setConnected(true);
        setCommittee(committee);
        fetchNotifications();
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
        
        //fetched 10 messages now unread 10 less
        delegates[res.delegateId].unreadMessages = Math.max(delegates[res.delegateId].unreadMessages-10, 0);
        setDelegates(delegates);

        setReachedTop((fetchedChatMsgs.length == 0)); // if no more messages then reached top
        chats[chatId] = fetchedChatMsgs.concat(chats[chatId] !== undefined ? chats[chatId] : []);
        setChats(chats); //concat older chat messages to head of specific chat
        setSingleMsg(false);
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

        //fetched 10 messages now unread 10 less
        dias[res.diasId].unreadMessages = Math.max(dias[res.diasId].unreadMessages-10, 0);
        setDias(dias);

        setReachedTop((fetchedChatMsgs.length == 0)); // if no more messages then reached top
        chats[chatId] = fetchedChatMsgs.concat(chats[chatId] !== undefined ? chats[chatId] : []);
        setChats(chats); //concat older chat messages to head of specific chat
        setSingleMsg(false);
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
        const chatId = `${res.delegateId}|delegate`; //fetched this dias's chat
        const fetchedChatMsgs = res.chat.map(chatMsg => {
            const {diasId, diasSent, delegateId} = chatMsg;
            if (!diasSent) {
                chatMsg.senderId = diasId;
                chatMsg.senderType = 'dias';
            }
            else {
                chatMsg.senderId = delegateId;
                chatMsg.senderType = 'delegate';
            }
            return chatMsg;
        });

        delegates[res.delegateId].unreadMessages = Math.max(delegates[res.delegateId].unreadMessages-10, 0);
        setDelegates(delegates);
        
        setReachedTop((fetchedChatMsgs.length == 0)); // if no more messages then reached top
        chats[chatId] = fetchedChatMsgs.concat(chats[chatId] !== undefined ? chats[chatId] : []);
        setChats(chats); //concat older chat messages to head of specific chat
        setSingleMsg(false);
        setMsgCounter(++msgCounter);
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

        const senderId = senderDelegateId;
        const senderType = 'delegate';
        let theirChatId = '';
        const msgNotYours = !(Number(user.id) == senderId); // you are not the sender (just check id as both are delegates)
        
        if (Number(user.id) == senderDelegateId) {
            theirChatId = `${recipientDelegateId}|delegate`;

            if (msgNotYours && currentChatId !== theirChatId) {
                delegates[recipientDelegateId].unreadMessages++;
                setDelegates(delegates);
            }
        }
        else if (Number(user.id) == recipientDelegateId) {
            theirChatId = `${senderDelegateId}|delegate`;

            if (msgNotYours && currentChatId !== theirChatId) {
                delegates[senderDelegateId].unreadMessages++;
                setDelegates(delegates);
            }
        }
        pushChatMsg({ id, message, timestamp, senderId, senderType, theirChatId });
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
        const senderId = diasSent ? diasId : delegateId;
        const senderType = diasSent ? 'dias' : 'delegate';
        let theirChatId = '';
        const msgNotYours = !(Number(user.id) == senderId && user.type == senderType); // you are not the sender

        if (Number(user.id) == diasId && user.type == 'dias') {
            theirChatId = `${delegateId}|delegate`;

            if ( msgNotYours && currentChatId !== theirChatId ) {
                delegates[delegateId].unreadMessages++;
                setDelegates(delegates);
            }
        }
        else if (Number(user.id) == delegateId && user.type == 'delegate') {
            theirChatId = `${diasId}|dias`;

            if ( msgNotYours && currentChatId !== theirChatId ) {
                dias[diasId].unreadMessages++;
                setDias(dias);
            }
        }
        pushChatMsg({ id, message, timestamp, theirChatId, senderId, senderType });
    }


    function pushChatMsg(chatMsg) {
        const theirChatId = chatMsg.theirChatId;
        if (!chats[theirChatId]) {
            chats[theirChatId] = [];
        }
        chats[theirChatId].push(chatMsg);
        setChats(chats);
        setSingleMsg(true);
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

        console.log('RES|log-fetch:', res);
        const recievedLogs = res.logs;
        
        
        setLogs(recievedLogs.concat(logs));
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
        console.log('RES|notif-fetch:', res);
        let fetchedNotifications = res.notifications.map(notif => {
            return {id: notif.id, diasName: info.dias[notif.diasId] ? info.dias[notif.diasId].title + ' ' + info.dias[notif.diasId].name : "N/A", message: notif.message, timestamp: notif.timestamp}
        });
        setReachedNotifTop((fetchedNotifications.length == 0)); 
        notifications = fetchedNotifications.concat(notifications);
        setSingleNotif(false);
        setNotifications(notifications);
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
        const { id, diasId, message, timestamp } = res;
        let diasName = info.dias[diasId] ? info.dias[diasId].title + ' ' + info.dias[diasId].name : "N/A";
        notifications.push({id, diasName, message, timestamp});
        console.log('RES|notif-send', diasName, notifications);
        setSingleNotif(true);
        setNotifications([...notifications]);
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
        const {delegateId} = res;
        let id = res.id-1;
        seats[id].delegateId = delegateId;
        setSeats([...seats]);
        if (user.type == 'delegate' && user.id == delegateId) { //it was you that sat as a delegate
            setSeated(true);
        }
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
        const id = res.id-1;
        if (user.type == 'delegate' && user.id == seats[id].delegateId) { //if it was your seat that was unsitten
            setSeated(false);
            setPlacard(false);
        }
        seats[id].delegateId = null;
        setSeats([...seats]);
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
        let id = res.id-1;
        if (user.type == 'delegate' && user.id == seats[id].delegateId) {
            setPlacard(res.placard);
        }
        seats[id].placard = res.placard;
        setSeats([...seats]);
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
         *      timestampSpoken: String.format('YYYY-MM-DD HH:mm:ss') // Can be null
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
        console.log('RES|gsl-fetch:', res);
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
         *      topicName: String,
         *      speakerId: Number,
         *      speakerName: String,  N/A
         *      speakerImage: String, N/A
         *      speakerTime: Number, -> onchange reset total time
         *      topicTime: Number, -> onchange reset total time
         *      type: String.min(0).max(10) /GSL/IDLE/MOD/UNMOD
         * }
         */
        console.log('RES|session-edit:', res);
        let keys = Object.keys(res);
        for (let i = 0; i < keys.length; i++) {
            session[keys[i]] = res[keys[i]];
        }
        setSession({...session});
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
        if (res.speakerTimer) {
            timer.speakerToggle = res.toggle;
            if (res.value !== undefined) {
                timer.speakerValue = res.value;
            }
        } else {
            timer.topicToggle = res.toggle;
            if (res.value !== undefined) {
                timer.topicValue = res.value;
            }
        }
        setTimer({...timer});
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

    function resCommitteeLink(res) {
        console.log('RES|committee-link:', res);
        let keys = Object.keys(res);
        for (let i = 0; i < keys.length; i++) {
            committee[keys[i]] = res[keys[i]];
        }
        setCommittee({...committee});
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

    function sit(seatId){ // Number.min(1).max(50)
        /**
         * Emit this when delegate wants to sit somewhere
         */
        socket.emit('REQ|seat-sit', {seatId}); // Access: ["delegate"]
    }

    function unsit(){
        /**
         * Emit this when delegate wants to unsit from somewhere
         */
        socket.emit('REQ|seat-unsit', {}); // Access: ["delegate"]
    }

    function togglePlacard(placard){
        /**
         * Called by delegate when they press on leave seat
         */
        socket.emit('REQ|seat-placard', {placard}); // Access: ["delegate"]
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
        if (chats[chatId] && chats[chatId].length !== 0) { //if already chat exists
            lastMessageId = chats[chatId][0].id; //first message in chat is last    
        }

        console.log("fetchChat", chatId, lastMessageId);
        if (user.type == "delegate" && targetType == "delegate") {
            socket.emit('REQ|del-chat-fetch|DEL', {delegateId: targetId, lastMessageId});   // id of the oldest message (if no message then send 0)
        }
        else if (user.type == "delegate"){ //dias
            socket.emit('REQ|dias-chat-fetch|DEL', {diasId: targetId, lastMessageId});
        }
        else { //dias delegate
            socket.emit('REQ|dias-chat-fetch|DIAS', {delegateId: targetId, lastMessageId});
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

    function fetchNotifications() {
        /**
         * This function is used to fetch last 10 notifications
         * This event is supposed to be emitted when the loading sign is clicked in the notifications box
         */
        
        let lastNotifId = 0;
        if (notifications.length) {
            lastNotifId = notifications[0].id;
        }
        socket.emit('REQ|notif-fetch', {lastNotifId});
    }

    function sendNotification(message) {
        /**
         * This function is used to send notification
         * This event is supposed to be emitted when the send button is pressed on the notification box
         */
        
        if (user.type == "dias") {
            console.log('REQ|notif-send:', {message: message});
            socket.emit('REQ|notif-send', {message: message});
        }
    }

    function setSessionType(type) {
        if (user.type == "dias") {
            let req = {type};
            console.log('REQ|session-edit:', req);
            socket.emit('REQ|session-edit', req);
        }
    }

    function setSessionTime(type, duration) { //speaker / topic, duraton
        if (user.type == "dias") {           
            console.log('REQ|session-edit:', type === 'speaker' ? {speakerTime: duration} : {topicTime: duration} );
            socket.emit('REQ|session-edit', type === 'speaker' ? {speakerTime: duration} : {topicTime: duration});
        }
    }

    function deleteSessionTopic() {
        if (user.type == "dias") {
            let req = {topicId: 0};
            console.log('REQ|session-edit:', req);
            socket.emit('REQ|session-edit', req);
        }
    }

    function deleteSessionSpeaker() {
        if (user.type == "dias") {
            let req = {speakerId: 0};
            console.log('REQ|session-edit:', req);
            socket.emit('REQ|session-edit', req);
        }
    }

    function timerToggle(speakerTimer, toggle, value=undefined) {
        if (user.type == "dias") {
            let req = {speakerTimer, toggle};
            if (value !== undefined) {
                req.value = value;
            }
            
            console.log('REQ|session-timer:', req);
            socket.emit('REQ|session-timer', req);
        }
    }

    function fileButtonClick() {
        window.open(committee.driveLink, "_blank");
    }

    function zoomButtonClick() {
        window.open(committee.zoomLink, "_blank");
    }

    function changeFileLink(driveLink) {
        if (user.type == "dias") {
            socket.emit('REQ|committee-link', {driveLink});
        }
    }

    function changeZoomLink(zoomLink) {
        if (user.type == "dias") {
            socket.emit('REQ|committee-link', {zoomLink});
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

    function handleSnackbarClose() {
        setSnackbarMsg('');
    }

    function setChatId(newChatId) {
        currentChatId = newChatId;
        setCurrentChatId(currentChatId);
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

    function handleChange(e, newValue) {
        setTabValue(newValue);
    };

    return(
        <div className='parent'>
            {
                connected &&
                <div className= 'Information-Bar'>
                    <InformationBar 
                    session={sessionState} 
                    timer={timerState}
                    type={userState.type}
                    setSessionType={setSessionType} 
                    deleteSessionTopic={deleteSessionTopic} 
                    deleteSessionSpeaker={deleteSessionSpeaker} 
                    setSessionTime={setSessionTime}
                    timerToggle={timerToggle}/>
                    <div style={{marginTop:'2vh'}} className='Zoom'>

                        <Card style={{height:"48vh",overflowY:"hidden"}}>
                            <Paper >
                                <Tabs
                                    value={tabValue}
                                    onChange={handleChange}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    centered
                                >
                                    <Tab label="Topics" />
                                    <Tab label="GSL" />
                                    <Tab label="RSL" />
                                </Tabs>
                            </Paper>
                            <CardContent>
                            {
                                tabValue == 0 ?
                                <Topics/> :
                                tabValue == 1 ?
                                <GSL/> :
                                <RSL/>
                            }                
                            </CardContent>
                        </Card>

                        {/* <div  style={{marginTop:'2vh'}} className='Buttons'>
                            <div>
                                <Button variant="contained" color="primary" startIcon={<ExitToAppIcon/>} >Leave Session</Button>
                                &nbsp;&nbsp;
                                <Button component={FileButton} fileButtonClick={fileButtonClick} variant="contained" color="grey.300" startIcon={<DescriptionIcon/>} >Files</Button>
                                &nbsp;&nbsp;
                                <Button onClick={tempOnClick} variant="contained" color="secondary">TEMP BUTTON</Button>
                            </div>
                        </div> */}

                        <ButtonGroup 
                        tempOnClick={tempOnClick} 
                        fileButtonClick={fileButtonClick}
                        zoomButtonClick={zoomButtonClick}
                        type={userState.type} 
                        changeFileLink={changeFileLink}
                        changeZoomLink={changeZoomLink} 
                        ></ButtonGroup>
                    </div>
                </div>
            }
            {
                connected && 
                <div className='Notifications'>
                    <Notification 
                    notifications={notifications}
                    sendNotification={sendNotification} 
                    fetchNotifications={fetchNotifications} 
                    singleNotif={singleNotif}
                    reachedNotifTop={reachedNotifTop}
                    type={userState.type}
                    />
                    <div style={{marginTop:'2vh'}} className='Virtual-Aud'>
                        <VirtualAud 
                        id={Number(userState.id)} 
                        type={userState.type} 
                        seats={seatsState}
                        seated={seated}
                        placard={placard}
                        sit={sit}
                        unsit={unsit}
                        togglePlacard={togglePlacard}
                        delegates={infoState.delegates} //update does not matter so state prop not sent
                        />
                        <div style={{marginTop:'2vh' , paddingRight:'20px'}} className='MessageBox'>
                            <MessageBox 
                            id={Number(userState.id)} 
                            type={userState.type} 
                            dias={diasState}
                            delegates={delegatesState}
                            diasList={infoState.diasList} 
                            delegatesList={infoState.delegatesList}
                            currentChat={chats[currentChatIdState]}
                            setChats={setChats}
                            singleMsg={singleMsg}
                            reachedTop={reachedTop}
                            chatId={currentChatIdState}
                            setChatId={setChatId}
                            msgCounter={msgCounter}
                            sendMsg={sendMsg}
                            fetchChat={fetchChat}
                            />
                        </div>
                    </div>
                </div>
            }
            <Backdrop className={classes.backdrop} open={!connected}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Snackbar open={snackbarMsg !== ''} onClose={handleSnackbarClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} autoHideDuration={6000}>
                <Alert onClose={handleSnackbarClose} severity="error">
                    {snackbarMsg}
                </Alert>
            </Snackbar>
        </div>
        
    )
    
}
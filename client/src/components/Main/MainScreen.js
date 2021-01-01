import React, {Component, useState} from 'react'
import './MainScreen.css'
import InformationBar from './Items/InfoBar/InformationBar'
import Buttons from './Items/Buttons/Buttons'
import Zoom from './Items/Zoom/Zoom'
import Notification from './Items/Notification/Notification'
import VirtualAud from './Items/VirtualAud/VirtualAud'
import MessageBox from './Items/MessageBox/MessageBox'
import io from "socket.io-client"
import { Button } from '@material-ui/core'

let socket;

function MainScreen(){
    let [chats, setChats] = useState({});
    let [connected, setConnected] = useState(false);
    let [session, setSession] = useState({});
    let [seats, setSeats] = useState([]);
    let [connectedDias, setConnectedDias] = useState([]);
    let [connectedDelegates, setConnectedDelegates] = useState([]);
    let [connectedAdmins, setConnectedAdmins] = useState({});
    let [info, setInfo] = useState({});
    let user = {};
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
        user = sessionStorage.user; //also extract user
        console.log(user, user[0]);
        console.log(window.serverURI+`/${committeeId}?token=${token}`)
        socket = io(window.serverURI+`/${committeeId}?token=${token}`);
        tempSocket = socket;

        // Emitted by Server on Join
        socket.on('RES|info-start', responseInfoStart);

        // Error Handler
        socket.on('err', (err) => console.log('err:', err));

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

        // Seat Management

        // MOD & GSL Management

        // Session Management

        // Extra Management

        /**
         * REQ Event Emission
         */

        // Chat Management
        tempEmission.push({event: 'REQ|del-chat-fetch|DEL', req: requestDelChatFetchDel()}) // Access: ["delegate"]
        tempEmission.push({event: 'REQ|del-chat-fetch', req: requestDelChatFetch()}); // Access: ["admin", "dias"]
        tempEmission.push({event: 'REQ|dias-chat-fetch|DEL', req: requestDiasChatFetchDel()}) // Access: ["delegate"]
        tempEmission.push({event: 'REQ|dias-chat-fetch|DIAS', req: requestDiasChatFetchDias()}) // Access: ["dias"]
        tempEmission.push({event: 'REQ|del-chat-send', req: requestDelChatSend()}) // Access: ["delegate"]
        tempEmission.push({event: 'REQ|dias-chat-send', req: requestDiasChatSend()}); // Access: ["dias", "delegate"]

        // Log & Notification Management

        // Seat Management

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
        let info = res;
        // need to store states for the following as they will be updated
        setSeats(info.seats);
        setSession(info.session);
        setConnectedAdmins(info.connectedAdmins);
        setConnectedDias(info.setConnectedDias);
        setConnectedDelegates(info.setConnectedDelegates);
        setConnected(true);
        
        // include delegate countries inside delegate
        let updatedDelegates = info.delegates;
        Object.keys(info.delegates).forEach(delegateId => {
            const delegateInfo = info.delegates[delegateId];
            console.log(delegateInfo);
            let delegateCountry = info.countries[delegateInfo.countryId]; // get delegate's country
            delegateCountry.countryName = delegateCountry.name;
            delete delegateCountry.name; //renamed country's name attribute so it does not replace delegate's
            updatedDelegates.delegateId = {...delegateInfo, ...delegateCountry} //merge
        })
        info.delegates = updatedDelegates;
        console.log(info);
        setInfo(info);
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

    function responseDiasChatSend(res) {
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

    function requestDelChatFetchDel() {
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

    function requestDiasChatFetchDel() {
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

    function requestDelChatSend() {
        
        
        let req = {
            // id of target delegate
            delegateId: 2,
            message: "Hello Bro!"
        };

        return req;
    }

    function requestDiasChatSend() {
        /**
         * This function is used to send message to target dias
         * This event is supposed to be emitted when the send button is pressed on the chat box
         */
        
        let req = {
            // id of target dias
            userId: 2,
            // message to send "String.min(1).max(250)"
            message: "Hello Bro!"
        };

        return req;
    }


    function sendMsg(targetId, targetType, message) { //userId, type = delegate / dias, message to send "String.min(1).max(250)"
        /**
         * This function is used to send message to target delegate/dias
         * This event is supposed to be emitted when the send button is pressed on the chat box
         */
        if (targetType == "delegate") {
            tempSocket.emit('REQ|del-chat-send', {delegateId: targetId, message}); 
        }
        else { //dias
            tempSocket.emitEvent('REQ|dias-chat-send', {userId: targetId, message});
        }
    }

    return(
        <div className='parent'>
            <div className= 'Information-Bar'><InformationBar/>
                <div style={{marginTop:'2vh'}} className='Zoom'><Zoom/>
                    <Button onClick={tempOnClick} color="primary" size="large">TEMP BUTTON</Button>
                    <div  style={{marginTop:'2vh'}} className='Buttons'><Buttons/></div>
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
                            id={user.id} 
                            type={user.type} 
                            chats={chats} 
                            dias={info.dias} 
                            delegates={info.delegates}
                            connectedDias={connectedDias}
                            connectedDelegates={connectedDelegates} 
                            sendMsg={sendMsg}
                            />
                        </div>
                    </div>
                </div>
            }
            
            
        </div>
        
    )
    
}

export default MainScreen
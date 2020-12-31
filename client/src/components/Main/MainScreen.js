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
    let [messages, setMessages] = useState([]);
    
    let tempEmission = [];
    let tempSocket = {};

    React.useEffect(()=>{
        const {committeeId, token} = localStorage;
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

        // Seat Management

        // MOD & GSL Management

        // Session Management

        // Extra Management

        /**
         * REQ Event Emission
         */

        // Chat Management
        tempEmission.push({event: 'REQ|del-chat-fetch|DEL', req: getDelChatFetchDel()}) // Access: ["delegate"]
        tempEmission.push({event: 'REQ|del-chat-fetch', req: getDelChatFetch()}); // Access: ["admin", "dias"]
        tempEmission.push({event: 'REQ|dias-chat-fetch|DEL', req: getDiasChatFetchDel()}) // Access: ["delegate"]
        tempEmission.push({event: 'REQ|dias-chat-fetch|DIAS', req: getDiasChatFetchDias()}) // Access: ["dias"]
        tempEmission.push({event: 'REQ|del-chat-send', req: getDelChatSend()}) // Access: ["delegate"]
        tempEmission.push({event: 'REQ|dias-chat-send', req: getDiasChatSend()}); // Access: ["dias", "delegate"]

        // Log & Notification Management

        // Seat Management

        // MOD & GSL Management

        // Session Management


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
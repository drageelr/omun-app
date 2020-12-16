import React, { useState, useEffect } from 'react';
import {Alert, Button, Card, CardHeader,CardText} from 'reactstrap';
import './MessageBox.css'
import UserList from './UserList';

function MessageBox({message, onMessageSend,tempToList}) {

    const press=(e)=>{
        if(tempToList.length===0){
            alert('Please select countrie(s) to send message to');
        }
        else {
            let message = e.target.value;
            e.target.value='';
            onMessageSend(`\"${message}\" -> ${tempToList.toString()}`);
        }
    }

    return ( 
        <div>
            <Card style={{height:'32vh',overflowY: "hidden"}} className={'whole'}>
                <CardHeader id="head">Chits</CardHeader>
                
                <div id="container">

                    <aside id="sidebar" >
                        <UserList/>
                    </aside>

                    <section id="main">

                        <section id="messages-list" >
                        {message && 
                            message.map((item,i)=>{
                                return <Alert color="dark" className={'all'} style={{margin:'auto', paddingRight:'5px'}} key={i}>{item}</Alert>
                            })
                        }
                        </section>

                        
                    </section>
                    <footer id="footer">
                        <input required id="Message"  placeholder={'Message'}
                                onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                press(e)
                                }
                            }}
                        /> To: 
                            <input required id='Country' placeholder={tempToList && (tempToList.length>0)?tempToList:'Countries'}
                                onKeyPress={(e) => {
                                // if (e.key === 'Enter') {
                                // onMessageSend(e)
                                // }
                            }}
                        /> Enter to send

                    </footer>
                </div>
            </Card>
        </div> 
    );
}
 
export default MessageBox;
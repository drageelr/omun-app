import React from 'react';
import {Card, CardBody, CardHeader, CardText } from 'reactstrap';
import {newNotification} from './Actions'
import './Notification.css'
import { Alert } from 'reactstrap';


function Notification({addNotification,showNotification}) {
         
    return ( 
        <div >
            <Card className="NotifBody" style={{height:"22vh"}} >
                <CardHeader className="NotifHeader" >Notification</CardHeader>
                <CardBody className="NotifcardBody" onClick={addNotification} style={{overflowY: "scroll"}}>
                <CardText>
                {
                    showNotification && 
                    showNotification.map((item,i)=>{
                        return <Alert color="danger" className="Notif-Text" key={i}>{item}</Alert>
                    })
                }
                </CardText>
                </CardBody>
            </Card>
        </div>
    );
}
 
export default Notification;
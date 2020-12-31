import React from 'react';
import './Notification.css'
import { Card, CardContent, CardHeader, List, ListItem, ListItemText} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';



function Notification({addNotification,showNotification}) {      
    let notifications = ["Dias 1 just joined.", "Delegate is preparing to speak."];
    const contentStyle = {padding:0, paddingTop: 5, overflowY: "scroll"};
    const notifItemStyle = {padding:0, paddingLeft: 10};
    
    return ( 
        <Card className="NotifBody" style={{backgroundColor: "#111111"}}>
            <CardHeader titleTypographyProps={{variant:'h6' }} className="NotifHeader" title="Notifications"/>
            <CardContent className="NotifcardBody" onClick={addNotification} style={contentStyle}>
                {
                    notifications && 
                    notifications.map((item,i)=> (
                        <ListItem style={notifItemStyle} className="Notif-Text" key={i} dense>
                            <ListItemText primary={item} />
                        </ListItem>
                    ))
                }  
            </CardContent>
        </Card>
    );
}
 
export default Notification;
import React from 'react';
import './Notification.css'
import { Card, CardContent, CardHeader, List, ListItem, ListItemText} from '@material-ui/core';

function Notification({addNotification,showNotification}) {      
    let notifications = ["Dias 1 just joined.", "Delegate is preparing to speak."];

    return ( 
        <Card className="NotifBody" style={{backgroundColor: "#111111"}}>
            <CardHeader titleTypographyProps={{variant:'h6' }} className="NotifHeader" title="Notifications"/>
            <CardContent className="NotifcardBody" onClick={addNotification} style={{overflowY: "scroll"}}>
                <List>
                {
                    notifications && 
                    notifications.map((item,i)=> (
                        <ListItem className="Notif-Text" key={i} dense>
                            <ListItemText primary={item} />
                        </ListItem>
                    ))
                }  
                </List>
            </CardContent>
        </Card>
    );
}
 
export default Notification;
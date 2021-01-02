import React from 'react';
import './Notification.css'
import { Card, CardContent, CardHeader, List, ListItem, ListItemText} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';

function Notification({notifications, sendNotification, fetchNotifications, type}) {
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const contentStyle = {padding:0, paddingTop: 5, overflowY: "scroll"};
    const notifItemStyle = {padding:0, paddingLeft: 10};
    
    return ( 
        <Card className="NotifBody" style={{backgroundColor: "#111111"}}>
            <CardHeader titleTypographyProps={{variant:'h6' }} className="NotifHeader" title="Notifications"/>
            {   
                type == "dias" &&
                <AddIcon style={{float: 'right', backgroundColor: '#ffffff'}} onClick={handleClickOpen}/>
            }
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Message Notification</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Enter the Message to notify the participants
                </DialogContentText>
                <Formik 
                    validateOnChange={false} validateOnBlur={true}
                    initialValues={{newNotif: ''}}
                    validate={values => {
                    const errors = {}
                    if (values.newNotif.length > 100) {
                        errors.newMsg = 'Please do not exceed 100 characters.'
                    }
                    return errors
                    }}
                    onSubmit={(values) => {
                        const newNotif = values.newNotif;
                        sendNotification(newNotif);
                    }}
                >
                    {({ submitForm}) => (
                    <Form>
                        <Field component={TextField} multiline rows={2} required variant="outlined" fullWidth name="newMsg" label={`Send notification`}/>
                        <Button alignRight variant="contained" endIcon={<SendIcon fontSize="small"/>} color="primary" onClick={submitForm}>Send</Button>
                    </Form>
                    )}
                </Formik>
                </DialogContent>
            </Dialog>
            

            <CardContent className="NotifcardBody" onClick={fetchNotifications} style={contentStyle}>
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
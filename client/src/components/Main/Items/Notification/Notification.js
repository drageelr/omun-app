import React, {useState} from 'react';
import './Notification.css'
import { Card, CardContent, CardHeader, List, ListItem, ListItemText, Paper, Typography, Box, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import Timestamp from 'react-timestamp';


function Notification({notifications, sendNotification, reachedNotifTop, fetchNotifications, singleNotif, type}) {
    const [open, setOpen] = React.useState(false);
    const notifContainer = React.createRef();
    const [fetching, setFetching] = useState(true);


    function handleClickOpen() {
        setOpen(true);
    };

    function handleClose() {
        setOpen(false);
    };

    function handleScroll(e) {
        let element = e.target;
        if (element.scrollTop===0) {
            if (!reachedNotifTop) {
                setFetching(true);
                setTimeout(() => fetchNotifications(), 500);
            }
        }
    }

    const contentStyle = {padding:0, paddingTop: 5, height:'12vh', overflowY: "scroll"};
    const notifItemStyle = {padding:0, paddingLeft: 10};
    
    React.useEffect(() => {
        if (singleNotif) {
            notifContainer.current.scrollTo(0, notifContainer.current.scrollHeight-notifContainer.current.clientHeight);
        }
        else if(!reachedNotifTop) { //fetch multiple and top not reached
            notifContainer.current.scrollTo(0, notifContainer.current.clientHeight+300);
        }
        setFetching(false);
    }, [notifications])

    function NotifHeader(props) {
        return (
            <div {...props} style={{height: '4vh'}}>
                {props.children}
                {   
                type == "dias" &&
                    <IconButton style={{marginRight: -10, padding: 5}} onClick={handleClickOpen}>
                        <AddIcon style={{color: 'white', fontSize: '1.3rem'}}/>
                    </IconButton>
                }
            </div>
        )
    }

    return ( 
        <Card style={{backgroundColor: "#111111"}}>
            <CardHeader className="NotifHeader" title={<div className="NotifHeaderText">Notifications</div>} component={NotifHeader}/>
            
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add Notification</DialogTitle>
                <DialogContent style={{marginTop: -20}}>
                    <DialogContentText>
                        Enter a message to notify session particpants
                    </DialogContentText>
                    <Formik 
                        validateOnChange={false} validateOnBlur={true}
                        initialValues={{newNotif: ''}}
                        validate={values => {
                        const errors = {}
                        if (values.newNotif.length > 250) {
                            errors.newNotif = 'Please do not exceed 250 characters.'
                        }
                        return errors
                        }}
                        onSubmit={(values, {setSubmitting}) => {
                            const newNotif = values.newNotif;
                            console.log(newNotif);
                            sendNotification(newNotif);
                            setSubmitting(false);
                            setOpen(false);
                        }}
                    >
                        {({ submitForm}) => (
                        <Form>
                            <Field component={TextField} multiline rows={2} required variant="outlined" fullWidth name="newNotif" label={`Send notification`}/>
                            <Button
                            style={{marginTop: 5, float: 'right', marginBottom: 10}}
                            alignRight 
                            variant="contained" 
                            endIcon={<SendIcon fontSize="small"/>} 
                            color="primary" 
                            onClick={submitForm}
                            >Send</Button>
                        </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
            

            <CardContent ref={notifContainer} onScroll={handleScroll} onClick={fetchNotifications} style={contentStyle}>
                {
                    fetching && !reachedNotifTop &&
                    <Box style={{margin: 4, display: 'flex', justifyContent: 'center'}}>
                        <CircularProgress size={30} color="secondary" />
                    </Box>
                }
                {
                    notifications && 
                    notifications.map(({diasName, id, message, timestamp},i)=> (
                        <ListItem style={notifItemStyle} className="Notif-Text" key={i} dense>
                            <Paper key={i} style={{backgroundColor: '#ddb82f', marginBottom: 5, width: '46.7vw'}}>
                                <Typography style={{margin: 5, fontSize: '0.9rem', fontWeight: 500, wordWrap: "break-word"}}>
                                    {message}
                                </Typography>
                                <Typography style={{margin: 4, marginTop: 1, marginLeft: 5, fontSize: 10}}>
                                    {`${diasName} `}
                                    [<Timestamp relative date={new Date(timestamp)}/>]
                                </Typography>
                            </Paper>
                        </ListItem>
                    ))
                }  
            </CardContent>
        </Card>
    );
}
 
export default Notification;
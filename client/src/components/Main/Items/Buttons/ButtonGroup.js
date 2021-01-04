import React, {useState, useEffect} from 'react'
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import { withRouter } from 'react-router-dom';
import clsx from 'clsx';
import { Button, Menu, MenuItem, Typography, ListItem, ListItemIcon, ListItemText, Divider, List, Drawer, DialogTitle, DialogContentText, Dialog, DialogContent } from '@material-ui/core';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DescriptionIcon from '@material-ui/icons/Description'
import AirplayIcon from '@material-ui/icons/Airplay';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MailIcon from '@material-ui/icons/Mail';
import SendIcon from '@material-ui/icons/Send';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import { makeStyles } from '@material-ui/core/styles';

const initialState = {
    mouseX: null,
    mouseY: null,
};

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});


function ButtonGroup({fileButtonClick, zoomButtonClick, type, changeFileLink, changeZoomLink, history, connectedDelegates, connectedAdmins, connectedDias, delegates, dias, admins}) {
    const classes = useStyles();
    const [fileMenuState, setFileMenu] = React.useState(initialState);
    const [filePopupState, setFilePopup] = React.useState(false);
    const [zoomMenuState, setZoomMenu] = React.useState(initialState);
    const [zoomPopupState, setZoomPopup] = React.useState(false);
    const [state, setState] = useState({ left: false });

    useEffect(()=> {
        console.log("Someone connected/disconnected!");
        console.log("connectedAdmins : ", connectedAdmins);
        console.log("connectedDelegates : ", connectedDelegates);
        console.log("connectedDias : ", connectedDias);
        console.log("delegates : ", delegates);
        console.log("dias : ", dias);
        console.log("admins : ", admins);
    }, [connectedDias, connectedDelegates, connectedAdmins])


    function fileMenuClose(){
        setFileMenu(initialState);
    }

    function fileMenuClick(){
        setFileMenu(initialState);
        setFilePopup(true);
    }

    function closeFilePopup(){
        setFilePopup(false);
    }

    function zoomMenuClose(){
        setZoomMenu(initialState);
    }

    function zoomMenuClick(){
        setZoomMenu(initialState);
        setZoomPopup(true);
    }

    function closeZoomPopup(){
        setZoomPopup(false);
    }

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <div
            className={clsx(classes.list, {[classes.fullList]: anchor === 'top' || anchor === 'bottom'})}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
        <List>
            <ListItem button key={'Delegate'}>
                <ListItemText primary={'Delegate'} />
                {
                    connectedDelegates.map((delegateId,i)=>
                        <Typography key={i} variant='h6'>{delegateId}</Typography>
                    )
                }
            </ListItem>
            <Divider/>
            <ListItem button key={'Dias'}>
                <ListItemText primary={'Dias'} />
                {
                    connectedDias.map((diasId,i)=>
                        <Typography key={i} variant='h6'>{diasId}</Typography>
                    )
                }
            </ListItem>
            <ListItem button key={'Admin'}>
                <ListItemText primary={'Admin'} />
                {
                    connectedAdmins.map((adminId,i)=>
                        <Typography key={i} variant='h6'>{adminId}</Typography>
                    )
                }
            </ListItem>
        </List>
        </div>
    );

    
    return (
    <div  style={{marginTop:'2vh'}} className='Buttons'>
        <div>
            <Button 
            variant="contained" 
            color="primary" 
            startIcon={<ExitToAppIcon/>}
            onClick={()=>history.goBack()}
            >Leave Session</Button>

            &nbsp;&nbsp;

            <Button 
            onClick={fileButtonClick} 
            variant="contained" 
            color="grey.300" 
            startIcon={<DescriptionIcon/>}
            onContextMenu={(event) => {
                event.preventDefault(); 
                if (type == "dias") {
                    setFileMenu({
                        mouseX: event.clientX - 2,
                        mouseY: event.clientY - 4,
                    }); 
                }
            }}
            >Files</Button>
            <Menu
                keepMounted
                open={fileMenuState.mouseY !== null}
                onClose={fileMenuClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    fileMenuState.mouseY !== null && fileMenuState.mouseX !== null
                    ? { top: fileMenuState.mouseY, left: fileMenuState.mouseX }
                    : undefined
                }
            >
                <MenuItem onClick={fileMenuClick}>Edit Link</MenuItem>
            </Menu>
            <Dialog open={filePopupState} onClose={closeFilePopup} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit File Link</DialogTitle>
                <DialogContent style={{marginTop: -20}}>
                    <DialogContentText>
                        Enter the link of the drive
                    </DialogContentText>
                    <Formik 
                        validateOnChange={false} validateOnBlur={true}
                        initialValues={{driveLink: ''}}
                        validate={values => {
                        const errors = {}
                        if (values.driveLink.length > 300) {
                            errors.driveLink = 'Please do not exceed 300 characters.'
                        }
                        return errors
                        }}
                        onSubmit={(values, {setSubmitting}) => {
                            const driveLink = values.driveLink;
                            console.log(driveLink);
                            changeFileLink(driveLink);
                            setSubmitting(false);
                            setFilePopup(false);
                        }}
                    >
                        {({ submitForm}) => (
                        <Form>
                            <Field component={TextField} multiline rows={2} required variant="outlined" fullWidth name="driveLink" label={`Edit File Link`}/>
                            <Button
                            style={{marginTop: 5, float: 'right', marginBottom: 10}}
                            alignRight 
                            variant="contained" 
                            endIcon={<SendIcon fontSize="small"/>} 
                            color="primary" 
                            onClick={submitForm}
                            >Set</Button>
                        </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>

            &nbsp;&nbsp;

            <Button 
            onClick={zoomButtonClick} 
            variant="contained" 
            style={{backgroundColor:"#3473ed", color: 'white'}}
            startIcon={<AirplayIcon/>}
            onContextMenu={(event) => {
                event.preventDefault(); 
                if (type == "dias") {
                    setZoomMenu({
                        mouseX: event.clientX - 2,
                        mouseY: event.clientY - 4,
                    }); 
                }
            }}
            >Zoom</Button>
            <Menu
                keepMounted
                open={zoomMenuState.mouseY !== null}
                onClose={zoomMenuClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    zoomMenuState.mouseY !== null && zoomMenuState.mouseX !== null
                    ? { top: zoomMenuState.mouseY, left: zoomMenuState.mouseX }
                    : undefined
                }
            >
                <MenuItem onClick={zoomMenuClick}>Edit Link</MenuItem>
            </Menu>
            <Dialog open={zoomPopupState} onClose={closeZoomPopup} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit Zoom Link</DialogTitle>
                <DialogContent style={{marginTop: -20}}>
                    <DialogContentText>
                        Enter the link of the zoom
                    </DialogContentText>
                    <Formik 
                        validateOnChange={false} validateOnBlur={true}
                        initialValues={{zoomLink: ''}}
                        validate={values => {
                        const errors = {}
                        if (values.zoomLink.length > 300) {
                            errors.zoomLink = 'Please do not exceed 300 characters.'
                        }
                        return errors
                        }}
                        onSubmit={(values, {setSubmitting}) => {
                            const zoomLink = values.zoomLink;
                            console.log(zoomLink);
                            changeZoomLink(zoomLink);
                            setSubmitting(false);
                            setZoomPopup(false);
                        }}
                    >
                        {({ submitForm}) => (
                        <Form>
                            <Field component={TextField} multiline rows={2} required variant="outlined" fullWidth name="zoomLink" label={`Edit Zoom Link`}/>
                            <Button
                            style={{marginTop: 5, float: 'right', marginBottom: 10}}
                            alignRight 
                            variant="contained" 
                            endIcon={<SendIcon fontSize="small"/>} 
                            color="primary" 
                            onClick={submitForm}
                            >Set</Button>
                        </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>

            &nbsp;&nbsp;
            
            {['left', 'right'].map((anchor) => (
                <React.Fragment key={anchor}>
                <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
                <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                    {list(anchor)}
                </Drawer>
                </React.Fragment>
            ))}
            
        </div>
    </div>
    )
}

export default withRouter(ButtonGroup)
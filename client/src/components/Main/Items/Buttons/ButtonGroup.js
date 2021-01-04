import React, {useState, useEffect} from 'react'
import { Button } from '@material-ui/core'
import DescriptionIcon from '@material-ui/icons/Description'
import AirplayIcon from '@material-ui/icons/Airplay';
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import SendIcon from '@material-ui/icons/Send';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';

const initialState = {
    mouseX: null,
    mouseY: null,
};

export default function ButtonGroup({tempOnClick, fileButtonClick, zoomButtonClick, type, changeFileLink, changeZoomLink}) {
    let [fileMenuState, setFileMenu] = React.useState(initialState);
    let [filePopupState, setFilePopup] = React.useState(false);
    let [zoomMenuState, setZoomMenu] = React.useState(initialState);
    let [zoomPopupState, setZoomPopup] = React.useState(false);

    const fileMenuClose = () => {
        setFileMenu(initialState);
    }

    const fileMenuClick = () => {
        setFileMenu(initialState);
        setFilePopup(true);
    }

    const closeFilePopup = () => {
        setFilePopup(false);
    }

    const zoomMenuClose = () => {
        setZoomMenu(initialState);
    }

    const zoomMenuClick = () => {
        setZoomMenu(initialState);
        setZoomPopup(true);
    }

    const closeZoomPopup = () => {
        setZoomPopup(false);
    }

    return (
    <div  style={{marginTop:'2vh'}} className='Buttons'>
        <div>
            <Button 
            variant="contained" 
            color="primary" 
            startIcon={<ExitToAppIcon/>}
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
  
            <Button 
            onClick={tempOnClick} 
            variant="contained" 
            color="secondary"
            >TEMP BUTTON</Button>
        </div>
    </div>
    )
}
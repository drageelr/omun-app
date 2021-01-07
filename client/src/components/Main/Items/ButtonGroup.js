import React, {useState, useEffect} from 'react'
import { Menu, MenuItem, Typography, Paper, ListSubheader, Dialog, DialogContent, Button, Divider, ListItem, Box, CircularProgress, ListItemText, ListItemIcon, Drawer, List, DialogTitle, DialogContentText } from '@material-ui/core'
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import { withRouter } from 'react-router-dom';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DescriptionIcon from '@material-ui/icons/Description'
import AirplayIcon from '@material-ui/icons/Airplay';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SendIcon from '@material-ui/icons/Send';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import Timestamp from 'react-timestamp';
import { makeStyles } from '@material-ui/core/styles';

const initialState = {
    mouseX: null,
    mouseY: null,
};

const useStyles = makeStyles(theme => ({
    listRoot: {
        width: '100%',
        maxWidth: 360,
    },
    logsList: {
        width: '25vw',
        height: '80%',
        maxHeight: '90vh',
        overflowY: 'scroll'
    },
    logPaper: {
        borderRadius: 3, 
        margin: 2,
        width: '30vw',
        backgroundColor: theme.palette.secondary.main,
        color: 'black'
    },
    listDivider: {
        width: 'auto',
    },
    fullList: {
        width: 'auto',
    },
    listSubheader: {
        color: theme.palette.primary.main,
        fontSize: '1rem'
    },
    listText: {
        fontSize: '0.8rem',
    },
    onlineBox: {
        maxHeight: '30vh',
        overflowY: 'scroll'
    }
}));

function LogsList({logs, singleAddition, reachedTop, fetchLogs}) {
    const classes = useStyles();
    const scrollContainer = React.createRef();
    const [fetching, setFetching] = useState(true);

    function handleScroll(e) {
        let element = e.target;
        if (element.scrollTop===0) {
            if (!reachedTop) {
                setFetching(true);
                setTimeout(() => fetchLogs(), 500);
            }
        }
    }
    
    React.useEffect(() => {
        if (singleAddition) {
            scrollContainer.current.scrollTo(0, scrollContainer.current.scrollHeight-scrollContainer.current.clientHeight);
        }
        else if(!reachedTop) { //fetch multiple and top not reached
            scrollContainer.current.scrollTo(0, scrollContainer.current.clientHeight+300);
        }
        setFetching(false);
    }, [logs])

    return (
        <div style={{margin: 10}}>
            <Typography variant='h6'>Logs</Typography>
            <Divider/>
            {
                fetching && !reachedTop &&
                <Box style={{margin: 4, display: 'flex', justifyContent: 'center'}}>
                    <CircularProgress size={30} color="secondary" />
                </Box>
            }
            <List className={classes.logsList} ref={scrollContainer} onScroll={handleScroll} role="presentation" >
                {
                    logs.map((log,i)=>
                        <ListItem>
                            <Paper className={classes.logPaper}>
                                <Typography style={{margin: 4, marginLeft: 5, fontSize: '0.9rem'}}>
                                    {log.message}
                                </Typography>
                                <Typography style={{margin: 4, marginLeft: 5, fontSize: '0.6rem'}}>
                                    <Timestamp relative date={new Date(log.timestamp)}/>
                                </Typography>
                            </Paper>
                        </ListItem>
                    )
                }
            </List>
        </div>
    )
}

function ButtonGroup({fileButtonClick, zoomButtonClick, type, changeFileLink, changeZoomLink, history, setMChatOpen, logs, fetchLogs, singleAddition, reachedTop, connectedDelegates, connectedAdmins, connectedDias, delegates, dias, admins}) {
    const classes = useStyles();
    const [fileMenuState, setFileMenu] = useState(initialState);
    const [filePopupState, setFilePopup] = useState(false);
    const [zoomMenuState, setZoomMenu] = useState(initialState);
    const [zoomPopupState, setZoomPopup] = useState(false);
    const [onlineDrawerOpen, setOnlineDrawerOpen] = useState(false);
    const [logsDrawerOpen, setLogsDrawerOpen] = useState(false);
    

    useEffect(()=> {
        console.log("Someone connected/disconnected!");
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

    React.useEffect(()=> {
    }, [connectedDias, connectedDelegates, connectedAdmins])
    
    
    function toggleOnlineDrawer(event){
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOnlineDrawerOpen(!onlineDrawerOpen);
    };

    function toggleLogsDrawer(event){
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setLogsDrawerOpen(!logsDrawerOpen);
    };


    function OnlineList() {
        return (
            <div className={classes.listRoot}>
                <List role="presentation" onClick={toggleOnlineDrawer} onKeyDown={toggleOnlineDrawer} >
                    <ListSubheader className={classes.listSubheader}>Delegates</ListSubheader>
                    <div className={classes.onlineBox}>
                        {
                            connectedDelegates.map((id,i)=>
                                <ListItem>
                                    <Typography className={classes.listText} key={i}>
                                        {delegates[id].countryName}
                                    </Typography>
                                </ListItem>
                            )
                        }
                    </div>
                    <Divider className={classes.listDivider}/>
                    <ListSubheader className={classes.listSubheader}>Dais</ListSubheader>
                        <div className={classes.onlineBox}>
                            {
                                connectedDias.map((id,i)=>
                                    <ListItem>
                                        <Typography className={classes.listText} key={i}>
                                            {`${dias[id].title} ${dias[id].name}`}
                                        </Typography>
                                    </ListItem>
                                )
                            }
                        </div>
                    <Divider className={classes.listDivider}/>
                    <ListSubheader className={classes.listSubheader}>Admins</ListSubheader>
                    <div className={classes.onlineBox}>
                        {
                            connectedAdmins.map((id,i)=> {
                                console.log(connectedAdmins, id, admins)
                                return <ListItem>
                                    <Typography className={classes.listText} key={i}>
                                        {admins[id].name}
                                    </Typography>
                                </ListItem>
                            }
                            )
                        }
                    </div>
                </List>
            </div>
        )
    }


    
    return (
    <div style={{marginTop:'2vh'}} className='Buttons'>
            <Button 
            variant="contained" 
            color="primary" 
            size={type !== 'delegate' ? "small" : "medium"}
            startIcon={<ExitToAppIcon/>}
            onClick={()=>history.goBack()}
            >Leave Session</Button>

            &nbsp;&nbsp;

            <Button 
            onClick={fileButtonClick} 
            variant="contained" 
            color="grey.300" 
            size={type !== 'delegate' ? "small" : "medium"}
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
            size={type !== 'delegate' ? "small" : "medium"} 
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
                        Enter the link of Zoom
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
                            type="submit"
                            >Set</Button>
                        </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>

            {/* &nbsp;&nbsp; */}


            {/* <Button variant='contained' size={type !== 'delegate' ? "small" : "medium"}  color='secondary' startIcon={<SupervisedUserCircleIcon/>} onClick={toggleOnlineDrawer}>USERS</Button> */}
            
            {/* { // only admin/dias can preview logs
                (type !== 'delegate') &&
                <>
                    &nbsp;&nbsp; 
                    <Button variant='contained' size="small" style={{backgroundColor:'#111111', color: 'white'}} startIcon={<InboxIcon/>} onClick={toggleLogsDrawer}>LOGS</Button>
                </>
            } */}


            {/* &nbsp;&nbsp;
            {
                (type !== 'delegate') &&
                <Button variant="outlined" size="small" color="secondary" onClick={()=>setMChatOpen(true)}> MONITOR </Button>
            } */}

            <Drawer anchor='right' open={onlineDrawerOpen} onClose={toggleOnlineDrawer}>
                <OnlineList/>
            </Drawer>           

            <Drawer anchor='left' open={logsDrawerOpen} onClose={toggleLogsDrawer} >
                <LogsList onClick={toggleLogsDrawer} onKeyDown={toggleLogsDrawer} logs={logs} fetchLogs={fetchLogs} singleAddition={singleAddition} reachedTop={reachedTop} />
            </Drawer>    
    </div>
    )
}

export default withRouter(ButtonGroup)
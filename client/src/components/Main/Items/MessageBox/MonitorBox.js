import React, {useState, useEffect,} from 'react';
import {Card, Paper, CircularProgress, Tab, Tabs, Box, Slide, Typography, FormControl, InputLabel, Select, MenuItem,
  IconButton, Toolbar, AppBar, Dialog, Button} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import Timestamp from 'react-timestamp';
import { useStyles } from './styles';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MonitorBox({id, type, singleAddition, reachedTop, currentMChat, mchatOpen, setMChatOpen, mchatId, setMChatId, fetchMChat, msgCounter, delegates, delegatesList}) {
  const classes = useStyles();
  const [selectedDelegateId, setSelectedDelegateId] = useState(0);
  const scrollContainer = React.useRef();
  const [fetching, setFetching] = useState(false);

  function changeSelection(e) {
    const newSelection = e.target.value;
    setSelectedDelegateId(Number(newSelection));
  }



  function handleClose() {
    setMChatOpen(false);
  };


  function handleChange(event, newUser) {
    setMChatId(newUser); //has id, type both
    fetchMChat(newUser);
    scrollContainer.current.scrollTo(0, scrollContainer.current.scrollHeight); // scroll to end when mchat opened
  };

  // useEffect(() => {
  //   // triggers react state update whenever their is a message
  //   if (singleAddition) {
  //     scrollContainer.current.scrollTo(0, scrollContainer.current.scrollHeight); // scroll to end
  //   }
  //   else if (!reachedTop) { //fetch multiple and top not reached
  //     scrollContainer.current.scrollTo(0, scrollContainer.current.clientHeight+500);
  //   }
  //   setFetching(false);
  // }, [msgCounter]);
  
  function handleScroll(e) {
    let element = e.target;
    if (element.scrollTop===0) {
      if (!reachedTop) {
        setFetching(true);
        setTimeout(() => fetchMChat(mchatId), 500);
      }
    }
  }


  return (
    <div>
      <Dialog fullScreen open={mchatOpen} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Chat Monitor
            </Typography>
          </Toolbar>
        </AppBar>
        <FormControl className={classes.formControl}>
          <InputLabel>Select Delegate</InputLabel>
          <Select
          value={selectedDelegateId}
          onChange={changeSelection}
          className={classes.delegateSelector}
          >
          {
              delegatesList.map((d, i) => (
                  <MenuItem key={i} value={d.id}>{d.countryName}</MenuItem>
              ))
          }
          </Select>
        </FormControl>
        <Card className={classes.mroot}>
          <Tabs indicatorColor="primary" orientation="vertical" variant="scrollable" 
            value={mchatId} 
            onChange={handleChange} 
            className={classes.tabs} >
            {
              delegatesList &&
              delegatesList.map((d,i)=> {
                return <Tab label={d.countryName} value={`${d.id}|delegate`}/>
              })
            }
          </Tabs>
          <Box onScroll={ handleScroll } ref={scrollContainer} border={1} borderColor="grey.400" className={classes.mchatPaper}>
            {
              fetching && !reachedTop &&
              <Box className={classes.circleProg}>
                <CircularProgress size={30} color="secondary" />
              </Box>
            }
            {
              currentMChat &&
              currentMChat.map((msg, index) => {
                const isTheirMsg = !(msg.senderId == id && msg.senderType == type); //message id type does not match mine
                return (
                <Paper key={index} className={isTheirMsg ? classes.msgPaper : classes.msgPaperYours } >
                  <Typography className={classes.msgText}>
                    {msg.message}
                  </Typography>
                  <Typography className={classes.msgTS}>
                    <Timestamp relative date={new Date(msg.timestamp)}/>
                  </Typography>
                </Paper>
                )
              })
            }
          </Box>
        </Card>
      </Dialog>
    </div>
  );
}
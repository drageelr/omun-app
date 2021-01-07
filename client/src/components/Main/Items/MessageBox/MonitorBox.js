import React, {useState, useEffect,} from 'react';
import {Card, Paper, CircularProgress, Tab, Tabs, Box, Slide, Typography, FormControl, InputLabel, Select, MenuItem,
  IconButton, Toolbar, AppBar, Dialog, Button} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import Timestamp from 'react-timestamp';
import { useStyles } from './styles';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MonitorBox({selDelegateId, setSelDelegateId, singleAddition, reachedTop, currentMChat, mchatOpen, setMChatOpen, mchatId, setCurrentMChatId, fetchMChat, msgCounterM, delegates, delegatesList}) {
  const classes = useStyles();
  let scrollContainer = React.useRef(null);
  const [fetching, setFetching] = useState(true);


  function handleClose() {
    setMChatOpen(false);
  };

  const changeSelection = (e) => {
    const newSelection = e.target.value;
    setSelDelegateId(Number(newSelection));
    setCurrentMChatId('');
  }


  function handleChange(event, newUser) {
    if (selDelegateId !== 0 && Number(newUser.split('|')[0]) !== selDelegateId) {
      setCurrentMChatId(newUser); //has id, type both
      fetchMChat(newUser, selDelegateId); //newUser contains ID for delegate 2, while selDelegateId is delegate 1
    }
  };


  useEffect(() => {
    // triggers react state update whenever their is a message
    if (scrollContainer.current !== null) {
      console.log("reachedTop", reachedTop);
      if (singleAddition) {
        scrollContainer.current.scrollTo(0, scrollContainer.current.scrollHeight); // scroll to end
      }
      else if (!reachedTop) { //fetch multiple and top not reached
        scrollContainer.current.scrollTo(0, scrollContainer.current.clientHeight);
      }
    }
    setFetching(false);
  }, [msgCounterM]);
  
  function handleScroll(e) {
    let element = e.target;
    if (element.scrollTop===0) {
      if (!reachedTop) {
        setFetching(true);
        setTimeout(() => fetchMChat(mchatId, selDelegateId), 500);
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
          <InputLabel>Select Delegate To Monitor</InputLabel>
          <Select
          value={selDelegateId}
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
              delegatesList && selDelegateId &&
              [...delegatesList, ...delegatesList, ...delegatesList, ...delegatesList, ...delegatesList, ...delegatesList, ...delegatesList, ...delegatesList, ...delegatesList, ...delegatesList, ...delegatesList]
              .map((d,i)=> d.id !== selDelegateId && <Tab key={i} className={classes.chatTab} label={d.countryName} value={`${d.id}|delegate`}/>)
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
              currentMChat && mchatId !== '' &&
              currentMChat.map((msg, i) => {
                const isTheirMsg = Number(msg.senderId) !== Number(selDelegateId); //message id type does not match mine
                return (
                <Paper key={i} className={isTheirMsg ? classes.msgPaper : classes.msgPaperYours } >
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
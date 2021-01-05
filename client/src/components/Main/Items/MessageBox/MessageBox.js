import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
// import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {Card, Paper, List} from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import SendIcon from '@material-ui/icons/Send';
import CircularProgress from '@material-ui/core/CircularProgress';
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';
import Timestamp from 'react-timestamp';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '40vh',
    width: '49vw'
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  chatPaper: {
    overflow:'auto',
    height: '28vh',
    width: '39vw'
  },
  msgPaper: {
    padding: 2, 
    borderRadius: 3, 
    margin: 8,
    width: '30vw',
    backgroundColor: theme.palette.primary.main,
    color: 'white'
  },
  msgPaperYours: {
    padding: 2, 
    borderRadius: 3, 
    margin: 8,
    marginLeft: '8vw',
    width: '30vw',
    backgroundColor: 'whitesmoke',
    color: '#111111'
  },
  sendBar: {
    display: 'flex', 
    flexDirection: 'row', 
    padding: 10
  }
}));

function splitIdType(str) {
  const idType = str.split('|');
  return {id: Number(idType[0]), type: idType[1]};
}

export default function MessageBox({id, type, singleAddition, reachedTop, currentChat, chatId, setChatId, sendMsg, fetchChat, msgCounter, dias, delegates, diasList, delegatesList}) {
  const classes = useStyles();
  const scrollContainer = React.createRef();
  const [fetching, setFetching] = useState(true);

  function handleChange(event, newUser) {
    setChatId(newUser); //has id, type both
    fetchChat(newUser);
    scrollContainer.current.scrollTo(0, scrollContainer.current.scrollHeight); // scroll to end when chat opened
  };

  useEffect(() => {
    // triggers react state update whenever their is a message
    if (singleAddition) {
      scrollContainer.current.scrollTo(0, scrollContainer.current.scrollHeight); // scroll to end
    }
    else if (!reachedTop) { //fetch multiple and top not reached
      scrollContainer.current.scrollTo(0, scrollContainer.current.clientHeight+500);
    }
    setFetching(false);
  }, [msgCounter]);
  
  function handleScroll(e) {
    let element = e.target;
    if (element.scrollTop===0) {
      if (!reachedTop) {
        setFetching(true);
        setTimeout(() => fetchChat(chatId), 500);
      }
    }
  }

  function NotifBadge(props) {
    return (
      <div {...props} style={{minWidth: 0, padding: 0, fontSize: 12}}>
        <div style={{marginLeft: 20, textAlign: 'left'}}>
          {props.children}
        </div>
        <NotificationBadge style={{position: 'relative', minWidth: 0, float: 'right', marginRight: 10}} count={props.um}/>
      </div>
    )
  }

  function SortedTabs({children}) {  
    return  (
      <Tabs indicatorColor="primary" orientation="vertical" variant="scrollable" 
        value={chatId} 
        onChange={handleChange} 
        className={classes.tabs} >
        {
          React.Children.toArray(children) // Sort and render the children based on unread messages
          .sort((t1, t2) => (t2.props.um - t1.props.um))
          .map(div => (
            <Tab label={div.props.label} value={div.props.value} um={div.props.um} component={NotifBadge}/>

          ))
        }
      </Tabs>
    )
  }
  
  return (
    <Card className={classes.root}>
        <SortedTabs>
        { 
          diasList && (type == 'delegate') &&
          diasList.map((d,i)=> {
            const unreadMessages = dias[d.id].unreadMessages;
            let label = `${d.title} ${d.name}`;
            // if (unreadMessages) {
            //   label += ` (${unreadMessages})`;
            // }
            return <div label={label} um={unreadMessages} key={d.id} value={`${d.id}|dias`}></div>;
          })
        }     
        {
          delegatesList &&
          delegatesList.map((d,i)=> {
            if (!(Number(d.id) === Number(id) && type==='delegate')){
              const unreadMessages = delegates[d.id].unreadMessages;
              let label = d.countryName;
              // if (unreadMessages) {
              //   label += `(${unreadMessages})`;
              // }
              return <div label={label} um={unreadMessages} key={d.id} value={`${d.id}|delegate`}></div>;
            }
          })
        }
        </SortedTabs>
      <Formik
        validateOnChange={false} validateOnBlur={true}
        initialValues={{newMsg: ''}}
        validate={values => {
          const errors = {}
          if (values.newMsg.length > 250) {
            errors.newMsg = 'Please do not exceed 250 characters.'
          }
          return errors
        }}
        onSubmit={(values, {setSubmitting, resetForm}) => {
            const userObj = splitIdType(chatId);
            const message = values.newMsg;
            sendMsg(Number(userObj.id), userObj.type, message);
            setSubmitting(false);
            resetForm({});
        }}
      >
        {({ submitForm}) => (
          <Form>
            <Box onScroll={ handleScroll } ref={scrollContainer} border={1} borderColor="grey.400" className={classes.chatPaper}>
              {
                fetching && !reachedTop &&
                <Box style={{marginTop: 10, display: 'flex', justifyContent: 'center'}}>
                  <CircularProgress size={30} color="secondary" />
                </Box>
              }
              {
                currentChat &&
                currentChat.map((msg, index) => {
                  const isTheirMsg = !(msg.senderId == id && msg.senderType == type); //message id type does not match mine
                  return (
                  <Paper key={index} className={isTheirMsg ? classes.msgPaper : classes.msgPaperYours } >
                    <Typography style={{margin: 5, fontWeight: 500, wordWrap: "break-word", maxWidth: '30vw'}}>
                      {msg.message}
                    </Typography>
                    <Typography style={{margin: 4, marginLeft: 5, fontSize: 10}}>
                      <Timestamp relative date={new Date(msg.timestamp)}/>
                    </Typography>
                  </Paper>
                  )
                })
              }
            </Box>
            {
              chatId && delegates && dias  &&
              <List className={classes.sendBar}>
                  <Field component={TextField} multiline rows={1} required variant="outlined" fullWidth name="newMsg" 
                  label={ 'Send chat message to ' + (splitIdType(chatId).type == 'delegate' ? 
                  delegates[splitIdType(chatId).id].countryName 
                  : dias[splitIdType(chatId).id].name)}
                  />
                  <Button variant="contained" endIcon={<SendIcon fontSize="small"/>} color="primary" onClick={submitForm}>Send</Button>
              </List>
            }
          </Form>
        )}
      </Formik>
    </Card>
  );
}

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

export default function MessageBox({id, type, singleMsg, reachedTop, currentChat, chatId, setChatId, sendMsg, fetchChat, msgCounter, dias, delegates, diasList, delegatesList}) {
  const classes = useStyles();
  const chatContainer = React.createRef();
  const [fetching, setFetching] = useState(true);

  function handleChange(event, newUser) {
    setChatId(newUser); //has id, type both
    fetchChat(newUser);
  };

  useEffect(() => {
    // triggers react state update whenever their is a message
    if (singleMsg) {
      chatContainer.current.scrollTo(0, chatContainer.current.scrollHeight); // scroll to end
    }
    else if (!reachedTop) { //fetch multiple and top not reached
      chatContainer.current.scrollTo(0, chatContainer.current.clientHeight+500);
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

  return (
    <Card className={classes.root}>
      <Tabs indicatorColor="primary" orientation="vertical" variant="scrollable" 
        value={chatId} 
        onChange={handleChange} 
        className={classes.tabs} >
        
        { 
          diasList && (type == 'delegate') &&
          diasList.map((d,i)=> <Tab label={`${d.title} ${d.name}`} key={d.id} value={`${d.id}|dias`}/> )
        }     
        {
          delegatesList &&
          delegatesList.map((d,i)=> !(Number(d.id) === Number(id) && type==='delegate') && <Tab label={d.countryName} key={d.id} value={`${d.id}|delegate`}/> )
        }
      </Tabs>      
      <Formik
        validateOnChange={false} validateOnBlur={true}
        initialValues={{newMsg: ''}}
        validate={values => {
          const errors = {}
          if (values.newMsg.length > 100) {
            errors.newMsg = 'Please do not exceed 100 characters.'
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
            <Box onScroll={ handleScroll } ref={chatContainer} border={1} borderColor="grey.400" className={classes.chatPaper}>
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
                    <Typography style={{margin: 5, fontWeight: 500}}>
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

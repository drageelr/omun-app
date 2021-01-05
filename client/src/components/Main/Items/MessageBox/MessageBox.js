import React, { useState, useEffect } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import * as Yup from 'yup'
import Button from '@material-ui/core/Button';
import {Card, Paper, List} from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import SendIcon from '@material-ui/icons/Send';
import CircularProgress from '@material-ui/core/CircularProgress';
import NotificationBadge from 'react-notification-badge';
import Timestamp from 'react-timestamp';
import { useStyles } from './styles';

function splitIdType(str) {
  const idType = str.split('|');
  return {id: Number(idType[0]), type: idType[1]};
}

export default function MessageBox({id, type, singleAddition, reachedTop, currentChat, chatId, setChatId, sendMsg, fetchChat, msgCounter, dias, delegates, diasList, delegatesList}) {
  const classes = useStyles();
  const scrollContainer = React.createRef();
  const [fetching, setFetching] = useState(true);
  const inputElement = React.useRef(null);
  
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
        initialValues={{Message: ''}}
        validationSchema={Yup.object({
          Message: Yup.string()
            .min(1)
            .max(250)
        })}
        onSubmit={(values, {setSubmitting, setFieldValue}) => {
            const userObj = splitIdType(chatId);
            const message = values.Message.replace(/[\\\"]/g, '');
            if (message.length !== 0) {
              sendMsg(Number(userObj.id), userObj.type, message);
            }
            setSubmitting(false);
            setFieldValue('Message', '');
            if (inputElement.current) {
              inputElement.current.focus();
            }
        }}
      >
        {({submitForm}) => (
          <Form onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submitForm();
              }
            }} 
            >
            <Box onScroll={ handleScroll } ref={scrollContainer} border={1} borderColor="grey.400" className={classes.chatPaper}>
              {
                fetching && !reachedTop &&
                <Box className={classes.circleProg}>
                  <CircularProgress size={30} color="secondary" />
                </Box>
              }
              {
                currentChat &&
                currentChat.map((msg, index) => {
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
            {
              chatId && delegates && dias  &&
              <List className={classes.sendBar}>
                  <Field component={TextField} 
                  multiline rows={2} 
                  variant="outlined" 
                  fullWidth 
                  className={classes.sendBox}
                  name="Message" 
                  inputRef={inputElement}
                  label={ 'Send chat message to ' + (splitIdType(chatId).type == 'delegate' ? 
                  delegates[splitIdType(chatId).id].countryName 
                  : dias[splitIdType(chatId).id].name)}
                  />

                  <Button type="submit" variant="contained" endIcon={<SendIcon fontSize="small"/>} onClick={submitForm} color="primary">Send</Button>
              </List>
            }
          </Form>
        )}
      </Formik>
    </Card>
  );
}

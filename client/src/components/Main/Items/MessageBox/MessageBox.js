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
    marginRight: 12, 
    float: 'right',
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

export default function MessageBox({id, type, chats, sendMsg, dias, delegates, connectedDias, connectedDelegates}) {
  const classes = useStyles();
  const [userSelected, setUserSelected] = React.useState('1|dias'); //id, type
  const [chatMsgs, setChatMsgs] = React.useState([]);
  

  function handleChange(event, newUser) {
    setUserSelected(newUser); //has id, type both
    if (userSelected) {
      setChatMsgs(chats[splitIdType(userSelected).id]);
    }
  };

  React.useEffect(() => {
    if (userSelected) {
      setChatMsgs(chats[splitIdType(userSelected).id]); //show fetched chat messages of specific user
    }
  }, [chats])


  return (
    <Card className={classes.root}>
      <Tabs indicatorColor="primary" orientation="vertical" variant="scrollable" 
        value={userSelected} 
        onChange={handleChange} 
        className={classes.tabs} >
        { 
          connectedDias && dias &&
          connectedDias.map((id,i)=> <Tab label={`${dias[id].title} ${dias[id].name}`} key={id} value={`${id}|dias`}/> )
        }     
        { 
          connectedDelegates && delegates &&
          connectedDelegates.map((id,i)=> <Tab label={delegates[id].countryName} key={id} value={`${id}|delegate`}/> )
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
            const userObj = splitIdType(userSelected);
            
            const message = values.newMsg;
            sendMsg(Number(userObj.id), userObj.type, message);
            setSubmitting(false);
            resetForm({});
        }}
      >
        {({ submitForm}) => (
          <Form>
            <Box border={1} borderColor="grey.400" className={classes.chatPaper}>
              <List>
                {
                  chatMsgs &&
                  chatMsgs.map((msg, index) => {
                    return (
                    <Paper key={index} className={msg.yourId == id ? classes.msgPaperYours : classes.msgPaper} >
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
              </List>
            </Box>
            {
              userSelected && delegates && dias  &&
              <List className={classes.sendBar}>
                  <Field component={TextField} multiline rows={1} required variant="outlined" fullWidth name="newMsg" 
                  label={ 'Send chat message to ' + (splitIdType(userSelected).type == 'delegate' ? 
                  delegates[splitIdType(userSelected).id].countryName 
                  : dias[splitIdType(userSelected).id].name)}
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

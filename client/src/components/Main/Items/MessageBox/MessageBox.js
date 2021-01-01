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


export default function MessageBox({id, type, chats, sendMsg, dias, delegates, connectedDias, connectedDelegates}) {
  const classes = useStyles();
  const [userSelected, setUserSelected] = React.useState(undefined); //id, type
  const [chatMsgs, setChatMsgs] = React.useState(
    [{id: 2, text: "Hi! What's up?", timestamp:Date.now()}, {id: 1, text: "Nothing much.", timestamp:Date.now()}]
    );
  
  console.log(connectedDias, dias);

  const handleChange = (event, newUser) => {
    setUserSelected(newUser); //has id, type both
    // setChatMsgs(chats[newUser.id]); //show fetched chat messages of specific user
  };


  return (
    <Card className={classes.root}>
      <Tabs indicatorColor="primary" orientation="vertical" variant="scrollable" 
        value={userSelected} 
        onChange={handleChange} 
        className={classes.tabs} >
        { 
          connectedDias &&
          connectedDias.map((id,i)=> <Tab label={`${dias[id].title} ${dias[id].name}`} key={{id, type: 'dias'}}/> )
        }     
        { 
          connectedDelegates &&
          connectedDelegates.map((id,i)=> <Tab label={delegates[id].countryName} key={{id, type: 'delegate'}}/> )
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
        onSubmit={(values) => {
          const message = values.newMsg;
          // sendMsg();
        }}
      >
        {({ submitForm}) => (
          <Form>
            <Box border={1} borderColor="grey.400" className={classes.chatPaper}>
              <List>
                {
                  chatMsgs.map((msg, index) => {
                    return (
                    <Paper key={index} className={msg.id == id ? classes.msgPaperYours : classes.msgPaper} >
                      <Typography style={{margin: 5, fontWeight: 500}}>
                        {msg.text}
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
            <List className={classes.sendBar}>
              {/* {
                userSelected && delegates 
                <Field component={TextField} multiline rows={1} required variant="outlined" fullWidth name="newMsg" 
                label={'Send chat message to ' + (userSelected.type == 'delegate' ? delegates[userSelected.id].countryName : dias[userSelected.id].name)}/>
              } */}

              <Button alignRight variant="contained" endIcon={<SendIcon fontSize="small"/>} color="primary" onClick={submitForm}>Send</Button>

            </List>
          </Form>
        )}
      </Formik>
    </Card>
  );
}

import React, {useState, useEffect} from 'react'
import './InformationBar.css'
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Button, Card, CardContent, ButtonGroup, IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import CancelIcon from '@material-ui/icons/Cancel';
import Grid from '@material-ui/core/Grid';
import FlagIfAvailable from '../Zoom/FlagIfAvailable'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as Yup from 'yup'
// import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import MaskedInput from 'react-text-mask';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  cardRoot: {backgroundColor: "#111111", height:"38vh", overflowY:"auto"},
  timeGetter: {
    width: 42,
    margin: 15,
    fontSize: '0.5rem',
    marginTop: -3
    // padding: 0
  },
  timeGetterField: {
      paddingTop: 10,
  },
  timerHeadText: {
    fontSize: '0.9rem', 
    marginLeft: '3.5vw',
    width: '90%'
  },
  horizontal: {display: 'flex', flexDirection: 'row'},
  bgstyle: {padding: 3, width: '5.3vw', fontSize: '0.7rem'}
}));

/** 
 * Timer Toggle (Function)
 * When Start/Stop/Reset is pressed call this function
 * Case Speaker Timer
 *    speakerTimer: true
 *    toggle: 0->Reset 1->Stop 2->Start
 * Case Topic Timer
 *    speakerTimer: false
 *    toggle: 0->Reset
 * */

/** 
 * Timer (State)
 *    speakerToggle: 0/1/2
 *    topicToggle: 0
 * Functionality:
 *    speakerToggle:
 *        0: Speaker Timer's current value = session.speakerTime AND Topic Timer's current value increment the difference (make sure does not exceed session.topicTime)
 *        1: Stop Speaker and Topic Timers
 *        2: Start Speaker and Topic Timers
 *    topicToggle:
 *        0: Topic Timer's current value = session.topicTime
*/

export function secToMinsec(sec){
  return `${("0" + parseInt(sec/60)).slice(-2)}:${("0" + sec%60).slice(-2)}`;
}

export default function InformationBar ({session, timer, type, setSessionType, setSessionTime, delegates, deleteSessionTopic, deleteSessionSpeaker, timerToggle}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  const [crossesShown, setCrossesShown] = useState(false);
  const [timerSEnded, setTimerSEnded] = useState(false);
  const [timerKeyS, setTimerKeyS] = useState(0);
  const [timerKeyT, setTimerKeyT] = useState(0);

  const [speakerValue, setSpeakerValue] = React.useState(0);
  const [topicValue, setTopicValue] = React.useState(0);
  const [totalTime, setTotalTime] = useState('');
  const [time, setTime] = useState('06:00');

  function handleClickOpen() {
    setOpen(true);
  };

  function handleClose() {
    setOpen(false);
  };

  function handleClickOpen2() {
    setOpen2(true);
  };

  function handleClose2() {
    setOpen2(false);
  };

  React.useEffect(() => {
    setTimerKeyS(timerKeyS+1);
    setTimerKeyT(timerKeyT+1);
    if (timer.speakerToggle === 0) {
      setTimerSEnded(false);
    }
  }, [session, timer]);

  function resetTimerS() {
    let newTopicValue = topicValue;
    if (session.type !== "UNMOD" && window.confirm("Do you want to adjust the topic time as well?")) {
      newTopicValue += session.speakerTime - speakerValue;
    } 

    //stop S,T
    timerToggle(true, 2, session.speakerTime);
    timerToggle(false, 2, newTopicValue < 0 ? session.topicTime : newTopicValue);

    //reset S
    timerToggle(true, 0);
  }

  function startSpeakerTimer() { //stop S,T
    timerToggle(true, 2, speakerValue);
    timerToggle(false, 2, topicValue);
    setTimerSEnded(false);
  }

  function stopSpeakerTimer() { //start S,T
    timerToggle(true, 1, speakerValue);
    timerToggle(false, 1, topicValue); 
  }

  function endSpeakerTimer() { //start S,T
    setTimerSEnded(true);
  }

  // function enterDurationS(){
  //   if (timer.speakerToggle !== 2) { //if not playing
  //     const newDurationS = parseInt(prompt('Speaker Duration'));
  //     if (newDurationS) {
  //       setSessionTime('speaker', newDurationS);
  //     }
  //   }
  // }

  function resetTimerT() {
    //stop S,T
    timerToggle(true, 1, session.speakerTime);
    timerToggle(false, 1, session.topicTime);

    //reset T
    timerToggle(false, 0);
  }

  function enterDurationT(){
    if (timer.speakerToggle !== 2) { //if not playing
      const newDurationT = parseInt(prompt('Topic Duration'));
      if (newDurationT) {
        setSessionTime('topic', newDurationT);
      }
    }
  }

  function TextMaskCustom(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            // style=
            {...other}
            ref={(ref) => {
            inputRef(ref ? ref.inputElement : null);
            }}
            mask={[/\d/, /\d/, ':', /\d/, /\d/]}
            placeholderChar={'\u2000'}
            showMask
        />
    );
}

function minsecToSeconds(minsec){
    const [min, sec] = minsec.split(':');
    return Number(min)*60+Number(sec);
}
  return(
    <div >
      <Card className={classes.cardRoot}>
        <CardContent style={{color: "#FFFFFF"}}>
          <Grid container justify="center" direction="row" alignItems="center" item xs={12} spacing={3}>
            <Grid item xs style={{marginTop: session.type !== "UNMOD" ? (type == 'dias' ? '-10vh' : '-2vh') : '2vh', marginLeft: '2vh'}}
            onMouseEnter={() => setCrossesShown(true)}
            onMouseLeave={() => setCrossesShown(false)}>
              <Typography variant='h5' color='#ffffff'>{session.committeeName}</Typography>
              <br></br>
              <h6>Topic:</h6>
              <div className={classes.horizontal}>
                <Typography variant='p' color='secondary'>{session.topicName}</Typography>
                  {
                    type == 'dias' && crossesShown &&
                    <IconButton style={{padding: 0, marginLeft: 5}} color='primary' onClick={deleteSessionTopic}>
                      <CancelIcon/>
                    </IconButton>
                  }
              </div>
              <br></br>
              <h6>Speaker:</h6>
              <div className={classes.horizontal}>
                {
                  delegates[session.speakerId] &&
                  <FlagIfAvailable imageName={delegates[session.speakerId].imageName}/>
                }
                <Typography variant='p' color='secondary' style={{alignSelf: 'center'}}> {session.speakerName} </Typography>
                  {
                    type == 'dias' && crossesShown &&
                    <IconButton style={{padding: 0, marginLeft: 5}} color='primary' onClick={deleteSessionSpeaker}>
                      <CancelIcon/>
                    </IconButton>
                  }
              </div>
            </Grid>
            
            <Grid item xs={2}>
            <ButtonGroup orientation="vertical">
            <Button 
            variant={session.type === "MOD" ?  "contained" : "outlined"} 
            size="small"
            onClick={()=>setSessionType("MOD")} 
            color="primary">
            mod</Button>

            <Button variant={session.type === "UNMOD" ?  "contained" : "outlined"} 
            size="small" 
            color="primary"
            onClick={()=>setSessionType("UNMOD")}
            >unMod</Button>

            <Button 
            variant={session.type === "GSL" ?  "contained" : "outlined"} 
            size="small" 
            color="secondary"
            onClick={()=>setSessionType("GSL")}
            >gsl</Button>
            
            <Button 
            variant={session.type === "IDLE" ?  "contained" : "outlined"} 
            size="small" 
            color="secondary"
            onClick={()=>setSessionType("IDLE")}
            >idle</Button>
            </ButtonGroup>
            </Grid>

            <Grid item xs={4}>
                <div className={classes.timerHeadText}>{session.type === "UNMOD" ? "Unmod" : "Speaker" } Time [{`${("0" + parseInt(session.speakerTime/60)).slice(-2)}:${("0" + session.speakerTime%60).slice(-2)}`}]</div> 
                <div style={{marginLeft: '5vw'}}>
                  <CountdownCircleTimer
                      key={timerKeyS}
                      isPlaying={timer.speakerToggle === 2}
                      size={80}
                      initialRemainingTime={timer.speakerToggle ? timer.speakerValue : session.speakerTime}
                      // initialRemainingTime={timer.speakerValue}
                      onComplete={endSpeakerTimer}
                      duration={session.speakerTime}
                      colors={[ ['#ffcf33', 0.7], ['#aa2e25', 0.3] ]}
                  >
                    {({ remainingTime }) => {
                      setSpeakerValue(remainingTime);
                      return secToMinsec(remainingTime);
                    }}
                  </CountdownCircleTimer>
                </div>
                {
                  type === 'dias' &&
                  <ButtonGroup style={{marginTop: 10}}>
                      { 
                        (!timerSEnded) && (
                        (timer.speakerToggle === 2) ? //if paused state then you can start 
                        <Button size="small" className={classes.bgstyle} onClick={stopSpeakerTimer} color="secondary">Pause</Button> :
                        <Button size="small" className={classes.bgstyle} onClick={startSpeakerTimer} color="secondary">Start</Button>)
                      }
                      <Button size="small" className={classes.bgstyle} onClick={resetTimerS} color="secondary">Reset</Button>
                      <Button size="small" className={classes.bgstyle} onClick={handleClickOpen2} color="secondary">Duration</Button>
                      
                      <Dialog open={open2} onClose={handleClose2} aria-labelledby="form-dialog-title">
                          <DialogTitle id="form-dialog-title">Set Speaker Time Duration</DialogTitle>
                          <DialogContent style={{marginTop: -20}}>
                              <Formik 
                                  validateOnChange={false} validateOnBlur={true}
                                  initialValues={{
                                    timeMinute: '',
                                    timeSecond: ''
                                  }}
                                  validationSchema={Yup.object({
                                  timeMinute: Yup.number()
                                      .min(0)
                                      .max(99),
                                  timeSecond: Yup.number()
                                  .min(0)
                                  .max(99),
                                  })}
                                  onSubmit={(values, {setSubmitting}) => {
                                      console.log("values.minute:  ", values.timeMinute)
                                      console.log("values.second:  ", values.timeSecond)
                                      const totalTime = Number(values.timeMinute)*60+Number(values.timeSecond);
                                      if (timer.speakerToggle !== 2){
                                        if (totalTime) {
                                          setSessionTime('speaker', totalTime);
                                          setSubmitting(false);
                                          setOpen2(false);
                                        }
                                      }
                                  }}
                              >
                                  {({ submitForm}) => (
                                  <Form>
                                      <Field component={TextField} required variant="outlined" name="timeMinute" label={`Min`} style={{width: '70px'}} />
                                      
                                      <Field component={TextField} required variant="outlined" name="timeSecond" label={`Sec`} style={{width: '70px'}}/>
                                      
                                      <Button
                                      style={{marginTop: 10, float: 'right', marginBottom: 10, marginLeft: 5,}}
                                      alignRight 
                                      variant="contained" 
                                      endIcon={<SendIcon fontSize="small"/>} 
                                      color="primary" 
                                      onClick={submitForm}
                                      size="small"
                                      >Set</Button>
                                  </Form>
                                  )}
                              </Formik>
                          </DialogContent>
                      </Dialog>
                  </ButtonGroup>
                }
                
                <br/>
                <br/>
                {
                  session.type !== "UNMOD" && //topic timer not shown on unmod
                  <div>
                    <div className={classes.timerHeadText}> Topic Time [{`${("0" + parseInt(session.topicTime/60)).slice(-2)}:${("0" + session.topicTime%60).slice(-2)}`}]</div> 
                    <div style={{marginLeft: '5vw'}}>
                      <CountdownCircleTimer
                          key={timerKeyT}
                          isPlaying={!timerSEnded && timer.speakerToggle === 2}
                          size={80}
                          initialRemainingTime={timer.topicToggle ? timer.topicValue : session.topicTime}
                          duration={session.topicTime}
                          colors={[ ['#ffcf33', 0.7], ['#aa2e25', 0.3] ]}
                      >
                        {({ remainingTime }) => {
                          setTopicValue(remainingTime);
                          return secToMinsec(remainingTime);
                        }}
                      </CountdownCircleTimer>
                    </div>
                    {
                      type === 'dias' &&
                      <ButtonGroup style={{marginTop: 10, marginLeft: '2.5vw'}}>
                          <Button size="small" className={classes.bgstyle} onClick={resetTimerT} color="secondary">Reset</Button>
                          <Button size="small" className={classes.bgstyle} onClick={handleClickOpen} color="secondary">Duration</Button>
                          
                          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                          <DialogTitle id="form-dialog-title">Set Topic Time Duration</DialogTitle>
                          <DialogContent style={{marginTop: -20}}>
                              <Formik 
                                  validateOnChange={false} validateOnBlur={true}
                                  initialValues={{
                                    timeMinute: '',
                                    timeSecond: ''
                                  }}
                                  validationSchema={Yup.object({
                                  timeMinute: Yup.number()
                                      .min(0)
                                      .max(99),
                                  timeSecond: Yup.number()
                                  .min(0)
                                  .max(99),
                                  })}
                                  onSubmit={(values, {setSubmitting}) => {
                                      console.log("values.minute:  ", values.timeMinute)
                                      console.log("values.second:  ", values.timeSecond)
                                      const totalTime = Number(values.timeMinute)*60+Number(values.timeSecond);
                                      if (timer.speakerToggle !== 2){
                                        if (totalTime) {
                                                setSessionTime('topic', totalTime);
                                                setSubmitting(false);
                                                setOpen(false);
                                              }
                                      }
                                  }}
                              >
                                  {({ submitForm}) => (
                                  <Form>
                                      <Field component={TextField} required variant="outlined" name="timeMinute" label={`Min`} style={{width: '70px'}}/>
                                      <Field component={TextField} required variant="outlined" name="timeSecond" label={`Sec`} style={{width: '70px'}}/>
                                      <Button
                                      style={{marginTop: 10, float: 'right', marginBottom: 10, marginLeft: 5,}}
                                      alignRight 
                                      variant="contained" 
                                      endIcon={<SendIcon fontSize="small"/>} 
                                      color="primary" 
                                      onClick={submitForm}
                                      size="small"
                                      >Set</Button>
                                  </Form>
                                  )}
                              </Formik>
                          </DialogContent>
                      </Dialog>
                      </ButtonGroup>
                    }
                  </div>
                }
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}
      

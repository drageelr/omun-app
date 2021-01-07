import React, {useState, useEffect} from 'react'
import './InformationBar.css'
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Button, Card, List, CardContent, ButtonGroup, IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import Grid from '@material-ui/core/Grid';
import FlagIfAvailable from '../Zoom/FlagIfAvailable'
import TimeInputDialog from './TimeInputDialog'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'


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
  },
  horizontal: {display: 'flex', flexDirection: 'row'},
  bgstyle: {padding: 3, width: '5.3vw', fontSize: '0.7rem'},
  lthird: {
    width: '30%',
    height: '20vh',
    alignItems: 'center',
    alignContent: 'center',
    verticalAlign: 'center',
    display: 'flex',
    flexDirection: 'column'
  },
  lthirdL: {
    width: '30%',
    height: '20vh',
    alignItems: 'left',
    alignContent: 'left',
    display: 'flex',
    flexDirection: 'column'
  },
  
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
    if (timer.speakerToggle !== 2) { //prevent duration edit while timer running
      setOpen(true);
    }
  };

  function handleClose() {
    setOpen(false);
  };

  function handleClickOpen2() {
    if (timer.speakerToggle !== 2) { //prevent duration edit while timer running
      setOpen2(true);
    }
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
    if (session.type !== "UNMOD") {
      confirmAlert({
        title: 'Confirm to set',
        message: 'Do you want to adjust the topic time as well?',
        buttons: [
          {
            label: 'No, just reset speaker time.',
            onClick: () => {}
          },
          {
            label: 'Yes, restore topic time lost.',
            onClick: () => { newTopicValue += session.speakerTime - speakerValue; } 
          },
        ]
      });
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

  function resetTimerT() {
    //stop S,T
    timerToggle(true, 1, session.speakerTime);
    timerToggle(false, 1, session.topicTime);

    //reset T
    timerToggle(false, 0);
  }


function minsecToSeconds(minsec){
    const [min, sec] = minsec.split(':');
    return Number(min)*60+Number(sec);
}
  return(
    <div >
      <Card className={classes.cardRoot}>
        <CardContent style={{color: "#FFFFFF"}}>
          <Grid container justify="center" direction="row" alignItems="center" >
            <List
            className={classes.lthirdL}
            onMouseEnter={() => setCrossesShown(true)}
            onMouseLeave={() => setCrossesShown(false)}>
              <Typography style={{fontSize: '1.3rem'}} variant='h5' color='#ffffff'>{session.committeeName}</Typography>
              <h6 style={{marginTop: 20}}>Topic:</h6>
              <div className={classes.horizontal}>
                <Typography variant='p' color='secondary'>{session.topicName}</Typography>
                  {
                    type == 'dias' && crossesShown &&
                    <IconButton style={{padding: 0, marginLeft: 5}} color='primary' onClick={deleteSessionTopic}>
                      <CancelIcon/>
                    </IconButton>
                  }
              </div>
              <h6 style={{marginTop: 5}}>Speaker:</h6>
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
            </List>
            
            <List className={classes.lthird}>
              <ButtonGroup orientation="vertical" style={{alignSelf: 'center', verticalAlign: 'center', marginTop: '5%'}}>
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
            </List>

            <List className={classes.lthird}>
                  <div style={{alignSelf:'center', marginBottom: 10}} className={classes.timerHeadText}>
                  {session.type === "UNMOD" ? "Unmod" : "Speaker" } Time [{`${("0" + parseInt(session.speakerTime/60)).slice(-2)}:${("0" + session.speakerTime%60).slice(-2)}`}
                  ]</div> 
                  <CountdownCircleTimer
                      style={{alignSelf: 'center', display: 'inline-block'}}
                      key={timerKeyS}
                      isPlaying={timer.speakerToggle === 2}
                      size={80}
                      initialRemainingTime={timer.speakerToggle ? timer.speakerValue : session.speakerTime}
                      onComplete={endSpeakerTimer}
                      duration={session.speakerTime}
                      colors={[ ['#ffcf33', 0.7], ['#aa2e25', 0.3] ]}
                  >
                    {({ remainingTime }) => {
                      setSpeakerValue(remainingTime);
                      return secToMinsec(remainingTime);
                    }}
                  </CountdownCircleTimer>
                {
                  type === 'dias' &&
                  <ButtonGroup style={{alignSelf: 'center', marginTop: 10}}>
                      { 
                        (!timerSEnded) && (
                        (timer.speakerToggle === 2) ? //if paused state then you can start 
                        <Button size="small" className={classes.bgstyle} onClick={stopSpeakerTimer} color="secondary">Pause</Button> :
                        <Button size="small" className={classes.bgstyle} onClick={startSpeakerTimer} color="secondary">Start</Button>)
                      }
                      <Button size="small" className={classes.bgstyle} onClick={resetTimerS} color="secondary">Reset</Button>
                      <Button size="small" className={classes.bgstyle} onClick={handleClickOpen2} color="secondary">Duration</Button>
                      
                      <TimeInputDialog 
                        title={"Set Speaker Duration"} 
                        submitFunc={(time)=> {
                          if (timer.speakerToggle !== 2){
                            if (time) {
                              setSessionTime("speaker", time)
                              setOpen2(false);
                            }
                          }
                        }} 
                        handleClose={handleClose2} 
                        open={open2}
                      />
                  </ButtonGroup>
                }
                
                
                {
                  session.type !== "UNMOD" && //topic timer not shown on unmod
                  <List className={classes.lthird}>
                    <div style={{alignSelf:'center', marginTop: 20, marginBottom: 10}} className={classes.timerHeadText}> 
                    Topic Time [{`${("0" + parseInt(session.topicTime/60)).slice(-2)}:${("0" + session.topicTime%60).slice(-2)}`}]
                    </div>
                      <div>
                        <CountdownCircleTimer
                            style={{alignSelf: 'center'}}
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
                      <ButtonGroup style={{alignSelf: 'center', marginTop: 10}}>
                          <Button size="small" className={classes.bgstyle} onClick={resetTimerT} color="secondary">Reset</Button>
                          <Button size="small" className={classes.bgstyle} onClick={handleClickOpen} color="secondary">Duration</Button>
                          
                          <TimeInputDialog 
                          title={"Set Topic Duration"} 
                          submitFunc={(time)=> {
                            if (timer.speakerToggle !== 2){
                              if (time) {
                                setSessionTime("topic", time)
                                setOpen(false);
                              }
                            }
                          }} 
                          handleClose={handleClose} 
                          open={open}
                          />

                      </ButtonGroup>
                    }
                  </List>
                }
            </List>
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}
      

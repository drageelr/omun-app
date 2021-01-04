import React, {useState, useEffect} from 'react'
import './InformationBar.css'
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Button, Card, CardContent, ButtonGroup, IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import CancelIcon from '@material-ui/icons/Cancel';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
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

export default function InformationBar ({session, timer, type, setSessionType, setSessionTime, deleteSessionTopic, deleteSessionSpeaker, timerToggle}) {
  const [crossesShown, setCrossesShown] = useState(false);

  const [timerKeyS, setTimerKeyS] = React.useState(0);
  const [timerKeyT, setTimerKeyT] = React.useState(0);

  const [speakerValue, setSpeakerValue] = React.useState(0);
  const [topicValue, setTopicValue] = React.useState(0);

  
  React.useEffect(() => {
    setTimerKeyS(timerKeyS+1);
    setTimerKeyT(timerKeyT+1);

  }, [session, timer]);

  function resetTimerS() {
    let newTopicValue = topicValue;
    if (window.confirm("Do you want to adjust the topic time as well?")) {
      newTopicValue += session.speakerTime - speakerValue;
    } 

    //stop S,T
    timerToggle(true, 2, speakerValue);
    timerToggle(false, 2, newTopicValue);

    //reset S
    timerToggle(true, 0);
  }

  function stopSpeakerTimer() { //stop S,T
    timerToggle(true, 2, speakerValue);
    timerToggle(false, 2, topicValue);
  }

  function startSpeakerTimer() { //start S,T
    timerToggle(true, 1, speakerValue);
    timerToggle(false, 1, topicValue); 
  }

  function enterDurationS(){
    setSessionTime('speaker', parseInt(prompt('Speaker Duration')));
  }

  function resetTimerT() {
    //stop S,T
    timerToggle(true, 1);
    timerToggle(false, 1);

    //reset T
    timerToggle(false, 0);
  }

  function enterDurationT(){
    setSessionTime('topic', parseInt(prompt('Topic Duration')));
  }
  
  
  return(
    <div >
      <Card style={{backgroundColor: "#111111", height:"38vh", overflowY:"auto"}}>
        <CardContent style={{color: "#FFFFFF"}}>
          <Grid container justify="center" direction="row" alignItems="center" item xs={12} spacing={3}>
            <Grid item xs style={{marginTop: '-10vh', marginLeft: '2vh'}}
            onMouseEnter={() => setCrossesShown(true)}
            onMouseLeave={() => setCrossesShown(false)}>
              <Typography variant='h5' color='#ffffff'>{session.committeeName}</Typography>
              <br></br>
              <h6>Topic:</h6>
              <div style={{display: 'flex', flexDirection: 'row'}}>
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
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <Typography variant='p' color='secondary'> {session.speakerName} </Typography>
                  {
                    type == 'dias' && crossesShown &&
                    <IconButton style={{padding: 0, marginLeft: 5}} color='primary' onClick={deleteSessionSpeaker}>
                      <CancelIcon/>
                    </IconButton>
                  }
              </div>
            </Grid>

            {/* Button Color basis on session type */}
            
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
                <div style={{marginLeft: '3vw'}}>Speaker Time [{`${("0" + parseInt(session.speakerTime/60)).slice(-2)}:${("0" + session.speakerTime%60).slice(-2)}`}]</div> 
                <div style={{marginLeft: '5vw'}}>
                  <CountdownCircleTimer
                      key={timerKeyS}
                      isPlaying={timer.speakerToggle === 2}
                      size={80}
                      initialRemainingTime={timer.speakerToggle ? timer.speakerValue : session.speakerTime}
                      // initialRemainingTime={timer.speakerValue}
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
                  <ButtonGroup style={{marginTop: 10, marginLeft: '2vw'}}>
                      {   
                        (timer.speakerToggle === 2) ? //if paused state then you can start 
                        <Button size="small" style={{padding: 5}} onClick={startSpeakerTimer} color="secondary">Pause</Button> :
                        <Button size="small" style={{padding: 5}} onClick={stopSpeakerTimer} color="secondary">Start</Button>
                      }
                      <Button size="small" style={{padding: 5}} onClick={resetTimerS} color="secondary">Reset</Button>
                      <Button size="small" style={{padding: 5}} onClick={enterDurationS} color="secondary">Duration</Button>
                  </ButtonGroup>
                }
                
                <br/>
                <br/>

                <div style={{marginLeft: '3vw'}}>Topic Time [{`${("0" + parseInt(session.topicTime/60)).slice(-2)}:${("0" + session.topicTime%60).slice(-2)}`}]</div> 
                <div style={{marginLeft: '5vw'}}>
                  <CountdownCircleTimer
                      key={timerKeyT}
                      isPlaying={timer.speakerToggle === 2}
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
                  <ButtonGroup style={{marginTop: 10, marginLeft: '3vw'}}>
                      <Button size="small" style={{padding: 5}} onClick={resetTimerT} color="secondary">Reset</Button>
                      <Button size="small" style={{padding: 5}} onClick={enterDurationT} color="secondary">Duration</Button>
                  </ButtonGroup>
                }
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}
      

import React, {useState, useEffect} from 'react'
import './InformationBar.css'
// import { CountdownCircleTimer } from 'react-countdown-circle-timerTopic';
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import { Button, Card, CardContent, List, ListItem, ButtonGroup } from '@material-ui/core';
import EdiText from 'react-editext'
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


export default function InformationBar ({session, timer, setSessionType, deleteSessionTopic, deleteSessionSpeaker, timerToggle}) {
  const classes = useStyles();
  const [topic, setTopic] = useState('')
  const [timerTopic, setTimerTopic] = useState(false)
  const [timerLinear, setTimerLinear] = useState(false)
  const [duration, setDuration] = useState(120)
  const [duration1, setDuration1] = useState(120)
  const [key, setkey] = useState(0)
  const [timer1, setTimer1] = useState(false)
  const [progress, setProgress] = React.useState(100);
  const [key1, setkey1] = useState(0)
  const [mod, setMod] = useState(false);
  const [unmod, setunMod] = useState(false);
  const [gsl, setgsl] = useState(false);
  const [idle, setidle] = useState(true);

  // console.log("session, timerTopic: ", session);

  React.useEffect(() => {
    const timerTopic = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 0) {
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress - diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timerTopic);
    };
  }, []);

  function handlemod() {
    setMod(true);
    setunMod(false);
    setgsl(false);
    setidle(false);
  }
  function handleunmod() {
    setMod(false);
    setunMod(true);
    setgsl(false);
    setidle(false);
  }
  function handlegsl() {
    setMod(false);
    setunMod(false);
    setgsl(true);
    setidle(false);
  }
  function handleidle() {
    setMod(false);
    setunMod(false);
    setgsl(false);
    setidle(true);
  }
  function handleTopicChange(v) {
    setTopic(v);
  }

  function handletimer() {
    setTimerTopic(!timerTopic)
  }
  function handleDuration(){
    var v=prompt('Duration');
    setDuration(parseInt(v))
    setkey(key+1)
  }
  function handlereset(){
    setkey(key+1)
  }
  
  function handletimer1() {
    setTimer1(!timer1)
  }
  function handleDuration1(){
    var v=prompt('Duration');
    setDuration1(parseInt(v))
    setkey1(key1+1)
  }
  function handlereset1(){
    setkey1(key1+1)
  }
  
  return(
    <div >
      <Card style={{backgroundColor: "#111111", height:"38vh", overflowY:"auto"}}>
        <CardContent style={{color: "#FFFFFF"}}>
          <Grid container justify="center" direction="row" alignItems="center" item xs={12} spacing={3}>
            <Grid item xs>
              <p>Committee Name:</p>
              {session.committeeName} 
              <p>Topic:</p>
              {session.topicName}
                <CancelIcon 
                  onClick={()=>deleteSessionTopic}
                />
              <p>Speaker:</p>
              {session.speakerName}
                <CancelIcon
                onClick={()=>deleteSessionSpeaker}
                />
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
            {/* <ListItem className="sessionDetails"> */}
                <div style={{marginLeft: '3vw'}}>Time Left (Speaker)</div> 
                <div style={{marginLeft: '5vw'}}>
                  <CountdownCircleTimer
                      key={key}
                      isPlaying={timerTopic}
                      size={80}
                      duration={duration}
                      colors={[ ['#ffcf33', 0.7], ['#aa2e25', 0.3] ]}
                  >
                    {/* {
                      timer.speakerToggle === 0 ? {
                        remainingTime = duration
                        setkey(key+1)
                      } : {({ remainingTime }) => `${parseInt(remainingTime/60)}:${remainingTime%60}`} 
                    } */}
                    {/* timer.speakerToggle === 1 && 
                        {setTimerTopic(!timerTopic)}

                        timer.speakerToggle === 2 && 
                        {setTimerTopic(!timerTopic)}
                    
                    */}
                    {({ remainingTime }) => `${parseInt(remainingTime/60)}:${remainingTime%60}`}
                  </CountdownCircleTimer>
                </div>
                <ButtonGroup style={{marginTop: 10}}>
                    {   
                        !timerTopic ? 
                            <Button size="small" style={{padding: 5}} onClick={handletimer} color="secondary">Start</Button> :
                            <Button size="small" style={{padding: 5}} onClick={handletimer} color="secondary">Pause</Button>
                    }
                    <Button size="small" style={{padding: 5}} onClick={handlereset} color="secondary">reset</Button>
                    <Button size="small" style={{padding: 5}} onClick={handleDuration} color="secondary">duration</Button>
                </ButtonGroup>
                
                <br/>
                <br/>
                <h6 >Time Left (Topic)</h6> 
                <LinearProgress variant="determinate" value={progress}/>
                <ButtonGroup >
                    {   
                        !timerTopic ? 
                            <Button size="small" onClick={handletimer} color="secondary">Start</Button> :
                            <Button size="small" onClick={handletimer} color="secondary">Pause</Button>
                    }
                    <Button size="small" onClick={handlereset} color="secondary">reset</Button>
                    <Button size="small" onClick={handleDuration} color="secondary">duration</Button>
                </ButtonGroup>
            {/* </ListItem> */}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}
      

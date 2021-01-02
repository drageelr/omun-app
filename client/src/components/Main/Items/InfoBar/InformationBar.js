import React, {useState, useEffect} from 'react'
import './InformationBar.css'
// import { CountdownCircleTimer } from 'react-countdown-circle-timerTopic';
import { Button, Card, CardContent, List, ListItem, ButtonGroup } from '@material-ui/core';
import EdiText from 'react-editext'
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

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

  console.log("session, timerTopic: ", session);

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
          <List style={{ display: 'flex', flexDirection: 'row', padding: 0 }}>
            <ListItem alignItems='flex-start' className="sessionDetails">
              <h5>Committee Name:</h5>
              {session.committeeName} 
              <h5>Topic:</h5>
              {session.topicName}
                <CancelIcon/>
                <EdiText showButtonsOnHover type="text" onSave={handleTopicChange}/>
              <h5>Speaker:</h5>
              {session.speakerName}
                <CancelIcon/>
                <EdiText showButtonsOnHover type="text" onSave={handleTopicChange} />
            </ListItem>

            {/* Button Color basis on session type */}
            <Button 
            variant={session.type === "MOD" ?  "contained" : "outlined"} 
            size="medium"
            onClick={()=>setSessionType("MOD")} 
            color="primary">
            mod</Button>

            <Button variant={session.type === "UNMOD" ?  "contained" : "outlined"} 
            size="medium" 
            color="primary"
            onClick={()=>setSessionType("UNMOD")}
            >unMod</Button>

            <Button 
            variant={session.type === "GSL" ?  "contained" : "outlined"} 
            size="medium" 
            color="secondary"
            onClick={()=>setSessionType("GSL")}
            >gsl</Button>
            
            <Button 
            variant={session.type === "IDLE" ?  "contained" : "outlined"} 
            size="medium" 
            color="secondary"
            onClick={()=>setSessionType("IDLE")}
            >idle</Button>

            <ListItem className="sessionDetails">
                <h6>Time Left (Speaker)</h6> 
                {/* <CountdownCircleTimer
                    key={key}
                    isPlaying={timerTopic}
                    size={80}
                    duration={duration}
                    colors={[ ['#ffcf33', 0.7], ['#aa2e25', 0.3] ]}
                >
                    {({ remainingTime }) => `${parseInt(remainingTime/60)}:${remainingTime%60}`}
                </CountdownCircleTimer> */}
                <ButtonGroup >
                    {   
                        !timerTopic ? 
                            <Button onClick={handletimer} style={{backgroundColor:'grey',width:'30%',marginTop:'5px'}}>Start</Button> :
                            <Button onClick={handletimer} style={{backgroundColor:'grey',width:'30%',marginTop:'5px'}}>Pause</Button>
                    }
                    <Button onClick={handlereset} style={{backgroundColor:'grey',width:'30%',marginTop:'5px'}}>reset</Button>
                    <Button onClick={handleDuration} style={{backgroundColor:'grey',width:'30%',marginTop:'5px'}}>duration</Button>
                </ButtonGroup>
                <br></br>
                <h6 style={{marginTop:'5px'}}>Time Left (Topic)</h6> 
                <LinearProgress variant="determinate" value={progress} style={{width:'80%', height:'10px',borderRadius:'5px'}}/>
                <ButtonGroup >
                    {   
                        !timerTopic ? 
                            <Button onClick={handletimer} style={{backgroundColor:'grey',width:'30%',marginTop:'5px'}}>Start</Button> :
                            <Button onClick={handletimer} style={{backgroundColor:'grey',width:'30%',marginTop:'5px'}}>Pause</Button>
                    }
                    <Button onClick={handlereset} style={{backgroundColor:'grey',width:'30%',marginTop:'5px'}}>reset</Button>
                    <Button onClick={handleDuration} style={{backgroundColor:'grey',width:'30%',marginTop:'5px'}}>duration</Button>
                </ButtonGroup>
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </div>
  )
}
      

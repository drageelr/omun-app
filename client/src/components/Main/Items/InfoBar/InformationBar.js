import React, {useState, useEffect} from 'react'
import './InformationBar.css'
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Button, Card, CardContent, List, ListItem, ButtonGroup } from '@material-ui/core';
import EdiText from 'react-editext'
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

function Notification ({speaker,committee,newSpeakerC,newcommitteeC,newTopicC}) {
    const [topic, setTopic] = useState('')
    const [timer, setTimer] = useState(false)
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

    React.useEffect(() => {
        const timer = setInterval(() => {
          setProgress((oldProgress) => {
            if (oldProgress === 0) {
              return 100;
            }
            const diff = Math.random() * 10;
            return Math.min(oldProgress - diff, 100);
          });
        }, 500);
    
        return () => {
          clearInterval(timer);
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
        setTimer(!timer)
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
                            <h6 onClick={newcommitteeC}><h5>Committee Name:</h5> 
                                {committee}
                            </h6>
                            <hr></hr>
                            <h6 onClick={newTopicC}><h5>Topic:</h5>
                                <EdiText showButtonsOnHover type="text" value={topic} onSave={handleTopicChange} />
                            </h6>
                            <hr></hr>
                            <h6 onClick={newSpeakerC}><h5>Speaker:</h5>
                                <EdiText showButtonsOnHover type="text" value={speaker} onSave={handleTopicChange} />
                            </h6>
                        </ListItem>
                        <ListItem  className="sessionDetails"> 
                        {   
                            !mod ? 
                                <Button onClick={handlemod} style={{backgroundColor:'grey',width:'50%',marginBottom:'20px'}}>mod</Button> :
                                <Button onClick={handlemod} style={{backgroundColor:'#AA2e25',width:'50%',marginBottom:'20px'}}>mod</Button>
                        }
                        {   
                            unmod ? 
                                <Button onClick={handleunmod} style={{backgroundColor:'#AA2e25',width:'50%',marginBottom:'20px'}}>unMod</Button> :
                                <Button onClick={handleunmod} style={{backgroundColor:'grey',width:'50%',marginBottom:'20px'}}>unMod</Button>
                        }
                        {   
                            gsl ? 
                                <Button onClick={handlegsl} style={{backgroundColor:'#AA2e25',width:'50%',marginBottom:'20px'}}>gsl</Button> :
                                <Button onClick={handlegsl} style={{backgroundColor:'grey',width:'50%',marginBottom:'20px'}}>gsl</Button>
                        }
                        {   
                            idle ? 
                                <Button onClick={handleidle} style={{backgroundColor:'#AA2e25',width:'50%',marginBottom:'20px'}}>idle</Button> :
                                <Button onClick={handleidle} style={{backgroundColor:'grey',width:'50%',marginBottom:'20px'}}>idle</Button>
                        }
                        </ListItem>
                        <ListItem className="sessionDetails">
                            <h6>Time Left (Speaker)</h6> 
                            <CountdownCircleTimer
                                key={key}
                                isPlaying={timer}
                                size={80}
                                duration={duration}
                                colors={[ ['#ffcf33', 0.7], ['#aa2e25', 0.3] ]}
                            >
                                {({ remainingTime }) => `${parseInt(remainingTime/60)}:${remainingTime%60}`}
                            </CountdownCircleTimer>
                            <ButtonGroup >
                                {   
                                    !timer ? 
                                        <Button onClick={handletimer} style={{backgroundColor:'grey',width:'30%',marginTop:'5px'}}>Start</Button> :
                                        <Button onClick={handletimer} style={{backgroundColor:'grey',width:'30%',marginTop:'5px'}}>Pause</Button>
                                }
                                <Button onClick={handlereset} style={{backgroundColor:'grey',width:'30%',marginTop:'5px'}}>reset</Button>
                                <Button onClick={handleDuration} style={{backgroundColor:'grey',width:'30%',marginTop:'5px'}}>duration</Button>
                            </ButtonGroup>
                            <h6 style={{marginTop:'5px'}}>Time Left (Topic)</h6> 
                            <LinearProgress variant="determinate" value={progress} style={{width:'80%', height:'10px',borderRadius:'5px'}}/>
                        </ListItem>
                    </List>
                </CardContent>
            </Card>
        </div>
    )
}

export default Notification; 

      

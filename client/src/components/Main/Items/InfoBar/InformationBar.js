import React, {useState, useEffect} from 'react'
import './InformationBar.css'
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Card, CardContent, List, ListItem } from '@material-ui/core';
import EdiText from 'react-editext'

function Notification ({speaker,committee,newSpeakerC,newcommitteeC,newTopicC}) {
    const [topic, setTopic] = useState('')
    const [duration, setDuration] = useState(0)

    function handleTopicChange(v) {
        setTopic(v);
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
                            <h6 onClick={newTopicC}><h5>Current Topic:</h5>
                                <EdiText showButtonsOnHover type="text" value={topic} onSave={handleTopicChange} />
                            </h6>
                            <hr></hr>
                            <h6 onClick={newSpeakerC}><h6>Speaker:</h6>
                                {speaker}
                            </h6>
                        </ListItem>
                        <ListItem className="sessionDetails">
                            <h6>Time Left (Speaker)</h6> 
                            <CountdownCircleTimer
                                isPlaying
                                size={100}
                                duration={duration}
                                initialRemainingTime={0}
                                colors={[ ['#ffcf33', 0.7], ['#aa2e25', 0.3] ]}
                            >
                                {({ remainingTime }) => remainingTime}
                            </CountdownCircleTimer>
                        </ListItem>
                    </List>
                </CardContent>
            </Card>
        </div>
    )
}

export default Notification; 

      

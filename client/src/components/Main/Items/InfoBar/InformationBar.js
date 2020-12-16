import React, {useState, useEffect} from 'react'
import './InformationBar.css'
import { Progress, Card, CardBody } from 'reactstrap';
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { toggleTimerOn, toggleTimerOff ,newComittee,newSpeaker,newTopic, startTimer,tickTimer,stopTime} from './Actions';

let total_time;
let final_time;
 
//   const mapDispatchToProps = (dispatch)=>{
//     let temp;
//     return {
//         onTimerButtonOn:()=>dispatch(toggleTimerOn()),
//         onTimerButtonOff:()=>dispatch(toggleTimerOff()),
//         newSpeakerC:()=>{
//             let pay= prompt('enter');
//             dispatch(newSpeaker(pay))
//         },
//         newTopicC:()=>{
//             let pay= prompt('enter');
//             dispatch(newTopic(pay))
//         },
//         newComitteeC:()=>{
//             let pay= prompt('enter');
//             dispatch(newComittee(pay))
//         },
//         promptTime:()=>{
//             total_time=prompt('enter Time');
//             dispatch(startTimer(total_time))
//             temp=setInterval(()=>{dispatch(tickTimer());if(final_time<=0){return(clearInterval(temp))}},250)
                
//         },
//         stopTime:()=>{
//             clearInterval(temp)
//             dispatch(stopTime)
//         }
//     }
//   }



function Notification ({timerKey,timerOn,speaker,topic,comittee,newSpeakerC,newComitteeC,newTopicC,promptTime,seconds}) {

    let timePassed=seconds/(total_time*60)*100;
    final_time=timePassed
    return(
        <div >
            <Card className="InfoContainer" style={{height:"30vh",overflowY:"auto"}}>
                <CardBody>
                <div className={"last"}>
                    <div className="flex-container-Notifications">
                        
                        <div >
                            {/* <CardText>  */}
                            <h6 className="Comittee-Name" onClick={newComitteeC}><h5>Committee Name:</h5>
                                <div id="comitteeName">{comittee}</div>
                            </h6> <hr></hr>
                            <h6 className="Current-Topic" onClick={newTopicC}><h5>Current Topic:</h5>
                            <div id="topic">{topic}</div>
                            </h6><hr></hr>
                            <h6 className="Speaker" onClick={newSpeakerC}><h6>Speaker:</h6>
                            <div id="speaker" >{speaker}</div>
                            </h6>
                            {/* </CardText> */}
                        </div>
                        <div >
                        <div className="text-center time-left-speaker">Time Left(speaker) </div>
                            <div className="timer-wrapper" style={{paddingLeft:'30%'}} onClick={toggleTimerOn}>
                                <CountdownCircleTimer
                                    isPlaying={timerOn}
                                    key={timerKey}
                                    size={80}
                                    duration={5}
                                    strokeWidth={10}
                                    colors={[["#27b627", 0.66], ["#A30000"]]}
                                    onComplete={()=>{
                                        toggleTimerOff();
                                        return [false];
                                    }}>
                                    {renderTime}
                                </CountdownCircleTimer>
                            </div>
                            <div  className="text-center time-left-topic">Time Left (topic) </div>
                            <Progress onClick={promptTime} className="Progress-Bar" value={(timePassed<0)?(null):(timePassed)} color={(timePassed>50)?"success":"danger"}/>
                            <br></br>
                        </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}

export default Notification; 

let renderTime = ({ remainingTime }) => {
    return (
        <div className="timer">
            {(remainingTime === 0)?"--":<div className="value">{remainingTime}s</div>}
        </div>
    );
};

      

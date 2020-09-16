import React, {Component} from 'react'
import './InformationBar.css'
import { Progress, Card, CardBody } from 'reactstrap';
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { toggleTimerOn, toggleTimerOff ,newComittee,newSpeaker,newTopic} from './Actions';
import {connect} from 'react-redux';



const mapStateToProps = (state)=>{
    return {
      timerKey:state.infoBar.timerKey,
      timerOn:state.infoBar.timerOn,
      comittee:state.infoBar.comittee,
      topic:state.infoBar.topic,
      speaker:state.infoBar.speaker
    }
  }
  
  const mapDispatchToProps = (dispatch)=>{
    return {
        onTimerButtonOn:()=>dispatch(toggleTimerOn()),
        onTimerButtonOff:()=>dispatch(toggleTimerOff()),
        newSpeakerC:()=>{
            let pay= prompt('enter');
            dispatch(newSpeaker(pay))
        },
        newTopicC:()=>{
            let pay= prompt('enter');
            dispatch(newTopic(pay))
        },
        newComitteeC:()=>{
            let pay= prompt('enter');
            dispatch(newComittee(pay))
        }
    }
  }




class Notification extends Component{
        
    render(){
        const {timerKey,timerOn,speaker,topic,comittee,newSpeakerC,newComitteeC,newTopicC} = this.props;
        return(
            <div>
                <Card style={{height:"26vh",overflowY:"auto"}}>
                    <CardBody>
                        <div className="flex-container-Notifications">
                            <div>
                                {/* <CardText>  */}
                                <h6 className="Comittee-Name" onClick={newComitteeC}>Committee Name:<br/>
                                    <div id="comitteeName">{comittee}</div>
                                </h6>
                                <h6 className="Current-Topic" onClick={newTopicC}>Current Topic:
                                <div id="topic">{topic}</div>
                                </h6>
                                <h6 className="Speaker" onClick={newSpeakerC}>Speaker:
                                <div id="speaker" >{speaker}</div>
                                </h6>
                                {/* </CardText> */}
                            </div>
                            {/* <div> */}
                                {/* <div className="text-center time-left-topic">Time Left(Topic) </div>
                                <Progress className="Progress-Bar" value="50"/>
                                <hr></hr>
                                <div className="text-center time-left-speaker">Time Left (Speaker) </div>
                                <Progress className="Progress-Bar" value="25" color="danger"/> */}
                            {/* </div> */}
                            <div >
                            <div className="text-center time-left-speaker">Time Left(speaker) </div>
                                <div className="timer-wrapper" style={{paddingLeft:'30%'}} onClick={this.props.onTimerButtonOn}>
                                    <CountdownCircleTimer
                                        isPlaying={timerOn}
                                        key={timerKey}
                                        size={70}
                                        duration={5}
                                        strokeWidth={10}
                                        colors={[["#32CD32", 0.66], ["#A30000"]]}
                                        onComplete={()=>{
                                            this.props.onTimerButtonOff();
                                            return [false];
                                        }}>
                                        {renderTime}
                                    </CountdownCircleTimer>
                                </div>
                                <div className="text-center time-left-topc">Time Left (topic) </div>
                                <Progress className="Progress-Bar" value="25" color="danger"/>
                            </div>
                            
                        </div>
                 </CardBody>
                </Card>
            </div>
        )
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Notification); 

let renderTime = ({ remainingTime }) => {
    return (
        <div className="timer">
            {(remainingTime === 0)?"--":<div className="value">{remainingTime}s</div>}
        </div>
    );
};

      

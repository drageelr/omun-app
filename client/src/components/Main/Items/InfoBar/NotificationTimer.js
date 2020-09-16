import React, { Component } from 'react';
import {connect} from 'react-redux';
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import "./NotificationTimer.css";
import { toggleTimer ,requestAPI } from '../actions';


const mapStateToProps = (state)=>{
    console.log(state)
    return {
      timerKey:state.infoBar.timerKey,
      timerOn:state.infoBar.timerOn,
      apiResponse:state.resolve.apiResponse
    }
  }
  
  const mapDispatchToProps = (dispatch)=>{
    return {
        onTimerButton:(onOff)=>dispatch(toggleTimer(onOff)),
        onRequest:(url)=>requestAPI(dispatch,url)
    }
  }
  


class NotificationTimer extends Component {

    // componentDidMount(){
    //     console.log('requesting')
    //     // this.props.onRequest('https://postman-echo.com/oauth1');
    // }
    
    renderTime = ({ remainingTime }) => {
        if (remainingTime === 0) {
          return (
            <div className="timer">
              Time's <br/>UP :)
            </div>
          );
        }
      
        return (
          <div className="timer">
            {/* <div className="text">Remaining</div> */}
            <div className="value">{remainingTime}s</div>
            {/* <div className="text">seconds</div> */}
          </div>
        );
      };

    render()
    {
        const {timerKey , onTimerButton , text , timerOn ,time } = this.props;
        
        return (
      <div className="App" onClick={onTimerButton}>
        <h1>
          {text}'s Timer
        </h1>
        <div className="timer-wrapper">
          <CountdownCircleTimer
            isPlaying={timerOn}
            key={timerKey}
            size={80}
            duration={time}
            strokeWidth={10}
            colors={[["#32CD32", 0.66], ["#A30000"]]}
            onComplete={()=>{
                return [false]
            }}
          >
            {this.renderTime}
          </CountdownCircleTimer>
        </div>
      </div>
    );}
  }

  export default NotificationTimer;
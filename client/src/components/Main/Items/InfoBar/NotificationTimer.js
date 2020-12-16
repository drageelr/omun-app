import React, { Component } from 'react';
import {connect} from 'react-redux';
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import "./NotificationTimer.css";
import { toggleTimer ,requestAPI } from '../actions';


function NotificationTimer ({timerKey , onTimerButton , text , timerOn ,time }) {
    
    function renderTime ({ remainingTime }){
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
    }

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
            colors={[["#3EA849", 0.66 ], ["#A30000"]]}
            onComplete={()=>{
                return [false]
            }}
          >
          <RenderTime/>
          </CountdownCircleTimer>
        </div>
      </div>
    );
  }

  export default NotificationTimer;
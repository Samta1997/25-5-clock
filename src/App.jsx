import React, { useState, useEffect, useRef } from "react";
import './App.css'

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerLabel, setTimerLabel] = useState("Session");
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [running, setRunning] = useState(false);
  const [sessionRunning, setSessionRunning] = useState(true);
  const [paused, setPaused] = useState(false);
  const beepRef = useRef(null);

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft === 0) {
            if (sessionRunning) {
              setSessionRunning(false);
              setTimerLabel("Break");
              setTimeLeft(breakLength * 60);
            } else {
              setSessionRunning(true);
              setTimerLabel("Session");
              setTimeLeft(sessionLength * 60);
            }
            beepRef.current.play();
          } else {
            return prevTimeLeft - 1;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [running, sessionRunning, sessionLength, breakLength]);

  const startStopTimer = () => {
    setRunning(!running);
    setPaused(false);
  };

  const resetTimer = () => {
    setBreakLength(5);
    setSessionLength(25);
    setTimerLabel("Session");
    setTimeLeft(25 * 60);
    setRunning(false);
    setPaused(false);
    beepRef.current.pause();
    beepRef.current.currentTime = 0;
  };

  const decrementBreakLength = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
      if (!running && !paused) {
        setTimeLeft((prevTimeLeft) => Math.min(prevTimeLeft, (breakLength - 1) * 60));
      }
    }
  };

  const incrementBreakLength = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
      if (!running && !paused) {
        setTimeLeft((prevTimeLeft) => Math.min(prevTimeLeft, (breakLength + 1) * 60));
      }
    }
  };

  const decrementSessionLength = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      if (!running && !paused && sessionRunning) {
        setTimeLeft((prevTimeLeft) => Math.min(prevTimeLeft, (sessionLength - 1) * 60));
      }
    }
  };

  const incrementSessionLength = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      if (!running && !paused && sessionRunning) {
        setTimeLeft((prevTimeLeft) => Math.min(prevTimeLeft, (sessionLength + 1) * 60));
      }
    }
  };

  const formatTime = (timeLeft) => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="container">
      <h1>25 + 5 Clock</h1>
      <div id="break-label">Break Length</div>
      <div className="numb">
        <button id="break-decrement" onClick={decrementBreakLength}>-</button>
        <div id="break-length">{breakLength}</div>
        <button id="break-increment" onClick={incrementBreakLength}>+</button>
      </div>
      <div id="session-label">Session Length</div>
      <div className="numb">
        <button id="session-decrement" onClick={decrementSessionLength}>-</button>
        <div id="session-length">{sessionLength}</div>
        <button id="session-increment" onClick={incrementSessionLength}>+</button>
      </div>
      
      <div className="watch">
        <div id="timer-label">{timerLabel}</div>
        <div id="time-left">{formatTime(timeLeft)}</div>
      </div>  
      <button id="start_stop" onClick={startStopTimer}>{running ? "Pause" : "Start"}</button>
      <button id="reset" onClick={resetTimer}>Reset</button>
      <audio id="beep" ref={beepRef} src="https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3" />
    </div>
  );
}

export default App;
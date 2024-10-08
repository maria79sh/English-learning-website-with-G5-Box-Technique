import React from "react";
import "../style/Timer.css";
const Timer = ({ timerSeconds }) => {

    const formatTime = (seconds) => {
        const days = Math.floor(seconds / (24 * 60 * 60));
        const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((seconds % (60 * 60)) / 60);
        const remainingSeconds = seconds % 60;
        return { days, hours, minutes, remainingSeconds };
    };

    const { days, hours, minutes, remainingSeconds } = formatTime(timerSeconds);

    return (
        <div className="timer-container">
            <div className="timer-box">
                <span className="timer-value">{days}</span>
                <span className="timer-label">days</span>
            </div>
            <div className="timer-box">
                <span className="timer-value">{hours}</span>
                <span className="timer-label">hours</span>
            </div>
            <div className="timer-box">
                <span className="timer-value">{minutes}</span>
                <span className="timer-label">minutes</span>
            </div>
            <div className="timer-box">
                <span className="timer-value">{remainingSeconds}</span>
                <span className="timer-label">seconds</span>
            </div>
        </div>
    );
};

export default Timer;

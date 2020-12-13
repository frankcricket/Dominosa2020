import React, { useState, useEffect } from 'react';
import moment from 'moment';

/**
 * React component for the Timer in Status Section.
 * Uses the 'useEffect' hook to update the timer every minute.
 */
export const Timer = (props) => {
    let [currentTime, setCurrentTime] = useState(moment());
    let [timeGameStarted, setTimeGameStarted] = useState(moment());


    useEffect(() => {
        if (props.changed || props.erase)
            setTimeGameStarted(moment());
        if (!props.won)
            setTimeout(() => tick(), 1000);

    });

    function tick() {
        setCurrentTime(moment());
    }

    function getTimer() {

        let secondsTotal = currentTime.diff(timeGameStarted, 'seconds');
        if (secondsTotal <= 0)
            return '00:00';
        let duration = moment.duration(secondsTotal, 'seconds');
        let hours = duration.hours();
        let minutes = duration.minutes();
        let seconds = duration.seconds();
        let stringTimer = '';

        stringTimer += hours ? '' + hours + ':' : '';
        stringTimer += minutes ? (minutes < 10 ? '0' : '') + minutes + ':' : '00:';
        stringTimer += seconds < 10 ? '0' + seconds : seconds;

        return stringTimer;
    }

    return (
        <div className="status__time">{getTimer()}
        </div>
    )
}
export default Timer;
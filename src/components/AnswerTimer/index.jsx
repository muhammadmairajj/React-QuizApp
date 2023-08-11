import React, { useEffect, useRef, useState } from 'react';
import "./style.css";

const AnswerTimer = ( {timeUp, duration} ) => {
    const [counter, seCounter] = useState(0);
    const [progressLoader, setProgressLoader] = useState(0);
    const intervalRef = useRef();

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            seCounter((curr) => curr + 1);
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, []);

    useEffect(() => {
        setProgressLoader(100 * (counter / duration));

        if(counter === duration) {
            clearInterval(intervalRef.current);

            setTimeout(() => {
                timeUp();
            }, 1000);
        }
    }, [counter])

  return (
    <div className='answer-timer-container'>
        <div
        style={{width:`${progressLoader}%`,
        backgroundColor: `${progressLoader < 40 ? "lightgreen" : progressLoader < 70 ? "orange" : "red"}`}}
        className='progress'
        ></div>
    </div>
  )
}

export default AnswerTimer
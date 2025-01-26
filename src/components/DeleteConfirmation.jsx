// import { useEffect, useState } from "react";
import { useEffect } from "react";
import ProgressBar from "./ProgressBar";

const TIMER = 5000; // 5 seconds

export default function DeleteConfirmation({ onConfirm, onCancel }) {
  // new state, used in the element 'progress' (initial time is 5 sec):
  // const [remainingTime, setRemainingTime] = useState(TIMER);

  // useEffect(() => {
  //   // setInterval = function provided by browser, defines a function which will be executed in every xy-interval
  //   // (or in any given interval - set as 2nd argument, after the function as 1st argument):
  //   const interval = setInterval(() => {
  //     console.log("INTERVAL"); // if we never stop interval, it will be logged in console X indefinite times
  //     setRemainingTime((prevTime) => prevTime - 10);
  //   }, 10);
  //   // to stop the interval from counting infinitely, we have to return a clearInterval-function which stopps the interval
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);   
  // Empty dependancy array [] - clearInterval function will be executed when the DeleteConfirmation function 
  // unmounts from DOM (when counter is down, and delete-Modal gets closed) (until then, it's counting)
  // Now with the cleanup-function, interval runs for exactly 500 times (every 10 ms) until 5 sec expires.
  // Of course, if we select 'No' (not deleting) before 5 sec runs out, the interval will be stopped immediately,
  // and will show exact number in console, like f.e. 115 (= how many times it ran each 10 ms, until stopped).

  useEffect(() => {
    console.log("TIMER SET");
    // Adding a timer that Modal with question dissapears after 5 sec,
    // and selected location automatically get's deleted from saved locations:
    // setTimeout has 2 arguments: a function, and a duration in miliseconds

    // If <DeleteConfirmation> is always part of the DOM (always rendering),
    // then the timer is always activated whenever the App component renders for the 1st time
    const timer = setTimeout(() => {
      onConfirm(); // calling the same function, as if we have confirmed the deleting of the selected location
    }, TIMER);

    return () => {
      console.log("Cleaning up timer");
      clearTimeout(timer);
    };
  }, [onConfirm]);

  // }, [onConfirm]); - if we add functions as dependencies, there is a risk of creating an infinite loop,
  // because each time the component re-renders, function is treated as different function and this can be problem.
  // We have to use as special hook useCallback, to ensure that a function is not re-created the whole time.

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      {/* new html-element: progress, which is showing remaining time until the location in Modal is deleted */}
      {/* <progress value={remainingTime} max={TIMER} /> */}
      <ProgressBar timer={TIMER}/>
      {/* we set max-value (of the fill-status) as 5000 sec  */}
    </div>
  );
}

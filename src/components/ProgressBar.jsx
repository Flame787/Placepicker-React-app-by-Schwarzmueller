// removed all the count-down logic from the DeleteConfirmation-component and added into new component,
// because of better productivity (the DeleteConfirmation-component state now isn't re-checked every 10ms).

import { useState, useEffect } from "react";

export default function ProgressBar({ timer }) {
  // excepting {timer}-value as a prop, provided from the DeleteConfirmation-component

  const [remainingTime, setRemainingTime] = useState(timer);

  useEffect(() => {
    // setInterval = function provided by browser, defines a function which will be executed in every xy-interval
    // (or in any given interval - set as 2nd argument, after the function as 1st argument):
    const interval = setInterval(() => {
      console.log("INTERVAL"); // if we never stop interval, it will be logged in console X indefinite times
      setRemainingTime((prevTime) => prevTime - 10);
    }, 10);
    // to stop the interval from counting infinitely, we have to return a clearInterval-function which stopps the interval
    return () => {
      clearInterval(interval);
    };
  }, []);

  return <progress value={remainingTime} max={timer} />;
}

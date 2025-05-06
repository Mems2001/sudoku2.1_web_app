import { useEffect, useState } from "react";
import Game from "./Game";

function SinglePlayer () {
  const [timerOn , setTimerOn] = useState(true)
  const [timeElapsed , setTimeElapsed] = useState(0)

  useEffect(() => {
      if (timerOn) {
        const timer = setInterval(() => {
          setTimeElapsed(time => time + 1);
        }, 1000);
    
        return () => clearInterval(timer); // Cleanup on unmount or when `timerOn` changes
      }
    }, [timerOn]);

  return (
    <Game gameType={0} timerOn={timerOn} setTimerOn={setTimerOn} timeElapsed={timeElapsed} setTimeElapsed={setTimeElapsed}/>
  )
}

export default SinglePlayer
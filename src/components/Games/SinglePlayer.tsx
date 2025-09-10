import { useState } from "react";
import Game from "./Game";

function SinglePlayer () {
  const [timerOn , setTimerOn] = useState(true)
  const [timeElapsed , setTimeElapsed] = useState(0)

  return (
    <Game timerOn={timerOn} setTimerOn={setTimerOn} timeElapsed={timeElapsed} setTimeElapsed={setTimeElapsed}/>
  )
}

export default SinglePlayer
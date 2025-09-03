import { useTimer } from "../../hooks/useTimer"

interface TimerProps {
    timeElapsed: number
    timerOn: boolean
    setTimeElapsed: React.Dispatch<React.SetStateAction<number>>
}

const Timer:React.FC<TimerProps> = ({timeElapsed , timerOn, setTimeElapsed}) => {

     function formatTime(seconds:number):string {

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

   useTimer({timerOn, setTimeElapsed})

    return (
        <div className="chrono">{formatTime(timeElapsed)}</div>
    )
}

export default Timer
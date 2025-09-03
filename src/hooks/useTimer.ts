import { useEffect } from "react";

interface UseTimerProps {
    timerOn: boolean,
    setTimeElapsed: React.Dispatch<React.SetStateAction<number>>
}

export function useTimer({timerOn, setTimeElapsed}:UseTimerProps) {
    useEffect(() => {
        console.log('timer useEffect')
        let timer: NodeJS.Timeout | undefined
        if (timerOn) {
            console.log('timer is on')
            timer = setInterval(() => {
              setTimeElapsed((time) => time + 1);
            }, 1000);
        
            return () => {
                if (timer) clearInterval(timer)
            } // Cleanup on unmount or when `timerOn` changes
        }
    }, [timerOn, setTimeElapsed]);
}
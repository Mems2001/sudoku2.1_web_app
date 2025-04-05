import { useNavigate } from "react-router-dom";
import { GameHeaderProps } from "../../app/types";

const Header:React.FC<GameHeaderProps> = ({errores , time , pause , play , timerOn , save}) => {

    const navigate = useNavigate()

    function formatTime(seconds:number):string {

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    return (
        <div className="game-options">
            <button onClick={() => navigate('/')}>
                <i className="fa-sharp fa-solid fa-door-open fa-xl"></i>
            </button>
            <div className="errores">
              <span>Errores:</span>
              <span>{errores}/3</span>
            </div>
            <div className="chrono">{formatTime(time)}</div>
            {timerOn ?
                <button onClick={pause}>
                    <i className="fa-solid fa-pause fa-xl"></i>  
                </button>
                :
                <button onClick={play}>
                    <i className="fa-solid fa-play fa-xl"></i>  
                </button>
            }
            <button onClick={save}>
                <i className="fa-solid fa-floppy-disk fa-xl"></i>
            </button>
        </div>  
    )
}

export default Header
import { useNavigate } from "react-router-dom";
import { GameHeaderProps } from "../../app/types";

/**
 * This component shows the main puzzle solving information such as ammount of errors and time elapsed. It also provides related funcctions such as game saving.
 * @param GameHeaderProps - An object containing the folowing props:
 * @property game - The Game class instance related to a concrete game_id.
 * @property gameType - The type of game being player.
 * @property turn.
 * @property time - The time elapsed since the game started.
 * @property pause - A pause function given by the father component.
 * @property play - A play function given by the father component.
 * @property timerOn - The father component local state wich controls the timer.
 * @returns 
 */
const Header:React.FC<GameHeaderProps> = ({game , gameType, turn, time , pause , play , timerOn}) => {

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
              <span>
                <i className="fa-solid fa-xmark"></i>
              </span>
              <span>{game.getErrors()}/3</span>
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
            <button onClick={() => game.saveAnswers(game.answers.grid, game.answers.number, time)}>
                <i className="fa-solid fa-floppy-disk fa-xl"></i>
            </button>
            {gameType===2 && turn?
                <span className="success-color">
                    <i className="fa-solid fa-stopwatch fa-xl"></i>
                </span>
                :
                <></>
            }
            {gameType===2 && !turn?
                <span className="error-color">
                    <i className="fa-solid fa-hand fa-xl"></i>
                </span>
                :
                <></>
            }
        </div>  
    )
}

export default Header
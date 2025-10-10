import { useNavigate } from "react-router-dom";
import Timer from "./Timer";
import { Game } from "../../models/game";

interface GameHeaderProps {
    game: Game,
    game_type: number,
    turn?: boolean,
    time: number,
    pause: () => void,
    play: () => void,
    timerOn: boolean,
    setTimeElapsed: React.Dispatch<React.SetStateAction<number>>,
    notebookMode: boolean,
    setNotebookMode: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * This component shows the main puzzle solving information such as ammount of errors and time elapsed. It also provides related funcctions such as game saving.
 * @param GameHeaderProps - An object containing the folowing props:
 * @property game - The Game class instance related to a concrete game_id.
 * @property game_type - The type of game being player.
 * @property turn.
 * @property time - The time elapsed since the game started.
 * @property pause - A pause function given by the father component.
 * @property play - A play function given by the father component.
 * @property timerOn - The father component local state wich controls the timer.
 * @returns 
 */
const Header:React.FC<GameHeaderProps> = ({game , game_type, turn, time , pause , play , timerOn, setTimeElapsed, notebookMode, setNotebookMode}) => {

    const navigate = useNavigate()

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
            <Timer timeElapsed={time} timerOn={timerOn} setTimeElapsed={setTimeElapsed}/>
            {timerOn ?
                <button onClick={pause}>
                    <i className="fa-solid fa-pause fa-xl"></i>  
                </button>
                :
                <button onClick={play}>
                    <i className="fa-solid fa-play fa-xl"></i>  
                </button>
            }
            <button onClick={() => game.saveAnswers(game.answers.grid, game.answers.number, game.annotations, time)}>
                <i className="fa-solid fa-floppy-disk fa-xl"></i>
            </button>
            {notebookMode ? (
                    <button type="button" onClick={() => setNotebookMode(false)}>
                        <i className="fa-solid fa-pen-nib fa-xl"></i>
                    </button>
                )
                :
                (
                    <button type="button" onClick={() => setNotebookMode(true)}>
                        <i className="fa-solid fa-pencil fa-xl"></i>
                    </button>
                )
                }
            {game_type===2 && turn?
                <span className="success-color">
                    <i className="fa-solid fa-stopwatch fa-xl"></i>
                </span>
                :
                <></>
            }
            {game_type===2 && !turn?
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
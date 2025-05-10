import axios from "axios"
import { useNavigate } from "react-router-dom"
import variables from "../../../utils/variables"
import { PuzzleS } from "../../app/dbTypes"

interface GameOverProps {
    gameType: number,
    game_id: string | undefined,
    puzzle: PuzzleS | undefined
}

/**
 * This component handls the game over user's decisions. If playing a single player game, he gets to choose between retry and quit, othrwise he'll be able to quit only.
 * @param GameOverProps - An object that contains gameType (number), game_id (string) and puzzle (Puzzle type) props. 
 * @returns 
 */
const GameOver:React.FC<GameOverProps> = ({gameType, game_id , puzzle}) => {
    const navigate = useNavigate()

    /**
     * This resets the game data, in the player table: puzzle grid, puzzle number, number of errors and timer in the game table. Then reloads the whole window to play again.
     */
    async function retry () {
        const URL = variables.url_prefix + `/api/v1/players/single/${game_id}`
        const URL2 = variables.url_prefix + `/api/v1/games/${game_id}`
        try {
            await axios.patch(URL , {grid: puzzle?.grid , number: puzzle?.number , errors:0})
            await axios.patch(URL2 , {time:0})
            window.location.reload()
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * This updates the game data to "failed". In the player table the status will be 2 for failed game, same applies to the game table. Then it navigates to home.
     */
    async function surrender() {
        const URL = variables.url_prefix + `/api/v1/players/single/${game_id}`
        const URL2 = variables.url_prefix + `/api/v1/games/${game_id}`
        try {
            await axios.patch(URL , {status:2})
            await axios.patch(URL2 , {status:2})
            navigate('/')
        } catch (error) {
            console.error(error)
        }
    }
    
    if (gameType === 0) {
        return (
            <section className="game-over">
                <div className="window">
                    <h1>Game Over</h1>
                    <div className="go-btns">
                        <button onClick={retry} id="retry">Reintentar</button>
                        <button onClick={surrender} id="surrender">Salir</button>
                    </div>
                </div>
            </section>
        )
    } else {
        return (
            <section className="game-over">
                <div className="window">
                    <h1>Game Over</h1>
                    <div className="go-btns">
                        <button onClick={surrender} id="surrender">Salir</button>
                    </div>
                </div>
            </section>
        ) 
    }
}

export default GameOver
import { useNavigate } from "react-router-dom"
import { PuzzleS } from "../../models/dbTypes"
import { useEffect } from "react"
import { Game } from "../../models/game"
import { GamesServices, PlayersServices } from "../../services"

interface GameOverProps {
    gameType: number,
    game: Game | undefined,
    puzzle: PuzzleS | undefined,
    setTimerOn: React.Dispatch<React.SetStateAction<boolean>>
    timeElapsed: number
    multiplayerGameOver?: boolean
}

/**
 * This component handles the game over user's decisions. If playing a single player game, he gets to choose between retry and quit, othrwise he'll be able to quit only.
 * @param GameOverProps - An object that contains gameType (number), game_id (string) and puzzle (Puzzle type) props. 
 * @returns 
 */
const GameOver:React.FC<GameOverProps> = ({gameType, game , puzzle, setTimerOn, timeElapsed, multiplayerGameOver}) => {
    const navigate = useNavigate()

    /**
     * This resets the game data, in the player table: puzzle grid, puzzle number, number of errors and timer in the game table. Then reloads the whole window to play again.
     */
    async function retry () {
        try {
            if (game && game.id && puzzle) {
                await PlayersServices.updatePlayer(game.id, puzzle.grid , puzzle.number , 0, 0)
                await GamesServices.updateGame(game.id, 0 , 1)
            }
            window.location.reload()
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(
        () => {
            if (gameType === 1 && multiplayerGameOver) game?.saveAnswers(game.answers.grid, game.answers.number, timeElapsed, 2)
            setTimerOn(false)
        }, []
    )
    
    if (gameType === 0) {
        return (
            <section className="game-over">
                <div className="window">
                    <h1>Game Over</h1>
                    <div className="go-btns">
                        <button onClick={retry} id="retry">Reintentar</button>
                        <button onClick={() => navigate('/')} id="surrender">Salir</button>
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
                        <button onClick={() => navigate('/')} id="surrender">Salir</button>
                    </div>
                </div>
            </section>
        ) 
    }
}

export default GameOver
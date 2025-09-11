import { useEffect, useState } from "react"
import { Ids } from "../models/types"
import { AxiosResponse } from "axios"
import { Game, GameType } from "../models/game"
import { PlayerData } from "../models/dbTypes"
import { PlayersServices } from "../services"

interface UsePuzzleProps {
    game_id: Ids,
    game_type: GameType,
    setTimeElapsed: (time:number) => void
}

interface ErrorLog {
    message: string,
    error?: any
}

/**The main purpouse of this hook is to instantiate a Game object with server data and to provide its main methods and functions. For more information about them consult the "Game" class documentation.
 * @param {Ids} game_id - Unique identifier for the game wich is used for api calls.
 * @param {GameType} game_type
 * @param setTimeElapsed - Sets the time elapsed in a previously saved game if it is the case.
*/
export const useGame = ({game_id, game_type , setTimeElapsed}:UsePuzzleProps) => {
    const [game , setGame] = useState<Game|null>(null)
    const [loading , setLoading] = useState(true)
    const [error , setError] = useState<ErrorLog|null>(null)

    /**
     * Game data has a different structure in front-end and back-end. The more "unitary" version of it is declared as the "Game" class we use in the front-end. But, because of multiplayer logic reasons and database optimization in the back-end the game data is splitted between players tables and games tables. So, a game table is a data structure that keeps track of a particular game status and time elapsed, related to a particular puzzle as a foreign key. But is the player table wich stores the puzzle data and solving progression and "connects" to a game with the game id as a foreign key. This is why this function executes a get request to a playes end point rather than to a games end point. The "Game" class integrates both to a unitary structure (except for the timer) that makes sense to the front-end logic and posibly to common sense. 
     * @returns *{game , loading, error}: Since this hook is directly in charge to allow the "Game" component to be rendered it keeps track of the asynchronous fecthing operation state and informs it to the corresponding father component. Only when the "Game" class is fully instantiated with the backend-dataand returned to the "Game" component it is allowed to be rendered, otherwise it waits for results or doesn't render at all in cases of error.
     */
    const getGame = async() => {
        setLoading(true)
        setError(null)
        try {
            const res:AxiosResponse<PlayerData> = await PlayersServices.getPlayerByGameId(game_id)
            console.log(res.data)
            if (res.data) {
                setGame(new Game(game_type, res.data.id, res.data.host, res.data.Game.Puzzle.Sudoku , res.data.Game.Puzzle , game_id , res.data.number , res.data.grid))
                setTimeElapsed(res.data.Game.time)
            } else {
                setError({message:"Error getting the game, it doesn't exist"})
            }
        } catch(err:any) {
            setError({message:err.message || "Error getting the game", error:err})
        } finally {
            setLoading(false)
        }
    }

    useEffect(
        () => {
            if (game_id && !game) {
                getGame()
            }
        } , [game_id]
    )

    return {game , loading , error}

}
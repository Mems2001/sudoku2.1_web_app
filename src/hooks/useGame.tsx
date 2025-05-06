import { useEffect, useState } from "react"
import { Ids } from "../app/types"
import axios, { AxiosResponse } from "axios"
import variables from "../../utils/variables"
import { Game } from "../app/classes"
import { PlayerData } from "../app/dbTypes"

interface UsePuzzleProps {
    game_id: Ids | undefined,
    setTimeElapsed: (time:number) => void
}

/**The main purpouse of this hook is to instantiate a Game object with server data and to provide its main methods and functions.
 * @param game_id - Unique identifier for the game wich is used for api calls.
 * @param setTimeElapsed - Sets the time elapsed in a previously saved game if it is the case.
*/
export const useGame = ({game_id , setTimeElapsed}:UsePuzzleProps) => {
    const [game , setGame] = useState<Game|null>(null)
    const [loading , setLoading] = useState(true)
    const [error , setError] = useState<string|null>(null)

    const getGame = async() => {
        const URL = variables.url_prefix + `/api/v1/players/single/${game_id}`
        setLoading(true)
        setError(null)
        try {
            const res:AxiosResponse<PlayerData> = await axios.get(URL)
            console.log(res.data)
            if (res.data) {
                setGame(new Game(res.data.id, res.data.host, res.data.Game.Puzzle.Sudoku , res.data.Game.Puzzle , game_id , res.data.number , res.data.grid))
                setTimeElapsed(res.data.Game.time)
            } else {
                setError("Error getting the game, it doesn't exist")
            }
        } catch(err:any) {
            setError(err.message || "Error getting the game")
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
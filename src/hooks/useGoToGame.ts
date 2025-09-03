import { GameData, PuzzleData } from '../models/dbTypes'
import { useNavigate } from 'react-router-dom'
import { GamesServices, PostGameBody } from '../services/GamesServices'
import { PuzzlesServices } from '../services/PuzzlesServices'
import { AxiosResponse } from 'axios'

interface UseGoToGameProps {
    gameType: number,
    closeModal():void
}

 /**
* First picks a random puzzle, then creates a game according to the game type, then redirects to the module in charge on game rendering.
*/
export const useGoToGame = () => {
    const navigate = useNavigate()

    async function goToGame ({gameType, closeModal}:UseGoToGameProps) {
        try {
          const puzzle:AxiosResponse<PuzzleData> = await PuzzlesServices.getRandomPuzzle()
          const body:PostGameBody = {
            puzzle_id: puzzle.data.id,
            gameType,
            status: gameType===0?1:0
          }
          const game:AxiosResponse<GameData> = await GamesServices.createGame(body)
          closeModal()
          // console.log(game)
          return navigate(`/game/${gameType}/${game.data.id}`)
        } catch (error) {
          console.error(error)
        }
    }

    return {goToGame}
}
import { Socket } from "socket.io-client"
import { Ids } from "../models/types"

interface UsePlayPauseProps {
    gameType: number,
    game_id: Ids,
    socket?: Socket,
    setTimerOn:React.Dispatch<React.SetStateAction<boolean>>,
    setOpenSettings: React.Dispatch<React.SetStateAction<boolean>>
}

export const usePlayPause = ({gameType, game_id, socket, setOpenSettings, setTimerOn}:UsePlayPauseProps) => {
    /**
     * Allows any player to pause the game. If called in a multiplayer game it pauses the game of every player in the room.
     */
    function pauseGame () {
      if (gameType === 0) {
        setTimerOn(false)
        setOpenSettings(true)
      } else {
        if (socket) {
          socket.emit('pause-game' , game_id)
        }
      }
    }

    /**
     * For multiplayer games can be called only by the host, then it continues every room player's game. 
     */
    function playGame () {
      if (gameType === 0) {
        setOpenSettings(false)
        setTimerOn(true)
      }
    }

    return {playGame, pauseGame}
}
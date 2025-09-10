import { Socket } from "socket.io-client"
import { Ids } from "../models/types"
import { useState } from "react"

interface UsePlayPauseProps {
    game_type: number,
    game_id: Ids,
    socket?: Socket,
    setTimerOn:React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * Handles all the play pause functionality including open settings menu states.
 * @param {number} game_type 
 * @param {Ids} game_id
 * @param {Socket} socket
 * @param setTimerOn 
 * @returns 
 */
export const usePlayPause = ({game_type, game_id, socket, setTimerOn}:UsePlayPauseProps) => {
    const [openSettings , setOpenSettings] = useState(game_type===0?false:true)   
  
    /**
     * Allows any player to pause the game. If called in a multiplayer game it pauses the game of every player in the room.
     */
    function pauseGame () {
      if (game_type === 0) {
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
      if (game_type === 0) {
        setOpenSettings(false)
        setTimerOn(true)
      }
    }

    return {playGame, pauseGame, openSettings}
}
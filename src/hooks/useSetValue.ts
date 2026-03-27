import { useEffect, useState } from "react"
import { Game, UpdatedGameData } from "../models/game"
import { Socket } from "socket.io-client"
import { CellAnnotation, Ids } from "../models/types"
import { useSelector } from "react-redux"
import { RootState } from "../store/store"

interface UseSetValue {
    game_type: number,
    game: Game|null,
    socket?: Socket,
    timerOn: boolean,
    timeElapsed: number,
    turn?: boolean,
    setTurn: React.Dispatch<React.SetStateAction<boolean | undefined>>,
    notebookMode: boolean
}

interface CoopGameSavingData extends UpdatedGameData {
  setTurn: boolean
}

/**
 * A hook that provides all the value setting related functions (specially game saving handling) as the value setting itself, higlighting cells functions and related states as the current focused cell, and more. Pass the params as an object.
 * @param {number} game_type
 * @param {Game} game
 * @param {Socket} socket
 * @param {Cells} cells
 * @param {boolean} timerOn
 * @param {boolean} turn
 * @param {React.Dispatch<React.SetStateAction<boolean | undefined>>} setTurn
 * @returns {UseSetValueReturn} 
 */
export const useSetValue = ({game_type, timerOn, timeElapsed, game, socket, setTurn, turn, notebookMode}: UseSetValue) => {
    // console.log({game_type, timerOn, timeElapsed, game, socket, setTurn, turn, notebookMode})
    const [currentFocused , setCurrentFocus] = useState<string>()
    const [clickControl, setClickControl] = useState(false)
    const {input_mode} = useSelector((state:RootState) => state.gameSettings.value)

    async function setAnnotation(value:number) {
        if (!currentFocused || currentFocused === 'x' || !game) return
        
        const prev_annotation = game.annotations[parseInt(currentFocused[0])][parseInt(currentFocused[1])]
        let new_annotation:CellAnnotation = [...prev_annotation]
        if (prev_annotation[value-1] != 0) {
            new_annotation[value-1] = 0
        } else {
            new_annotation[value-1] = value
        }

        await numberButton(new_annotation, timeElapsed)
    }
    
    /**
     * This function is called when the user clicks on a number button or sets an input with the intention to fill a cell with the corresponding value. It also checks the correction of the value according to the filled sudoku. If there is not a focused cell or the game is paused it does nothing.
     * @param {number|CellAnnotation} value - A number that the user intends to put into the corresponding cell or sudoku's grid position, or a cell annotation
     * @param {number} timeElapsed - The time elapsed since the game started.
     */
    async function numberButton (value:number|CellAnnotation, timeElapsed:number) {
            
      //Prevents to add values to the puzzle if it's not the player's turn.
      if (game_type===2 && !turn) return
      
      if (currentFocused && value && timerOn) {
        //We allow the change only when the previously set value is different from the new one.
        if (game && !game.verifyValue(currentFocused)) {
          //First we set the value to the UI
          game.setValue(currentFocused , value)
          setClickControl(!clickControl)

          //Then we try to save the changes. Separting this concerns allows us to provide offline gaming.
          const saving_data = await game.saveValue(currentFocused, timeElapsed)

          if (!saving_data) throw new Error('Unable to set the value or save the data')

          if (game_type===2 && socket) {
            socket.emit('coop-save', {...saving_data, setTurn: value !== 10 && typeof value == "number"} as CoopGameSavingData)
            setTurn(value === 10 || typeof value !== "number")
          }
        }
      }
    }

    /**
     * This function handles the highlighting functions acording to a concrete cell, if the player's game settings allow it.
     * @param id - The cell id, which is its name and the positicion of the cell within a grid.
     */
    function focusOperations(id:string) {
      if (id !== 'x') setCurrentFocus(id)
      else setCurrentFocus(undefined)      
    }

    /**
     * Key event listener for allowing the user to set annotation values with the keyboard.
     */
    useEffect(() => {
        function handleGlobalKeyDown (e: KeyboardEvent) {
            if (!currentFocused || currentFocused === 'x' || !timerOn) return

            const key = e.key
            if (/^[1-9]$/.test(key)) {
                if (notebookMode && input_mode === 1 && timerOn ) {
                  const value = parseInt(key)
                  setClickControl(prev => !prev)
                  setAnnotation(value)
                } else if(!notebookMode && input_mode == 1 && timerOn) {
                  const value = parseInt(key)
                  setClickControl(prev => !prev)
                  numberButton(value, timeElapsed)
                }
            }
        }
      
        window.addEventListener('keypress', handleGlobalKeyDown)
        return () => window.removeEventListener('keypress', handleGlobalKeyDown)
    }, [currentFocused, game, timeElapsed, clickControl])

    /**
     * Coop game saving logic.
     */
    useEffect(() => {
        if (!socket || !game) return

        const coopSave = (data: CoopGameSavingData) => {
          console.log('cooperative game data:', data)
          game.setAnswers(data.updatedGrid, data.updatedNumber, data.updatedErrors, data.updatedAnnotations)
          setTurn(data.setTurn)
          setClickControl(!clickControl)
        }
        function newHost (newHostId:Ids) {
          if (game && (game?.player_id === newHostId)) {
            game.host = true
            setTurn(game.host)
            setClickControl(!clickControl)
          }
        }
    
        socket.on('coop-save-2', (data:CoopGameSavingData) => {coopSave(data)})
        socket.on('new-host', data => {newHost(data)})
    
        // Limpia el handler cuando cambie el socket/game o se desmonte el componente
        return () => {
          socket.off('coop-save-2')
          socket.off('new-host')
        };
    }, [socket, game])

    return {numberButton, focusOperations, currentFocused, setCurrentFocus, setAnnotation}
}
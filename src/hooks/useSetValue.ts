import { useEffect, useState } from "react"
import { Game, UpdatedGameData } from "../models/game"
import { Socket } from "socket.io-client"
import { CellAnnotation, Cells, Ids } from "../models/types"
import { useAppSelector } from "../models/hooks"
import { RootState } from "../store/store"

interface UseSetValue {
    game_type: number,
    game: Game|null,
    cells: Cells,
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
export const useSetValue = ({game_type, timerOn, timeElapsed, game, socket, setTurn, turn, cells, notebookMode}: UseSetValue) => {
    const [currentFocused , setCurrentFocus] = useState<string>()
    const [clickControl, setClickControl] = useState(false)
    
    const gameSettings = useAppSelector((state:RootState) => state.gameSettings.value)

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
      // console.warn("---> number button clicked:", currentFocused, value)

      //Prevents to add values to the puzzle if it's not the player's turn.
      if (game_type===2 && !turn) {
        return
      }

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

    // Focus actions

    /**
     * Highlighs all the cells that are in the same row, column or 3x3 quadrant as the selected cell. It also removes the highlight from all other cells or from all the cells whenever the user wantos to by clicking or tapping outside the UI grid.
     * @param id - A string that represents the cell id and the position of an element inside a grid.
     */
    function highlightCells (id:string) {
      for (let cell of cells) {
        if (id != 'x') {
          if (cell[0] === id[0] || cell[1] === id[1] || (Math.ceil((parseInt(cell[0])+1)/3) === Math.ceil((parseInt(id[0])+1)/3) && Math.ceil((parseInt(cell[1])+1)/3) === Math.ceil((parseInt(id[1])+1)/3))) {
            const div = document.getElementById(`c${cell}`) as HTMLDivElement
            div.classList.add('selected')
          } else {
            const div = document.getElementById(`c${cell}`) as HTMLDivElement
            div.classList.remove('selected')
          }
        } else {
          const div = document.getElementById(`c${cell}`) as HTMLDivElement
          div.classList.remove('selected')
        }
      }
    }

    /**
     * Hightlights al the values in the UI grid that are the same ass the selected one. It also removes the highlight from all the unmatched values or from all values if the user intend to by clicking outside the UI grid.
     * @param id  - A string that represents both the cell id and a position of an element inside a grid.
     */
    function highlightSameNumbers(id:string) {
      // Highlight all numbers that are the same as the selected one
      let number = document.getElementById(id)?.innerText
      if (!number || id == 'x') {
        number = '10'
      }
      for (let cell of cells) {
        const number2 = document.getElementById(cell)?.innerText
        if (number == number2) {
          const div = document.getElementById(`c${cell}`) as HTMLDivElement
          div.classList.add('font-bold')
        } else {
          const div = document.getElementById(`c${cell}`) as HTMLDivElement
          div.classList.remove('font-bold')
        }

        for (let i = 1; i < 10; i ++) {
          const annotation = document.getElementById(`${cell}${i}`)
          if (annotation) {
            const annotation_number = annotation.innerText
            if (annotation_number === number) {
              const span = document.getElementById(`${cell}${i}`) as HTMLSpanElement
              span.classList.add('font-bold')
            } else {
              const span = document.getElementById(`${cell}${i}`) as HTMLSpanElement
              span.classList.remove('font-bold')
            }
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

      if (gameSettings.cells_highlight) {
        highlightCells(id)
      }
      if (gameSettings.numbers_highlight) {
        highlightSameNumbers(id)
      }
      
    }

    function clearCellsHighlighting () {
      cells.forEach(cell => {
        const div = document.getElementById(`c${cell}`) as HTMLDivElement
        div.classList.remove('selected')
      })
    }

    function clearNumbersHighlighting () {
      cells.forEach(cell => {
        const div = document.getElementById(`c${cell}`) as HTMLDivElement
        div.classList.remove('font-bold')
      })
    }

    useEffect(
        () => {
          if (currentFocused) {
            focusOperations(currentFocused)
            // console.log('refreshed focus')
          }
        }, [clickControl]
    )

    useEffect(() => {
        function handleGlobalKeyDown (e: KeyboardEvent) {
            if (!currentFocused || currentFocused === 'x' || !timerOn) return

            const key = e.key
            if (/^[1-9]$/.test(key)) {
                if (notebookMode) {
                  const value = parseInt(key)
                  setClickControl(prev => !prev)
                  setAnnotation(value)
                }
            }
        }
      
        window.addEventListener('keydown', handleGlobalKeyDown)
        return () => window.removeEventListener('keydown', handleGlobalKeyDown)
    }, [currentFocused, game, timeElapsed, clickControl])

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

    return {numberButton, focusOperations, currentFocused, clearCellsHighlighting, clearNumbersHighlighting, gameSettings, highlightCells, highlightSameNumbers, setAnnotation}
}
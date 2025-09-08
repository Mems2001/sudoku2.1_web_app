import { useEffect, useState } from "react"
import { Game } from "../models/game"
import { Socket } from "socket.io-client"
import { Cells, Ids } from "../models/types"
import { useAppSelector } from "../models/hooks"
import { RootState } from "../store/store"

interface UseSetValue {
    gameType: number,
    game: Game|null,
    cells: Cells,
    socket?: Socket,
    timerOn: boolean,
    turn?: boolean,
    setTurn: React.Dispatch<React.SetStateAction<boolean | undefined>>,
}

/**
 * A hook that provides all the value setting related functions as the value setting itself, higlighting cells functions and related states as the current focused cell, and more. Pass the params as an object.
 * @param {number} gameType
 * @param {Game} game
 * @param {Socket} socket
 * @param {Cells} cells
 * @param {boolean} timerOn
 * @param {React.Dispatch<React.SetStateAction<boolean | undefined>>} setTurn
 * @returns {UseSetValueReturn} 
 */
export const useSetValue = ({gameType, timerOn, game, socket, setTurn, turn, cells}: UseSetValue) => {
    const [currentFocused , setCurrentFocus] = useState<string>()
    const [clickControl, setClickControl] = useState(false)
    const gameSettings = useAppSelector((state:RootState) => state.gameSettings.value)
    
    /**
     * This function is called when the user clicks on a number button with the intention to fill a cell with the corresponding value. It also checks the correction of the value according to the filled sudoku. If there is not a focused cell or the game is paused it does nothing.
     * @param {number} value - A number that the user intends to put into the corresponding cell or sudoku's grid position. 
     * @param {number} timeElapsed - The time elapsed since the game started.
     */
    function numberButton (value:number, timeElapsed:number) {
      // console.log(currentFocused, value)

      //Prevents to add values to the puzzle if it's not the player's turn.
      if (gameType===2 && !turn) {
        return
      }

      if (currentFocused && value && timerOn) {
        //We allow the change only when the previusly set value is not correct.
        if (game && game.getAnswersValueByPosition(currentFocused) !== game.getSudokuValueByPosition(currentFocused)) {
          game?.setValue(currentFocused , value, timeElapsed)
          if (gameType===2 && socket) {
            socket.emit('coop-save', {currentFocused, value, timeElapsed, gameType})
            if (game.verifyValue(currentFocused)) setTurn(false)
          }
          // setValueAtHtml(cell , value)
          setClickControl(!clickControl)
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
            const divs = document.getElementsByClassName("cell") as HTMLCollectionOf<HTMLDivElement>
            for (const c of divs) {
              c.classList.add(gameSettings.highlight_color)
            }
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
      }
    }

    /**
     * This function handles the highlighting functions acording to a concrete cell, if the player's game settings allow it.
     * @param id - The cell id, which is its name and the positicion of the cell within a grid.
     */
    function focusOperations(id:string) {
      if (gameSettings.cells_highlight) {
        highlightCells(id)
        const cells = document.getElementsByClassName("cell") as HTMLCollectionOf<HTMLDivElement>
        for (const c of cells) {
          c.classList.add(`${gameSettings.highlight_color}`)
        }
      }
      if (gameSettings.numbers_highlight) {
        highlightSameNumbers(id)
      }
      if (id != 'x') setCurrentFocus(id)
      else setCurrentFocus(undefined)
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
        if (!socket || !game) return

        const coopSave = (data: any) => {
          console.log('cooperative game data:', data)
          game.setValue(data.currentFocused, data.value, data.timeElapsed)
          if (game.verifyValue(data.currentFocused))  setTurn(true)
          setClickControl(!clickControl)
        }
        function newHost (newHostId:Ids) {
          if (game && (game?.player_id === newHostId)) {
            game.host = true
            setTurn(game.host)
            setClickControl(!clickControl)
          }
        }
    
        socket.on('coop-save-2', data => {coopSave(data)})
        socket.on('new-host', data => {newHost(data)})
    
        // Limpia el handler cuando cambie el socket/game o se desmonte el componente
        return () => {
          socket.off('coop-save-2')
          socket.off('new-host')
        };
    }, [socket, game])

    return {numberButton, focusOperations, currentFocused, clearCellsHighlighting, clearNumbersHighlighting, gameSettings, highlightCells, highlightSameNumbers}
}
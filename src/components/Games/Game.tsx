import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Header from "./Header";
import GameOver from "./GameOver";
import GameCompleted from "./GameCompleted";
import { Cells, Ids } from "../../app/types";
import GameSettins from "./GameSettings";
import { useGame } from "../../hooks/useGame";
import VsRomm from "./VsRoom";
import { PlayerData } from "../../app/dbTypes";
import { Socket } from "socket.io-client";

interface GameProps {
  gameType: number // 0 -> single plager , 1 -> multiplayer vs time attack
  timeElapsed: number
  setTimeElapsed: React.Dispatch<React.SetStateAction<number>>
  timerOn: boolean
  setTimerOn: React.Dispatch<React.SetStateAction<boolean>>
  //Multiplayer props
  players?: PlayerData[],
  inList?: boolean,
  host?: boolean,
  socket?: Socket
}

/**
 * This component contains the general functions for any single player game, such as the game menu, settings, timer, win and lose conditions, and displays the puzzle information. It is the main user interface for game interactions but deppends on other components and hooks to work correctly. Its main purpose is to display and order information from the game.
 * @property gameType - A number that indicates if it is a single player game (0) or a multiplayer game (1).
 * @property timeElapsed - A number that indicates the time elapsed since the game started.
 * @property setTimeElapsed - A function that sets the time elapsed.
 * @property timerOn - A boolean that indicates if the timer is on or not.
 * @property setTimerOn - A function that sets the timer on or off.
 * @property (multiplayer only) players - An array of the player objects that joined the game.
 * @property (multiplayer only) inList - A boolean that indicates if the user is in the game list.
 * @property (multiplayer only) host - A boolean that indicates if the user is the host of the game.
 * @property (mutiplayer only) socket - The socket objct that allos the user to comunicates with the game server for online playing.
 */
const Game:React.FC<GameProps> = ({
  gameType, timeElapsed, setTimeElapsed, timerOn, setTimerOn,
  //Multiplayer props
  players, inList, socket
  }) => {
    const game_id:Ids = useParams().game_id as Ids
    const {register} = useForm()

    //General game functionality states
    const [currentFocus , setCurrentFocus] = useState<string>()
    const [colorGuides , setColorGuides] = useState(true)
    const [numberGuides , setNumberGuides] = useState(true)
    const [openSettings , setOpenSettings] = useState(gameType===0?false:true)

    const {game , loading} = useGame({game_id , setTimeElapsed})
    // console.log("game_id:" , game_id , "game_info:" , game , "loading:" , loading , "error:" , error)

    const cells:Cells = [];

    /**
     * This function defines the cell's names of the sudoku grid, so we can use them later. The names are defined as a string with the format 'xy' where x is the row coordinate and y is the column coordinate, startind from 0 to 8.
     * @param cells - An empty array of strings that will be filled with strings representing matrix positioning row+column within a sudoku grid destined to used as html elements ids.
    */
    function defineCells (cells:Cells):void {
        for (let i=0 ; i < 9 ; i++) {
          for (let j=0 ; j < 9 ; j++) {
            cells.push(`${i}${j}`);
          }
        };
    }
    defineCells(cells)

    /**
    * This function adds the borders to the cells, so we can see the sudoku grid.
    * @param cells - An array of strings wich contains all the posible cell's names of a sudoku 9x9 grid written as row+column string concatenation.
    */
    function cellsBorders (cells:Cells):void {
      for (let cell of cells) {
        if (parseInt(cell[1]) == 2 || parseInt(cell[1]) == 5) {
          const c = document.getElementById(`c${cell}`) as HTMLDivElement
          c.classList.add('border-right')
        }
        if (parseInt(cell[1]) == 3 || parseInt(cell[1]) == 6) {
          const c = document.getElementById(`c${cell}`) as HTMLDivElement
          c.classList.add('border-left')
        }
        if (parseInt(cell[0]) == 2 || parseInt(cell[0]) == 5) {
          const c = document.getElementById(`c${cell}`) as HTMLDivElement
          c.classList.add('border-bottom')
        }
        if (parseInt(cell[0]) == 3 || parseInt(cell[0]) == 6) {
          const c = document.getElementById(`c${cell}`) as HTMLDivElement
          c.classList.add('border-top')
        }
      }
    }

    // In game functions

    function pauseGame (gameType:number) {
      if (gameType === 0) {
        setTimerOn(false)
        setOpenSettings(true)
      } else {
        if (socket) {
          socket.emit('pause-game' , game_id)
        }
      }
    }

    function playGame (gameType:number) {
      if (gameType === 0) {
        setOpenSettings(false)
        setTimerOn(true)
      }
    }

    /**
     * This function is called when the user clicks on a number button with the intention to fill a cell with the corresponding value. It sets the value to the corresponding focused html cell if there is one, it also checks the correction of the value according to the sudoku object destined for correction control. If there is not a focused cell or the game is paused it does nothing.
     * @param currentFocused - A string that represents the id of the focused cell, it also represents its position within the grid for correcction checks.
     * @param value - A number that the user intends to put into the corresponding cell or sudoku's grid position. 
     * @param timeElapsed - The time elapse since the game started.
     */
    function numberButton (currentFocused:string | undefined , value:number, timeElapsed:number) {
      // console.log(currentFocused, value)
      if (currentFocused && value && timerOn) {
        const cell = document.getElementById(currentFocused) as HTMLInputElement
        if (game && game.answers.grid[parseInt(currentFocused[0])][parseInt(currentFocused[1])] !== game.sudoku.grid[parseInt(currentFocused[0])][parseInt(currentFocused[1])]) {
          setValueAtHtml(cell , value)
          verifyNumber(cell , currentFocused , value, timeElapsed)
        }
      }
    }
    
    /**
     * This function first sets the value to the corresponding game object, then it checks for the value correctness and displays the result in the UI via highlighting.
     * @param cellHtml - The html element corresponding to the focused cell, it is used to display visual indicators for incorrect or correct values.
     * @param cell - The string that represents both the id of a cell and the position of an element in the grid. It is used to set the value in the correct position within the game object and to check for correctness.
     * @param value - A number that represents the value that a user wants to put into the cell and therefore into the grid.
     * @param timeElapsed - The time elapsed since the game started.
     */
    function verifyNumber (cellHtml:HTMLInputElement , cell:string , value:number, timeElapsed:number) {
      game?.setValue(cell , value, timeElapsed)
      // let err = game?.errors || 0
      // We need to compare the provided value with the correct value, then, let the user know if he is correct or not
      if (game?.verifyValue(cell , value)) {
        cellHtml.classList.remove('incorrect')
        cellHtml.classList.add('correct')
        cellHtml.disabled = true
      } else {
        cellHtml.classList.remove('correct')
        cellHtml.classList.add('incorrect')
      }
    }

    /**
     * This function sets the value into the corresponding cell within the frontend display, it does not set value to the game object or the database.
     * @param cell - A html element to wich the value will be set, it is the focused cell in the UI.
     * @param value - The user's desired value to be ser into the cell.
     */
    function setValueAtHtml (cell:HTMLInputElement, value:number) {
      if (value != 10) {
        cell.value = value.toString()
        cell.focus()
      } else {
        cell.value = ''
        cell.focus()
      }
    }

    // Focus actions

    /**
     * Highlighs all the cells that are in the same row, column or 3x3 quadrant as the selected cell. It also removes the highlight from all other cells or from all the cells whenever the user wantos to by clicking or tapping outside the UI grid.
     * @param id - A string that represents the cell id and the position of an element inside a grid.
     */
    function highlightRowNColumn (id:string) {
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
      }
    }

    const handleFocus = useCallback((id:string) => { 
      focusOperations(id)
    } , [focusOperations])

    function focusOperations(id:string) {
      if (colorGuides) {
        highlightRowNColumn(id)
      }
      if (numberGuides) {
        highlightSameNumbers(id)
      }
      setCurrentFocus(id)
    }

    function clearColorGuides () {
      cells.forEach(cell => {
        const div = document.getElementById(`c${cell}`) as HTMLDivElement
        div.classList.remove('selected')
      })
    }

    function clearNumberGuides () {
      cells.forEach(cell => {
        const div = document.getElementById(`c${cell}`) as HTMLDivElement
        div.classList.remove('font-bold')
      })
    }
        
    useEffect(
      () => {
        if (game) {
          cellsBorders(cells)
        } else {

        }
      } , [game]
    )

    useEffect(
      () => {
        if (currentFocus) {
          focusOperations(currentFocus)
        }
      }, [currentFocus , game?.answers.grid]
    )

    if (!loading && game) {
        return (
          <div className="grid-container"> 
            <Header errores={game.errors} time={timeElapsed} pause={() => pauseGame(gameType)} play={() => playGame(gameType)} timerOn={timerOn} save={() => game.saveAnswers(game.answers.grid, game.answers.number, timeElapsed)}/>
            <div className="grid">
            {cells.map((cell, index) => {
                return (
                <div id={`c${cell}`} onClick={() => handleFocus(cell)} className="cell" key={index}>
                    {game.answers.grid[parseInt(cell[0])][parseInt(cell[1])] == game.sudoku.grid[parseInt(cell[0])][parseInt(cell[1])]?
                        <p id={cell}>{game.answers.grid[parseInt(cell[0])][parseInt(cell[1])]}</p>
                    : 
                        <input id={cell} type="text" autoComplete="off" readOnly={true} maxLength={1}
                        disabled={!timerOn} 
                        defaultValue={game.answers.grid[parseInt(cell[0])][parseInt(cell[1])] != 0 ? game.answers.grid[parseInt(cell[0])][parseInt(cell[1])] : ''} 
                        className={game.answers.grid[parseInt(cell[0])][parseInt(cell[1])] == game.sudoku.grid[parseInt(cell[0])][parseInt(cell[1])] ? 'correct' : 'incorrect'}
                        {...register(`${cell}`)}/>
                    }
                </div>
                )
            })}
            </div>
            <div className="remaining-numbers">
              <h2>Números restantes:</h2>
              {game.remainingNumbers.map((n , index) => 
                <button onClick={() => numberButton(currentFocus , index+1, timeElapsed)} className="remaining-number" key={index}>{n<9?index +1:''}</button>
              )}
              <button onClick={() => numberButton(currentFocus , 10, timeElapsed)}>
                <i className="fa-solid fa-eraser fa-xl"></i>
              </button>
            </div>
            <div id="x" onClick={() => focusOperations('x')} className="grid-auxiliar"></div>

            {/* Game menu for single player games */}
            {openSettings && gameType===0?
              <GameSettins rcMatch={colorGuides} nMatch={numberGuides} setRcMatch={setColorGuides} setNMatch={setNumberGuides} clearColorGuides={clearColorGuides} clearNumberGuides={clearNumberGuides} selectRowNColumn={() => { if (currentFocus)highlightRowNColumn(currentFocus)}} sameNumbers={() => {if (currentFocus) highlightSameNumbers(currentFocus)}}/>
                :
              <></>}
            
            {/* Game menu for multiplayer games */}
            {!timerOn && gameType===1?
              <VsRomm game_id={game_id} players={players} inList={inList} host={game.host} socket={socket}/>
              :
              <></>
            }

            {game.gameOverCheck()?
              <GameOver gameType={gameType} game_id={game_id} puzzle={game.puzzle} setTimerOn={setTimerOn}/>
              :
              <></>
            }
            {game.completedGameCheck()?
              <GameCompleted setTimerOn={setTimerOn}/>
              :
              <></>
            }
          </div>
        )
    }
  }

export default Game
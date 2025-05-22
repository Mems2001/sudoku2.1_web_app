import React, { useEffect, useState } from "react";
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
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import { setGameSettings } from "../../features/gameSettings.slice";

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
  socket?: Socket,
  multiplayerGameOver?: boolean
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
  players, inList, socket, multiplayerGameOver
  }) => {
    const game_id:Ids = useParams().game_id as Ids
    const {register} = useForm()
    const dispatch = useAppDispatch()

    //General game functionality states
    const [turn, setTurn] = useState<boolean|undefined>(undefined)
    const [clickControl, setClickControl] = useState(false)
    const [currentFocus , setCurrentFocus] = useState<string>()
    const gameSettings = useAppSelector((state:RootState) => state.gameSettings.value)
    const [openSettings , setOpenSettings] = useState(gameType===0?false:true)
    const {game , loading} = useGame({game_id , setTimeElapsed})
    // console.log("game_id:" , game_id , "game_info:" , game , "loading:" , loading , "error:" , error)
    // console.log("game_settings:", gameSettings)

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
     * This function is called when the user clicks on a number button with the intention to fill a cell with the corresponding value. It also checks the correction of the value according to the filled sudoku. If there is not a focused cell or the game is paused it does nothing.
     * @param currentFocused - A string that represents the id of the focused cell, it also represents its position within the grid for correcction checks.
     * @param value - A number that the user intends to put into the corresponding cell or sudoku's grid position. 
     * @param timeElapsed - The time elapse since the game started.
     */
    function numberButton (currentFocused:string | undefined , value:number, timeElapsed:number) {
      // console.log(currentFocused, value)
      if (gameType===2 && !turn) {
        return
      }

      if (currentFocused && value && timerOn) {
        //We allow the change only when the value is not correct.
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
     * This function handles the highlighting functions acording to a concrete cell.
     * @param id - The cell id, which is its name and the positicion of the cell within a grid.
     */
    function focusOperations(id:string) {
      if (gameSettings.cells_highlight) {
        highlightCells(id)
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
        if (game) {
          cellsBorders(cells)
          setTurn(game.host)
        } else {

        }
      } , [game]
    )

    useEffect(
      () => {
        if (currentFocus) {
          focusOperations(currentFocus)
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
        if (game?.player_id === newHostId) {
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

    if (!loading && game) {
        return (
          <div className="grid-container"> 
            <Header game={game} gameType={gameType} turn={turn} time={timeElapsed} pause={() => pauseGame(gameType)} play={() => playGame(gameType)} timerOn={timerOn}/>

            <div className="grid">
            {cells.map((cell, index) => {
                return (
                <div id={`c${cell}`} onClick={() => focusOperations(cell)} className="cell" key={index}>
                    {game.verifyValue(cell)?
                        <p id={cell}>{game.getAnswersValueByPosition(cell)}</p>
                    : 
                        <input id={cell} type="text" autoComplete="off" readOnly={true} maxLength={1}
                        disabled={!timerOn}
                        defaultValue={game.getAnswersValueByPosition(cell) != 0 ? game.getAnswersValueByPosition(cell) : ''} 
                        className={!game.verifyValue(cell) ? 'incorrect' : 'correct'}
                        {...register(`${cell}`)}/>
                    }
                </div>
                )
            })}
            </div>

            <div className="remaining-numbers">
              <h2>Números restantes:</h2>
              {game.remainingNumbers.map((n , index) => 
                <button onClick={() => numberButton(currentFocus , index+1, timeElapsed)} className="remaining-number" key={index}
                disabled={gameType===2 && !turn}>{n<9?index +1:''}</button>
              )}
              <button onClick={() => numberButton(currentFocus , 10, timeElapsed)}
                disabled={gameType===2 && !turn}>
                <i className="fa-solid fa-eraser fa-xl"></i>
              </button>
            </div>
            <div id="x" onClick={() => focusOperations('x')} className="grid-auxiliar"></div>

            {/* Game menu for single player games */}
            {openSettings && gameType===0?
              <GameSettins gameType={gameType} cellsHighlight={gameSettings.cells_highlight} numbersHighlight={gameSettings.numbers_highlight} setGameSettings={(payload)=>dispatch(setGameSettings(payload))} clearCellsHighlighting={clearCellsHighlighting} clearNumbersHighlighting={clearNumbersHighlighting} selectCells={() => { if (currentFocus)highlightCells(currentFocus)}} sameNumbers={() => {if (currentFocus) highlightSameNumbers(currentFocus)}}/>
                :
              <></>}
            
            {/* Game menu for multiplayer games */}
            {!timerOn && gameType!=0?
              <VsRomm gameType={gameType} game_id={game_id} timeElapsed={timeElapsed} cellsHighlight={gameSettings.cells_highlight} numbersHighlight={gameSettings.numbers_highlight} clearCellsHighlighting={clearCellsHighlighting} clearNumbersHighlighting={clearNumbersHighlighting} sameNumbers={() => {if (currentFocus) highlightSameNumbers(currentFocus)}} selectCells={() => {if (currentFocus) highlightCells(currentFocus)}} setGameSettings={(payload) => dispatch(setGameSettings(payload))} players={players} inList={inList} host={game.host} socket={socket}/>
              :
              <></>
            }

            {game.gameOverCheck() || multiplayerGameOver?
              <GameOver gameType={gameType} game={game} puzzle={game.puzzle} setTimerOn={setTimerOn} timeElapsed={timeElapsed} multiplayerGameOver={multiplayerGameOver}/>
              :
              <></>
            }
            {game.completedGameCheck()?
              <GameCompleted gameType={gameType} pauseGame={() => pauseGame(gameType)} socket={socket}/>
              :
              <></>
            }
          </div>
        )
    }
  }

export default Game
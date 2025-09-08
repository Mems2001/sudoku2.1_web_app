import Header from "./Header"
import GameOver from "./GameOver"
import VsRomm from "./VsRoom"
import GameCompleted from "./GameCompleted"
import GameSettins from "./GameSettings"

import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { useForm } from "react-hook-form"

import { Ids } from "../../models/types"
import { Socket } from "socket.io-client"
import { useGridCells, usePlayPause, useGame, useSetValue } from "../../hooks"

interface GameProps {
  gameType: number // 0 -> single plager , 1 -> multiplayer vs time attack 2 -> Cooperative
  timeElapsed: number
  setTimeElapsed: React.Dispatch<React.SetStateAction<number>>
  timerOn: boolean
  setTimerOn: React.Dispatch<React.SetStateAction<boolean>>
  //Multiplayer props
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
 inList, socket, multiplayerGameOver
  }) => {
    const game_id:Ids = useParams().game_id as Ids
    const {register} = useForm()

    //General game functionality states
    const [openSettings , setOpenSettings] = useState(gameType===0?false:true)
    const {game , loading} = useGame({game_id , setTimeElapsed})
    const [turn, setTurn] = useState<boolean|undefined>(undefined)
    
    //Set the cells grid object
    const { cells } = useGridCells({game, setTurn})

    // ---> In Game functions <---
    
    //Provides the main value setting functions and related states
    const {numberButton, focusOperations, currentFocused, clearCellsHighlighting, clearNumbersHighlighting, highlightCells, highlightSameNumbers} = useSetValue({gameType, game, cells, setTurn, socket, timerOn, turn})
    //Provides play and pause game functions
    const { playGame, pauseGame } = usePlayPause({gameType, game_id, socket, setOpenSettings, setTimerOn})
    // console.log("game_id:" , game_id , "game_info:" , game , "loading:" , loading , "error:" , error)
    // console.log("game_settings:", gameSettings)

    if (!loading && game) {
        return (
          <div className="grid-container"> 
            <Header game={game} gameType={gameType} turn={turn} time={timeElapsed} pause={() => pauseGame()} play={() => playGame()} timerOn={timerOn} setTimeElapsed={setTimeElapsed}/>

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
              <div className="numbers">
                {game.remainingNumbers.map((n , index) => 
                  <button onClick={() => numberButton(index+1, timeElapsed)} className="remaining-number" key={index}
                  disabled={gameType===2 && !turn}>{n<9?index +1:''}</button>
                )}
                <button onClick={() => numberButton(10, timeElapsed)}
                  disabled={gameType===2 && !turn}>
                  <i className="fa-solid fa-eraser fa-2xl"></i>
                </button>
              </div> 
            </div>
            <div id="x" onClick={() => focusOperations('x')} className="grid-auxiliar"></div>

            {/* Game menu for single player games */}
            {openSettings && gameType===0?
              <GameSettins gameType={gameType} clearCellsHighlighting={clearCellsHighlighting} clearNumbersHighlighting={clearNumbersHighlighting} selectCells={() => { if (currentFocused) highlightCells(currentFocused)}} sameNumbers={() => {if (currentFocused) highlightSameNumbers(currentFocused)}}/>
                :
              <></>}
            
            {/* Game menu for multiplayer games */}
            {!timerOn && gameType!=0?
              <VsRomm gameType={gameType} game_id={game_id} timeElapsed={timeElapsed} clearCellsHighlighting={clearCellsHighlighting} clearNumbersHighlighting={clearNumbersHighlighting} sameNumbers={() => {if (currentFocused) highlightSameNumbers(currentFocused)}} selectCells={() => {if (currentFocused) highlightCells(currentFocused)}} inList={inList} host={game.host} socket={socket}/>
              :
              <></>
            }

            {game.gameOverCheck() || multiplayerGameOver?
              <GameOver gameType={gameType} game={game} puzzle={game.puzzle} setTimerOn={setTimerOn} timeElapsed={timeElapsed} multiplayerGameOver={multiplayerGameOver}/>
              :
              <></>
            }
            {game.completedGameCheck()?
              <GameCompleted gameType={gameType} pauseGame={() => pauseGame()} socket={socket}/>
              :
              <></>
            }
          </div>
        )
    }
  }

export default Game
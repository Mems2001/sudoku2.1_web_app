import Header from "./Header"
import GameOver from "./GameOver"
import VsRomm from "./VsRoom"
import GameCompleted from "./GameCompleted"
import GameSettings from "./GameSettings"
import Cell from "./Cell"

import React, { useState } from "react"
import { useParams } from "react-router-dom"

import { Ids } from "../../models/types"
import { Socket } from "socket.io-client"
import { useGridCells, usePlayPause, useGame, useSetValue } from "../../hooks"
import { PlayerData } from "../../models/dbTypes"
import { GameType } from "../../models/game"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store"
import NumberButtons from "./NumberButtons"
import { AnimatePresence } from "framer-motion"

interface GameProps {
  timeElapsed: number
  setTimeElapsed: React.Dispatch<React.SetStateAction<number>>
  timerOn: boolean
  setTimerOn: React.Dispatch<React.SetStateAction<boolean>>
  //Multiplayer props
  inList?: boolean,
  socket?: Socket,
  socketConexionOn?: boolean,
  multiplayerGameOver?: boolean,
  players?: PlayerData[]
}

/**
 * This component contains the general functions for any single player game, such as the game menu, settings, timer, win and lose conditions, and displays the puzzle information. It is the main user interface for game interactions but deppends on other components and hooks to work correctly. Its main purpose is to display and order information from the game.
 * @property timeElapsed - A number that indicates the time elapsed since the game started.
 * @property setTimeElapsed - A function that sets the time elapsed.
 * @property timerOn - A boolean that indicates if the timer is on or not.
 * @property setTimerOn - A function that sets the timer on or off.
 * @property (multiplayer only) inList - A boolean that indicates if the user is in the game list.
 * @property (mutiplayer only) socket - The socket objct that allows the user to comunicates with the game server for online playing.
 * @property (mutiplayer only) socketConexionOn - Informs if the socket server is live.
 */
const Game:React.FC<GameProps> = ({
  timeElapsed, setTimeElapsed, timerOn, setTimerOn,
  //Multiplayer props
 inList, socket, multiplayerGameOver, players, socketConexionOn
  }) => {
    const game_id:Ids = useParams().game_id as Ids 
    const game_type: GameType = parseInt(useParams().game_type as string) as GameType
    const { input_mode, highlight_color } = useSelector((state:RootState) => state.gameSettings.value)
    // console.log("---> game type and timer:",game_type, timerOn)

    //General game functionality states
    const {game , loading} = useGame({game_id, game_type , setTimeElapsed})
    const [turn, setTurn] = useState<boolean|undefined>(undefined)
    const [notebookMode, setNotebookMode] = useState(false)
    
    //Set the cells grid object and its properties
    const { cells } = useGridCells({game, setTurn})
    const cellsAux = document.getElementsByClassName("cell") as HTMLCollectionOf<HTMLDivElement>
          for (const c of cellsAux) {
              c.classList.add(highlight_color)
          }

    // ---> In Game functions <---
    
    //Provides the main value setting functions and related states
    const {numberButton, focusOperations, currentFocused, clearCellsHighlighting, clearNumbersHighlighting, highlightCells, highlightSameNumbers} = useSetValue({game_type, game, cells, setTurn, socket, timerOn, timeElapsed, turn, notebookMode})
    //Provides play and pause game functions
    const { playGame, pauseGame, openSettings } = usePlayPause({game_type, game_id, socket, setTimerOn})
    // console.log("game_id:" , game_id , "game_info:" , game , "loading:" , loading , "error:" , error)
    // console.log("game_settings:", gameSettings)

    if (!loading && game) {
        return (
          <section className="grid-container"> 
            <Header game={game} game_type={game_type} turn={turn} time={timeElapsed} pause={() => pauseGame()} play={() => playGame()} timerOn={timerOn} setTimeElapsed={setTimeElapsed} notebookMode={notebookMode} setNotebookMode={setNotebookMode}/>

            <div className="grid">
              {cells.map((cell, index) =>  (
                  <Cell key={index} game={game} cell={cell} focusOperations={focusOperations} timerOn={timerOn} timeElapsed={timeElapsed} turn={turn} notebookMode={notebookMode} numberButton={numberButton} currentFocused={currentFocused}/>  
                )
              )}
            </div>

            <NumberButtons game={game} game_type={game_type} input_mode={input_mode} notebookMode={notebookMode} numberButton={numberButton} timeElapsed={timeElapsed} turn={turn} currentFocused={currentFocused}/>

            <div id="x" onClick={() => focusOperations('x')} className="grid-auxiliar"></div>

            {/* Game menu for single player games */}
            <AnimatePresence>
              {openSettings && game_type===0 && (
                <GameSettings key='sp-game-settings' gameType={game_type} clearCellsHighlighting={clearCellsHighlighting} clearNumbersHighlighting={clearNumbersHighlighting} selectCells={() => { if (currentFocused) highlightCells(currentFocused)}} sameNumbers={() => {if (currentFocused) highlightSameNumbers(currentFocused)}}/>
              )}
            </AnimatePresence>
            
            {/* Game menu for multiplayer games */}
            <AnimatePresence>
              {!timerOn && game_type!==0 && !game.gameOverCheck() && !multiplayerGameOver && (
                <VsRomm key='mp-game-settings' game_type={game_type} game_id={game_id} timeElapsed={timeElapsed} clearCellsHighlighting={clearCellsHighlighting} clearNumbersHighlighting={clearNumbersHighlighting} sameNumbers={() => {if (currentFocused) highlightSameNumbers(currentFocused)}} selectCells={() => {if (currentFocused) highlightCells(currentFocused)}} inList={inList} host={game.host} socket={socket} socketConexionOn={socketConexionOn} players={players}/>
              )}
            </AnimatePresence>

            {game.gameOverCheck() || multiplayerGameOver?
              <GameOver game_type={game_type} game={game} puzzle={game.puzzle} setTimerOn={setTimerOn} timeElapsed={timeElapsed} multiplayerGameOver={multiplayerGameOver}/>
              :
              <></>
            }
            {game.completedGameCheck()?
              <GameCompleted game_type={game_type} pauseGame={() => pauseGame()} socket={socket}/>
              :
              <></>
            }
          </section>
        )
    }
  }

export default Game
import variables from "../../../utils/variables"

import { Ids } from "../../models/types"
import { PlayerData } from "../../models/dbTypes"

import { Socket } from "socket.io-client"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {motion} from 'framer-motion'
import GameSettins from "./GameSettings"
import { GameModalProps, GameModalWindowProps } from "../../assets/animations"

interface VsRommProps {
    game_id: Ids,
    game_type: number,
    timeElapsed: number,
    clearCellsHighlighting: () => void,
    clearNumbersHighlighting: () => void,
    selectCells: () => void,
    sameNumbers: () => void,
    players: PlayerData[] | undefined
    inList?: boolean,
    host?: boolean,
    socket?: Socket,
    socketConexionOn?: boolean
}

const VsRomm:React.FC<VsRommProps> = ({game_id, game_type, timeElapsed, clearCellsHighlighting, clearNumbersHighlighting, selectCells, sameNumbers, players , inList, host , socket, socketConexionOn }) => {
    const navigate = useNavigate()

    const shareLink = async () => {
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'Partida Vs en Sudoku 2.1',
              text: 'Fuiste invitado a una partida Vs en Sudoku 2.1, da click en el link para jugar',
              url: variables.share_link_prefix + `/#/game/${game_type}/${game_id}`,
            });
            console.log('Enlace compartido con éxito');
          } catch (error) {
            console.error('Error al compartir el enlace:', error);
          }
        } else {
          console.log('La API de Web Share no es compatible con este navegador.');
        }
      }

    function playGame (socket:Socket | undefined, init:boolean = false) {
        if (socket) {
            socket.emit('play-game' , {game_id, init})
        }
    }

    useEffect(
        () => {
        console.log(players , inList)
        } , [players , inList]
    )

    if (inList && players && players.length > 0) {
        return (
            <motion.section className="vs-console"
            {...GameModalProps}>

                <motion.div className="window"
                {...GameModalWindowProps}>
                    <div className="current-players">
                        <h2>Current Players:</h2>
                        {socketConexionOn ? (
                            <div className="players-container">
                                {players ? 
                                    players.map(player =>
                                        <div key={player.id} className="player-info">
                                            <span>{player.User?.username}</span>
                                            {player.host?
                                                <span className="host-medal">host</span>
                                                :
                                                <></>
                                            }
                                        </div>
                                    )
                                    : 
                                <></>}
                            </div>
                        ) : (
                            <h2 className="conexion-error-title">Server offline</h2>
                        )}
                    </div>

                    <div className="room-actions">
                        {/* <button>Invitar</button> */}
                        <button onClick={shareLink}>Compartir link</button>
                    </div>

                    <GameSettins gameType={game_type} clearCellsHighlighting={clearCellsHighlighting} clearNumbersHighlighting={clearNumbersHighlighting} sameNumbers={sameNumbers} selectCells={selectCells}/>

                    <div id='main-room-actions' className="room-actions">
                        { timeElapsed === 0?
                            <button className="continue" onClick={() => playGame(socket, true)} disabled={(players && players.length < 2) || !host}>Start</button>
                            :
                            <button className="continue" disabled={!host} onClick={() => playGame(socket, false)}>Continue</button>
                        }
                        <button className="cancel" onClick={() => navigate('/')}>Salir</button>
                    </div>
                </motion.div>

            </motion.section>
        )
    }
}

export default VsRomm
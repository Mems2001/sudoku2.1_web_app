import { Ids } from "../../app/types"
import variables from "../../../utils/variables"
import { PlayerData } from "../../app/dbTypes"
import { Socket } from "socket.io-client"
import { useEffect } from "react"

interface VsRommProps {
    game_id: Ids,
    players?: PlayerData[]
    inList?: boolean,
    host?: boolean,
    socket?: Socket
}

const VsRomm:React.FC<VsRommProps> = ({game_id, players , inList, host , socket }) => {

    const shareLink = async () => {
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'Partida Vs en Sudoku 2.1',
              text: 'Fuiste invitado a una partida Vs en Sudoku 2.1, da click en el link para jugar',
              url: variables.share_link_prefix + `/#/game_vs/${game_id}`,
            });
            console.log('Enlace compartido con éxito');
          } catch (error) {
            console.error('Error al compartir el enlace:', error);
          }
        } else {
          console.log('La API de Web Share no es compatible con este navegador.');
        }
      }

    function playGame (socket:Socket | undefined) {
        if (socket) {
            socket.emit('play-game' , game_id)
        }
    }

    useEffect(
        () => {
        console.log(players , inList)
        } , [players , inList]
    )

    if (inList && players && players.length > 0) {
        return (
            <section className="vs-console">
                <div className="window">
                    <div className="current-players">
                        <h2>Current Players:</h2>
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
                    </div>
                    <div className="room-actions">
                        <button>Invitar</button>
                        <button onClick={shareLink}>Compartir link</button>
                    </div>
                    <div id='main-room-actions' className="room-actions">
                        <button className="continue" onClick={() => playGame(socket)} disabled={(players && players.length < 2) || !host ? true : false}>Continuar</button>
                        <button className="cancel">Salir</button>
                    </div>
                </div>
            </section>
        )
    }
}

export default VsRomm
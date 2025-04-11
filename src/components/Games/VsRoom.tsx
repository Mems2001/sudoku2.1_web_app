import { Ids } from "../../app/types"
import variables from "../../../utils/variables"
import axios from "axios"
import { PlayerData } from "../../app/dbTypes"
import { useAppDispatch } from "../../app/hooks"
import { setRole } from "../../features/role.slice"
import { Socket } from "socket.io-client"

interface VsRommProps {
    game_id: Ids,
    players: PlayerData[]
    inList: boolean,
    setInList: (boolean:boolean) => void,
    role: string | null,
    host: boolean,
    socket: Socket | null
}

const VsRomm:React.FC<VsRommProps> = ({game_id, players , inList, setInList, role , host , socket }) => {

    const dispatch = useAppDispatch()

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

    async function authSession () {
        const URL = variables.url_prefix + '/api/v1/auth/authenticate_session'
        let response = false
        await axios.get(URL)
            .then(res => {
                if (res.status === 200) response = true
            })
            .catch(err => {
                console.error(err)
            })

        return response
    }
    
    async function continueAsAnon () {
        try {
            const auth = await authSession()
            if (auth) {
                if (socket) socket.emit('create-player') 
                setInList(true)
            } else {
                const URL = variables.url_prefix + '/api/v1/users/anon'
                await axios.get(URL).then(res => {
                    console.log(res)
                    dispatch(setRole('anon'))
                    if (socket) socket.emit('create-player' , res.data.id , game_id)
                    setInList(true)
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    function playGame (socket:Socket | null) {
        if (socket) {
            socket.emit('play-game' , game_id)
        }
    }

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
                        <button onClick={() => playGame(socket)} disabled={(players && players.length < 2) || !host ? true : false}>Continuar</button>
                        <button className="cancel">Salir</button>
                    </div>
                </div>
            </section>
        )
    } else {
        return (
            <div className="vs-console">
                <div id="pre-room" className="window">
                    {role === 'anon' || role === null?
                        <div className="pre-room-actions">
                            <button>Iniciar Sesión</button>
                            <button onClick={continueAsAnon}>Continuar como anónimo</button>
                        </div>
                    :
                        <div className="pre-room-actions">
                            <button>Aceptar invitación</button>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default VsRomm
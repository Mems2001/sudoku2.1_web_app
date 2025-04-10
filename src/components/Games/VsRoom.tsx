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
              url: `http://localhost:5173/#/game_vs/${game_id}`,
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
                // const URL = variables.url_prefix + `/api/v1/players/${game_id}`
                // const res = await axios.post(URL)   
                // const newPlayers = [...players , res.data]
                // handlePlayers(undefined , newPlayers)
                setInList(true)
                // console.log('new players' , newPlayers)
            } else {
                const URL = variables.url_prefix + '/api/v1/users/anon'
                await axios.get(URL).then(() => dispatch(setRole('anon')))
                return continueAsAnon()
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
                        <p>Current Players:</p>
                        {players ? 
                            players.map(player => <span key={player.id}>{player.User?.username} {player.host? 'Host' : ''}</span>)
                            : 
                        <></>}
                    </div>
                    <div className="room-actions">
                        <button>Invitar</button>
                        <button onClick={shareLink}>Compartir link</button>
                    </div>
                    <div className="room-actions">
                        <button onClick={() => playGame(socket)} disabled={(players && players.length < 2) || !host ? true : false}>Continue</button>
                        <button className="cancel">Cancel</button>
                    </div>
                </div>
            </section>
        )
    } else {
        return (
            <div className="vs-console">
                <div className="window">
                    {role === 'anon' || role === null?
                        <div className="room-actions">
                            <button>Iniciar Sesión</button>
                            <button onClick={continueAsAnon}>Continuar como anónimo</button>
                        </div>
                    :
                        <div className="room-actions">
                            <button>Aceptar invitación</button>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default VsRomm
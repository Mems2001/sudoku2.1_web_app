import axios from "axios"
import variables from '../../../utils/variables'
import { Socket } from "socket.io-client"
import { Ids } from "../../app/types"
import { useAppDispatch } from "../../app/hooks"
import { setRole } from "../../features/role.slice"
import LoginFormC from "../UserAuth/LoginForm"
interface MultiplayerLoginProps {
    game_id: Ids
    socket?: Socket
}

const MultiplayerLogin:React.FC<MultiplayerLoginProps> = ({game_id, socket}) => {
    const dispatch = useAppDispatch()

    async function authSession () {
            const URL = variables.url_prefix + '/api/v1/auth/authenticate_session'
            let response = undefined
            await axios.get(URL)
                .then(res => {
                    if (res.status === 200) response = res.data
                })
                .catch(err => {
                    console.error(err)
                })
    
            return response
        }

    /**
     * When accesing a multiplayer game the user have the choice to play with its own profile or to do it as a anon and not log in. If he does not have an anon profile then the function creates it, in anycase it request a new player creation event, which from the back-end creates a player related to the profile id and add it to the game's players list.
     */
    async function continueAsAnon () {
            try {
                const auth:any = await authSession()
                if (auth) {
                    if (socket) socket.emit('create-player' , auth.user_id , game_id)
                } else {
                    const URL = variables.url_prefix + '/api/v1/users/anon'
                    await axios.get(URL).then(res => {
                        console.log(res)
                        dispatch(setRole('anon'))
                        if (socket) socket.emit('create-player' , res.data.id , game_id)
                    })
                }
            } catch (error) {
                console.error(error)
            }
        }

    return (
        <div className="pre-room-actions">
            <LoginFormC game_id={game_id} socket={socket}/>

            <button onClick={continueAsAnon}>Continuar como anónimo</button>
        </div>
    )
}

export default MultiplayerLogin
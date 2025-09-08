import { Socket } from "socket.io-client"
import { Ids } from "../../models/types"
import { useAppDispatch } from "../../models/hooks"
import { setRole } from "../../store/role.slice"
import LoginFormC from "../UserAuth/LoginForm"
import AuthServices from "../../services/AuthServices"
import { UsersServices } from "../../services"
interface MultiplayerLoginProps {
    game_id: Ids,
    socket?: Socket
}

const MultiplayerLogin:React.FC<MultiplayerLoginProps> = ({game_id, socket}) => {
    const dispatch = useAppDispatch()

    /**
     * When accesing a multiplayer game the user have the choice to play with its own profile or to do it as a anon and not log in. If he does not have an anon profile then the function creates it, in anycase it request a new player creation event, which from the back-end creates a player related to the profile id and add it to the game's players list.
     */
    async function continueAsAnon () {
            try {
                const auth = await AuthServices.getAuthenticateSession()
                if (auth) {
                    if (socket) socket.emit('create-player' , auth.data.user_id , game_id)
                } else {
                    await UsersServices.postAnon()
                        .then(res => {
                            console.log(res)
                            dispatch(setRole('anon'))
                            if (socket) socket.emit('create-player' , res.data.user_id , game_id)
                        })
                }
            } catch (error) {
                console.error(error)
            }
        }

    return (
        <div className="pre-room-actions">
            <LoginFormC game_id={game_id} socket={socket}/>

            <button className="anon-continue" type="button" onClick={continueAsAnon}>Continuar como anónimo</button>
        </div>
    )
}

export default MultiplayerLogin
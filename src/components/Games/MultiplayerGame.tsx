import axios from 'axios'
import variables from "../../../utils/variables"
import Game from "./Game"
import MultiplayerLogin from "./MultiplayerLogin"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Ids } from "../../models/types"
import { io, Socket } from "socket.io-client"
import { RootState } from "../../store/store"
import { useAppSelector } from "../../models/hooks"
import { useGetPlayers } from '../../hooks/useGetPlayers'

interface MultiplayerGameProps {
    gameType: number
}

/**
 * This component is in charge of socket handling for multiplayer games. That includes timer functions, players data, play or pause functions, and specially the player validation functions needed to access a game. We'll find here any .on socket event and this component will handle how the information received will be passed to the "Game" component if rendered.
 * @returns Conditionally, if the user is a validated player this renders the Game component, otherwise this renders an auth UI wehter to log in or to continue as annonymous user.
 */
const MultiplayerGame:React.FC<MultiplayerGameProps> = ({gameType}) => {
    const game_id:Ids = useParams().game_id as Ids

    const [multiplayerGameOver, setMultiPlayerGameOver] = useState(false)
    const [timeElapsed , setTimeElapsed] = useState(0)
    const [timerOn , setTimerOn] = useState(false)

    const role = useAppSelector((state:RootState) => state.role.value)
    
    const [socket , setSocket] = useState<Socket | undefined>(undefined)

    // In game functions
    const {handlePlayers, players, inList, setInList} = useGetPlayers({game_id})

     async function authSession ():Promise<any|undefined> {
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

    async function authenticatedUserContinue () {
        try {
            const auth = await authSession()
            if (socket && auth) socket?.emit('create-player' , auth.user_id, game_id)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(
        () => {
            const newSocket = io(variables.socket_url , {
                transports: ['websocket'],
                withCredentials: true
            })
            setSocket(newSocket)

            newSocket.on('connect_error' , (err) => {
                console.error('Socket error: ', err)
            })
            
            /**
             * Anytime the "VsGame" component it's rendered the user joins a room. This allows the backend to handle all kinds of user and player validations, needed to get access to the game data and the game itself.
             */
            newSocket.emit('join-room' , game_id)
            newSocket.on('message' , data => console.log(data))

            /**
             * This event is received anytime the players list is updated at the backend, it allows us to synchronize the players data since it also updates the "players" local state.
             */
            newSocket.on('updated-players' , data => {
                handlePlayers(undefined , data)
                console.log('socket/new players:' , data)
            })

            /**
             * This event is received anytime a player is created or enters the game. Keep in mind that in backend logic entering the room is different from entering the game. To enter the game a player table with corresponding user_id and game_id needs to be created. If a user enters the room but fails to enter the game then the player-info will not be sent.
             */
            newSocket.on('player-info' , data => {
              console.log('player-info:' , data)
              setInList(true)
            })
            
            /**
             * This event allows us to synchronize all the players timers when pausing and playing the game. Whenever a player pause the game the order is received at the back-end, where the main timer lies, after a play request the main time is sent to every player. This also applies when saving game stats such as time ocurred before successing or failing the game, we preffer the main timer located at the backend.
             */
            newSocket.on('game-timer' , data => {
                // timeElapsedRef.current = data
                setTimeElapsed(data)
            })
            /**
             * Only the host can continue or start a game. So, only him has the emit functionlity enabled. However, when he starts or continue the game the back-end emits the event to all the players of the game.
             */
            newSocket.on('play-game' , timerOn => {
              setTimerOn(timerOn)
            })
            /**
             * Anyone can pause the game, when doing it the back-end emits a pause-game event so every player gets his game paused.
             */
            newSocket.on('pause-game' , (data) => {
              setTimerOn(data)
            })
            
            newSocket.on('multiplayer-gameover' , (data) => {
                setMultiPlayerGameOver(data)
            })

            newSocket.on('game-alert' , data => {
              console.log(data)
            })

            return () => {newSocket.disconnect()}
        } , []
    )

    if (inList) {
        return (
          <Game gameType={gameType} setTimeElapsed={setTimeElapsed} setTimerOn={setTimerOn} timeElapsed={timeElapsed} timerOn={timerOn} players={players} inList={inList} socket={socket} multiplayerGameOver={multiplayerGameOver}/>
        )
    } else {
        return (
          <div className="vs-console">
                <div id="pre-room" className="window">
                    {role === 'anon' || role === null?
                        <MultiplayerLogin game_id={game_id} authSession={authSession} socket={socket}/>
                    :
                        <div className="pre-room-actions">
                            <button onClick={authenticatedUserContinue}>Aceptar invitación</button>
                        </div>
                    }
                </div>
            </div>
        )
    }
  }

export default MultiplayerGame
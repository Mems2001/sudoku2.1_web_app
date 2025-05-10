import { useCallback, useEffect, useRef, useState } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";
import variables from "../../../utils/variables";
import { Ids } from "../../app/types";
import { PlayerData } from "../../app/dbTypes";
import { io, Socket } from "socket.io-client";
import { RootState } from "../../app/store";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Game from "./Game";
import { setRole } from "../../features/role.slice";

/**
 * This component is in charge of socket handling for multiplayer games. That includes timer functions, players data, play or pause functions, and specially the player validation functions needed to access a game. We'll find here any .on socket event and this component wil handle how the information received will be passed to the "Game" component if rendered.
 * @returns Conditionally, if the user is a validated player this renders the Game component, otherwise this renders an auth UI wehter to log in or to continue as annonymous user.
 */
function VsGame () {
    const game_id:Ids = useParams().game_id as Ids
    const dispatch = useAppDispatch()

    // const timeElapsedRef = useRef(0)
    const [timeElapsed , setTimeElapsed] = useState(0)
    const [timerOn , setTimerOn] = useState(false)

    const role = useAppSelector((state:RootState) => state.role.value)
    const [players , setPlayers] = useState<PlayerData[]>([])
    const handlePlayers = useCallback ((data?: PlayerData , dataA?: PlayerData[]) => {
        // console.log('players data:', data, dataA)
        try {
            if (data) { // When data is an object then it pushes the object to the previous array
                setPlayers(prevPlayers => [...prevPlayers , data])
            } else { //If data is an array its values subtitue the previous array
                setPlayers(() => dataA? [...dataA] : [])
            }
        } catch (error) {
            console.error(error)
        }
    } , [])
    const [inList , setInList] = useState<boolean>(false)
    const [socket , setSocket] = useState<Socket | undefined>(undefined)

    //Room functions
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

    // In game functions (correct get players function)

    /**
     * This function gets called two times. Once the "VsGame" component is rendered and it gets the list of players signed to the game, and then again when the list is set as a local state it verifies if the current user is a player of the game and update the "inList" state according to the case. This is crutial because the soduku game will be accesible only to those users who are verified players of the game.
     * @param players - An array, the list of players of the game
     */
    function getPlayers (players:PlayerData[]) {
        try {
            if (players.length === 0) {
                const URL = variables.url_prefix + `/api/v1/players/multi/${game_id}`
                axios.get(URL).then(res => {
                    console.log( 'players list:', res.data)
                    handlePlayers(undefined , res.data)
                })
            } else {
                console.log('current players:', players)
                const URL = variables.url_prefix + `/api/v1/players/in_list/${game_id}`
                axios.get(URL).then(res => {
                    console.log('player on list:', res)
                    if (res.status === 200) {
                        setInList(true)
                        console.log('the player is on the list')
                    } else {
                        setInList(false)
                        console.log('the player is not on the list')
                    }
                })
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect (
      () => {
          getPlayers(players)
          console.log('Is the player in list?' ,players , inList)
        }, [players , inList]
    )

    useEffect(() => {
        console.log('timer useEffect')
      if (timerOn) {
        console.log('timer is on')
        const timer = setInterval(() => {
          setTimeElapsed((time) => time + 1);
        }, 1000);
    
        return () => clearInterval(timer); // Cleanup on unmount or when `timerOn` changes
      }
    }, [timerOn]);

    useEffect(() => {
        console.log('time elapsed useEffect:' , timeElapsed)
        // timeElapsedRef.current = timeElapsed; // Update the ref whenever timeElapsed changes
  }, [timeElapsed]);

    useEffect(
        () => {
            const newSocket = io(variables.socket_url , {
                transports: ['websocket'],
                withCredentials: true
            })
            setSocket(newSocket)

            /**
             * Anytime the "VsGame" component it's rendered the user joins a room. This allows the backend to handle all kinds of user and player validations, needed to get access to the game data and the game itself.
             */
            newSocket.emit('join-room' , game_id)
            newSocket.on('message' , data => console.log(data))

            newSocket.on('connect_error' , (err) => {
                console.error('Socket error: ', err)
            })

            /**
             * This event is received anytime the players list is updated at the backend, it allows us to synchronize the players data since it also updates the "players" local state.
             */
            newSocket.on('updated-players' , data => {
                console.log('socket/new players:' , data)
                handlePlayers(undefined , data)
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
            newSocket.on('game-alert' , data => {
              console.log(data)
            })

            return () => {newSocket.disconnect()}
        } , []
    )

    if (inList) {
        return (
          <Game gameType={1} setTimeElapsed={setTimeElapsed} setTimerOn={setTimerOn} timeElapsed={timeElapsed} timerOn={timerOn} players={players} inList={inList} socket={socket}/>
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

export default VsGame
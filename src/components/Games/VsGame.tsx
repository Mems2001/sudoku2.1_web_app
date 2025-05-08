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
import { roleSlice, setRole } from "../../features/role.slice";

function VsGame () {
    const game_id:Ids = useParams().game_id as Ids
    const dispatch = useAppDispatch()

    const timeElapsedRef = useRef(0)
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
    const [playerId , setPlayerId] = useState<Ids>()
    const [host , setHost] = useState(false)
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

    async function continueAsAnon () {
            try {
                const auth:any = await authSession()
                if (auth) {
                    if (socket) socket.emit('create-player' , auth.user_id , game_id)
                    if (setInList) setInList(true)
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
      if (timerOn) {
        const timer = setInterval(() => {
          setTimeElapsed((time) => time + 1);
        }, 1000);
    
        return () => clearInterval(timer); // Cleanup on unmount or when `timerOn` changes
      }
    }, [timerOn]);

    useEffect(() => {
      timeElapsedRef.current = timeElapsed; // Update the ref whenever timeElapsed changes
  }, [timeElapsed]);

    useEffect(
        () => {
            const newSocket = io(variables.socket_url , {
                transports: ['websocket'],
                withCredentials: true
            })
            setSocket(newSocket)

            newSocket.emit('join-room' , game_id)
            newSocket.on('message' , data => console.log(data))

            newSocket.on('connect_error' , (err) => {
                console.error('Socket error: ', err)
            })

            newSocket.on('updated-players' , data => {
                console.log('socket/new players:' , data)
                handlePlayers(undefined , data)
            })

            newSocket.on('player-info' , data => {
              console.log('player-info:' , data)
              setInList(true)
              setPlayerId(data.player_id)
              setHost(data.isHost)
            })
            
            newSocket.on('game-timer' , data => {
              setTimeElapsed(data)
            })
            newSocket.on('play-game' , timerOn => {
              setTimerOn(timerOn)
            })
            newSocket.on('pause-game' , (data) => {
              setTimerOn(data)
            })
            newSocket.on('game-alert' , data => {
              console.log(data)
            })

            return () => {newSocket.disconnect()}
        } , []
    )

    // if (inList) {
    //     return (
    //       <Game gameType={1} setTimeElapsed={setTimeElapsed} setTimerOn={setTimerOn} timeElapsed={timeElapsed} timerOn={timerOn} players={players} inList={inList}/>
    //     )
    // } else {
    //     return (
    //       <div className="vs-console">
    //             <div id="pre-room" className="window">
    //                 {role === 'anon' || role === null?
    //                     <div className="pre-room-actions">
    //                         <button>Iniciar Sesión</button>
    //                         <button onClick={continueAsAnon}>Continuar como anónimo</button>
    //                     </div>
    //                 :
    //                     <div className="pre-room-actions">
    //                         <button>Aceptar invitación</button>
    //                     </div>
    //                 }
    //             </div>
    //         </div>
    //     )
    // }
        return (
            <>
        {inList?
          <Game gameType={1} setTimeElapsed={setTimeElapsed} setTimerOn={setTimerOn} timeElapsed={timeElapsed} timerOn={timerOn} players={players} inList={inList}/>
          :
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
        }
            </>
    )
  }

export default VsGame
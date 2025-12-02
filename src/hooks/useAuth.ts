import { useEffect } from "react"

import { AxiosResponse } from "axios"
import { useAppDispatch, useAppSelector } from "../models/hooks"
import { RootState } from "../store/store"
import { setRole } from "../store/role.slice"
import { setLoggedIn, setLoggedOut } from "../store/isLogged.slice"
import { setGameSettings } from "../store/gameSettings.slice"
import { Ids, LoginForm } from "../models/types"
import { Socket } from "socket.io-client"
import { useNavigate } from "react-router-dom"

import AuthServices from "../services/AuthServices"
import { UsersServices } from "../services/UsersServices"
import { useToaster } from "./useToaster"
import { AuthenticationError, LoginError, LogoutError, UsersServicesError } from "../models/errors"
import { AuthenticationResponse } from "../models/dbTypes"

interface HandleLoginProps {
  data: LoginForm, 
  game_id?:Ids, 
  socket?: Socket
}

interface UseAuthReturn {
  role: string|null,
  isLogged: boolean,
  handleRegistration(data:LoginForm): void,
  handleLogin({data, game_id, socket}:HandleLoginProps):void,
  logout():void
}

/**
 * This hook is in charge to verify if the user is logged in on the app init or when the role state changes and updates login information such as game settings.
 */
export const useAuth = ():UseAuthReturn => {
    const isLogged = useAppSelector((state:RootState) => state.isLogged.value)
    const role = useAppSelector((state:RootState) => state.role.value)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { openToaster } = useToaster()

    function anonUserControl() {
      UsersServices.postAnon()
          .then(res => {
            // console.log('Anon user "logged in"' , res.status)
            dispatch(setRole(res.data.role))
            openToaster(res.data.message, "regular")
          })
          .catch((error:UsersServicesError) => {
            console.error(error)
          })
    }

    function authenticateSession() {
      AuthServices.getAuthenticateSession()
        .then((response:AxiosResponse<AuthenticationResponse>) => {
          // console.log(response)
          if (response && response.status == 200) {
              dispatch(setRole(response.data.role))
              //Only updates the loggged in state to true if the user is not an anon, to protect non anon user features.
              if (response.data.role && response.data.role != 'anon') {
                dispatch(setLoggedIn())
                dispatch(setGameSettings(response.data.settings))
              }
              else {
                dispatch(setLoggedOut())
              }
              return true
            }
          return false
        })
        .catch((error:UsersServicesError) => {
            console.error(error)
            //Creates an anon user and and a session.
            dispatch(setLoggedOut())
            anonUserControl()
            return false
          })
    }

    function handleRegistration(data:LoginForm) {
      UsersServices.register(data)
        .then(() => { 
            console.log('User registered')
            dispatch(setLoggedOut())
            dispatch(setRole(null))
            localStorage.removeItem('anon-sudoku')
            navigate('/login')
        })
        .catch((error:UsersServicesError) => {
            console.error(error)
        }) 
    }

    /**
     * Handles the whole login process, making the api call and updating global states related, finally, redirects to home if successful. 
     * @param {LoginForm} data 
     * @param {Ids} game_id
     * @param {Socket} socket
     */
    function handleLogin({data, game_id, socket}:HandleLoginProps) {
      AuthServices.login(data)
        .then(() => {
            // console.log(res.data.message , res.status)
            AuthServices.getAuthenticateSession()
              .then((response:AxiosResponse<AuthenticationResponse>) => {
                  // console.log(response.data.message , response.status)
                  if (response.status == 200) {
                      dispatch(setLoggedIn())
                      dispatch(setRole(response.data.role))
                      dispatch(setGameSettings(response.data.settings))
                      localStorage.removeItem('anon-sudoku')
                      if (game_id) socket?.emit('create-player', response.data.user_id, game_id)
                  } else {
                      dispatch(setLoggedOut())
                  }

                  if (!game_id) navigate('/')
                  openToaster(response.data.message, "regular")
              })
              .catch((error:AuthenticationError) => {
                  console.error(error)
                  dispatch(setLoggedOut())
                  openToaster(error.message, "error")
              })
        })
        .catch((error:LoginError) => {
          console.error(error)
          openToaster(error.message, "error")
        })
    }

    function logout():void {
         AuthServices.logout()
           .then((res:AxiosResponse<AuthenticationResponse>) => {
             dispatch(setLoggedOut())
             dispatch(setRole(null))
             dispatch(setGameSettings({cells_highlight: true, numbers_highlight: true, highlight_color: "blue", input_mode: 0}))
             openToaster(res.data.message, "regular")
           })
           .catch((error:LogoutError) => {
             console.error(error)
            openToaster(error.message, "error")
           })
      }

    useEffect(() => {
        if (!role) authenticateSession()
    }, [role])

    return {role, isLogged, handleRegistration, handleLogin, logout}
}
import variables from "../../utils/variables"
import { useEffect } from "react"

import axios, { AxiosResponse } from "axios"
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
import { AuthenticationResponse, LoginError, LoginErrorResponse } from "../models/errors"

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

    const api_prefix = "/api/v1/auth"


    function anonUserControl() {
    
        //It there is no role it means the user is not logged in. It runs the authenticate session service to automatically log in if theres is the correponding cookie. If not, class the anon creation service to provide an anon session. 
        if (!role) {
          const URL2 = variables.url_prefix + '/api/v1/users/anon'

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
                }
              })
            .catch((error:AuthenticationResponse) => {
                console.error('User authentication error:', error)
                //Creates an anon user and and a session.
                axios.get(URL2)
                    .then(res => {
                      console.log('Anon user "logged in"' , res.status)
                      dispatch(setRole('anon'))
                    })
                    .catch(error => {
                      console.error(error)
                    })
                dispatch(setLoggedOut())
              })
            
          }
    }

    function handleRegistration(data:LoginForm) {
      UsersServices.register(data)
        .then(() => { 
            console.log('User registered')
            dispatch(setLoggedOut())
            dispatch(setRole(null))
            navigate('/login')
        })
        .catch(err => {
            console.error('Error:', err)
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
                      if (game_id) socket?.emit('create-player', response.data.user_id, game_id)
                  } else {
                      dispatch(setLoggedOut())
                  }
                  if (!game_id) navigate('/')
                  openToaster(response.data.message, "regular")
              })
              .catch((error:LoginErrorResponse) => {
                  // console.error('Error:', error.message, error.type)
                  dispatch(setLoggedOut())
                  throw new LoginError(error.message)
              })
        })
        .catch((err:LoginErrorResponse) => {
          // console.log(err)
          openToaster(err.message, "error")
          throw new LoginError(err.message)
        })
    }

    function logout():void {
         const URL = variables.url_prefix + api_prefix + '/logout'
         axios.get(URL)
           .then(() => {
             dispatch(setLoggedOut())
             dispatch(setRole(null))
             console.log('user logged out')
           })
           .catch(error => {
             console.error('Error', error)
           })
      }

    useEffect(() => {
        if (!role) anonUserControl()
    }, [role])

    return {role, isLogged, handleRegistration, handleLogin, logout}
}
import Home from './components/Home/Home'
import { Route, Routes } from 'react-router-dom'

import './App.css'
import './styles/Home.css'
import './styles/Login.css'
import './styles/Puzzle.css'

import Login from './components/UserAuth/Login'
import Register from './components/UserAuth/Register'
import GameModes from './components/Games/GameModes'

import variables from '../utils/variables'
import axios from 'axios'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { RootState } from './app/store'
import { setRole } from './features/role.slice'
import { setLoggedIn, setLoggedOut } from './features/isLogged.slice'
import { setGameSettings } from './features/gameSettings.slice'
axios.defaults.withCredentials = true


function App () {
  const role = useAppSelector((state:RootState) => state.role.value)
  const dispatch = useAppDispatch()

  /**
   * This function will be called any time the whole app is rendered. It checks if there is a valid cookie for user authentication via get call. If not, the back-end deletes the cookie if there was one and proceeds to create an anon user. The anon user is a user of special kind, existing in the database but not upadting the glabal state "loggedIn" to true. But, is successful it sets global stats such as "loggedIn", "role" and "gameSettings".
   */
  function anonUserControl() {
      if (!role) {
          const URL = variables.url_prefix + '/api/v1/auth/authenticate_session'
          const URL2 = variables.url_prefix + '/api/v1/users/anon'
          axios.get(URL)
            .then((response) => {
              // console.log(response)
              console.log(response.data , response.status)
              if (response.status == 200) {
                dispatch(setRole(response.data.role))
                if (response.data.role && response.data.role != 'anon') {
                  dispatch(setLoggedIn())
                  dispatch(setGameSettings(response.data.settings))
                }
                else {
                  dispatch(setLoggedOut())
                }
              }
            })
            .catch((error) => {
              console.error('User authentication error:', error)
              axios.get(URL2)
                  .then(res => {
                    console.log('Anon user logged in' , res.status)
                    dispatch(setRole('anon'))
                  })
                  .catch(error => {
                    console.error(error)
                  })
              dispatch(setLoggedOut())
            })
          }
  }

  useEffect(
      () => {
          anonUserControl()
        } , [role]
      )

  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/game/:game_type/:game_id' element={<GameModes />} />
      </Routes>
    </div>
    
  )
}

export default App

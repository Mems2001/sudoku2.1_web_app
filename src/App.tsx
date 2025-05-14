import Home from './components/Home/Home'
import { Route, Routes } from 'react-router-dom'

import './App.css'
import './styles/Home.css'
import './styles/Login.css'
import './styles/Puzzle.css'

import Login from './components/UserAuth/Login'
import Register from './components/UserAuth/Register'
import VsGame from './components/Games/VsGame'
import SinglePlayer from '../src/components/Games/SinglePlayer'

import variables from '../utils/variables'
import axios from 'axios'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { RootState } from './app/store'
import { setRole } from './features/role.slice'
import { setLoggedIn, setLoggedOut } from './features/isLogged.slice'
axios.defaults.withCredentials = true


function App () {
  const role = useAppSelector((state:RootState) => state.role.value)
  const dispatch = useAppDispatch()

  /**
   * This function will be called any time the whole app is rendered. It checks if there is a valid cookie for user authentication via get call. If not, the back-end deletes the cookie if there was one and proceed to create an anon user. The anon user is a user of special kind, existing in the database but not upadting the glabal state "loggedIn" to true.
   */
  function anonUserControl() {
      if (!role) {
          const URL = variables.url_prefix + '/api/v1/auth/authenticate_session'
          const URL2 = variables.url_prefix + '/api/v1/users/anon'
          axios.get(URL)
            .then((response) => {
              console.log(response.data , response.status)
              if (response.status == 200) {
                dispatch(setRole(response.data.role))
                response.data.rol && response.data.role != 'anon'? dispatch(setLoggedIn()) : dispatch(setLoggedOut())
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
        <Route path='/game/:game_id' element={<SinglePlayer />} />
        <Route path='/game_vs/:game_id' element={<VsGame />} />
      </Routes>
    </div>
    
  )
}

export default App

import Home from './components/Home/Home'
import { Route, Routes } from 'react-router-dom'

import './App.css'
import './styles/Logo.css'
import './styles/Home.css'
import './styles/Login.css'
import './styles/Puzzle.css'
import './styles/GameModals.css'
import './styles/Toaster.css'
import './styles/Admin.css'
import './styles/SudokuLab.css'

import Login from './components/UserAuth/Login'
import Register from './components/UserAuth/Register'
import GameModes from './components/Games/GameModes'

import axios from 'axios'
import { useAuth } from './hooks/useAuth'
import Toaster from './components/Shared/Toaster'
import ProtectedRoute from './components/Shared/ProtectedRoute'
import AdminConsole from './components/Admin/AdminConsole'
import SudokuLab from './components/Admin/SudokuLab'
import { AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import { RootState } from './store/store'

axios.defaults.withCredentials = true


function App () {

  const showToaster = useSelector((state:RootState) => state.showToaster.value)
  const {isLogged, role, logout} = useAuth()

  return (
    <div className='App'>
      <AnimatePresence>
        {showToaster && (
          <Toaster key='toaster'/>
        )}
      </AnimatePresence>

      <Routes>
        <Route path='/' element={<Home isLogged={isLogged} role={role} logout={logout}/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/game/:game_type/:game_id' element={<GameModes />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/admin' element={<AdminConsole />}/>
          <Route path='/admin/lab' element={<SudokuLab />}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App

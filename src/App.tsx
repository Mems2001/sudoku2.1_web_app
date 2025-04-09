import Home from './components/Home/Home'
import { Route, Routes } from 'react-router-dom'

import './App.css'
import './styles/Home.css'
import './styles/Login.css'
import './styles/Puzzle.css'

import Login from './components/UserAuth/Login'
import Register from './components/UserAuth/Register'
import SoloGame from './components/Games/SoloGame'

import axios from 'axios'
import VsGame from './components/Games/VsGame'
axios.defaults.withCredentials = true


function App () {

  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/game/:game_id' element={<SoloGame />} />
        <Route path='/game_vs/:game_id' element={<VsGame />} />
      </Routes>
    </div>
    
  )
}

export default App

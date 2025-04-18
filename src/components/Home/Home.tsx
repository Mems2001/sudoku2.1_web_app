import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"

import variables from '../../../utils/variables'
import { GameData, PuzzleData } from "../../app/dbTypes"
import { PostGameBody } from "../../app/types"
import { AxiosResponse } from "axios"
import { setLoggedIn, setLoggedOut } from "../../features/isLogged.slice"
import { setRole } from "../../features/role.slice"
import { RootState } from "../../app/store"
import GamesModal from "../Games/GamesModal"
import { useEffect } from "react"

import axios from "axios"

function Home() {
    const isLogged = useAppSelector((state:RootState) => state.isLogged.value)
    const role = useAppSelector((state:RootState) => state.role.value)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

     async function goToPuzzle () {
        const URL = variables.url_prefix + '/api/v1/puzzles/get_random'
        const URL2 = variables.url_prefix  + '/api/v1/games'
        try {
          const puzzle:AxiosResponse<PuzzleData> = await axios.get(URL)
          // console.log(puzzle)
          
          const body:PostGameBody = {
            puzzle_id: puzzle.data.id,
            sudoku_id: puzzle.data.sudoku_id
          }
          const game:AxiosResponse<GameData> = await axios.post(URL2 , body)
          // console.log(game)
          closeModal()
          navigate(`/game/${game.data.id}`)
        } catch (error) {
          console.error(error)
        }
      }

        function logout() {
           const URL = variables.url_prefix + '/api/v1/auth/logout'
           axios.get(URL)
             .then(() => {
               dispatch(setLoggedOut())
               dispatch(setRole(null))
             })
             .catch(error => {
               console.error('Error', error)
             })
        }

       // Games modal functions

      function openModal() {
        const modal = document.getElementsByClassName('games-modal')[0] as HTMLDivElement
        modal.classList.remove('inactive')
      }
      function closeModal() {
        const modal = document.getElementsByClassName('games-modal')[0] as HTMLDivElement
        modal.classList.add('inactive')
      }
    
    useEffect(
      () => {
        if (!role) {
                const URL = variables.url_prefix + '/api/v1/auth/authenticate_session'
                const URL2 = variables.url_prefix + '/api/v1/users/anon'
                axios.get(URL)
                  .then((response) => {
                    console.log(response.data , response.status)
                    if (response.status == 200) {
                      dispatch(setRole(response.data.role))
                      response.data.role != 'anon'? dispatch(setLoggedIn()) : dispatch(setLoggedOut())
                    }
                  })
                  .catch((error) => {
                    console.error('Error:', error)
                    axios.get(URL2)
                        .then(res => {
                          console.log('Anon user:' , res.data)
                          dispatch(setRole('anon'))
                        })
                        .catch(error => {
                          console.error(error)
                        })
                    dispatch(setLoggedOut())
                  })
              }
            } , [role]
    )
    
    return (
       <div className="home">
        <section className="background">
            <h1 className="game-title">5UD0KU</h1>
            <h1 className="game-version">2.1</h1>

            <div className="home-buttons">
                <button className="home-button" onClick={openModal}>PLAY</button>
                {isLogged ?
                    <button className="home-button" id="logout-btn" onClick={logout}>LOGOUT</button>
                    :
                    <button className="home-button" onClick={() => navigate('/login')}>SIGNIN</button>
                }
                {isLogged ? 
                    <></>
                    :
                    <button className="home-button" onClick={() => navigate('/register')}>SIGNUP</button>
                }
                {role == 'admin' ?
                    <button id='admin-btn' className="home-button" onClick={() => navigate('/admin')}>ADMIN</button>
                    :
                    <></>
                }
            </div>

            <div className="background-h">
                <div className="line-h"></div>
                <div className="line-h"></div>
                <div className="line-h"></div>
                <div className="line-h"></div>
                <div className="line-h"></div>
                <div className="line-h"></div>
                <div className="line-h"></div>
                <div className="line-h"></div>
            </div>
            <div className="background-v">
                <div className="line-v"></div>
                <div className="line-v"></div>
                <div className="line-v"></div>
                <div className="line-v"></div>
                <div className="line-v"></div>
                <div className="line-v"></div>
                <div className="line-v"></div>
                <div className="line-v"></div>
            </div>

        </section>

        <GamesModal goToPuzzle={goToPuzzle} closeModal={closeModal}/>
       </div>
    )
}

export default Home
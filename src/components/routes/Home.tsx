import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"

import variables from '../../../utils/variables'
import axios from "axios"
import { PostGameBody , PuzzleData } from "../../app/types"
import { AxiosResponse } from "axios"

function Home() {
    const isLogged = useAppSelector(state => state.isLogged.value)
    const role = useAppSelector(state => state.role.value)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

     async function goToPuzzle () {
        const URL = variables.url_prefix + '/api/v1/puzzles/get_random'
        const URL2 = variables.url_prefix  + '/api/v1/games'
        try {
          const puzzle:AxiosResponse<PuzzleData> = await axios.get(URL).catch((error) => {console.error('Error:', error);})
          // console.log(puzzle)
          
          const body:PostGameBody = {
            puzzle_id: puzzle.data.id,
            sudoku_id: puzzle.data.sudoku_id
          }
          const game = await axios.post(URL2 , body).catch(error => {console.error(error)})
          // console.log(game)
          closeModal()
          navigate(`/game/${game.data.id}`)
        } catch (error) {
          console.error(error)
        }
      }

    return (
       <div className="home">
        <section className="background">
            <h1 className="game-title">5UD0KU</h1>
            <h1 className="game-version">2.1</h1>

            <div className="home-buttons">
                {/* <button className="home-button" onClick={openModal}>PLAY</button>
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
                } */}
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
       </div>
    )
}

export default Home
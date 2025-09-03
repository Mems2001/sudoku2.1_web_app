import GamesModal from "./GamesModal"

import { useAuth } from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"

function Home() {
    const {role, isLogged, logout} = useAuth()
    const navigate = useNavigate()
      // Games modal functions

      function openModal() {
        const modal = document.getElementsByClassName('games-modal')[0] as HTMLDivElement
        modal.classList.remove('inactive')
      }
      function closeModal() {
        const modal = document.getElementsByClassName('games-modal')[0] as HTMLDivElement
        modal.classList.add('inactive')
      }
    
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

        <GamesModal closeModal={closeModal}/>
       </div>
    )
}

export default Home
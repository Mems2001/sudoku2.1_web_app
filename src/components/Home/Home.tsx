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
            <div className="home-content">
                <div className="title-container">
                    <div className="logo">
                        <span className="logo-1"></span>
                        <span className="logo-2"></span>
                        <span className="logo-3"></span>
                        <span className="logo-4"></span>
                        <hr className="separator-v"></hr>
                        <hr className="separator-h"></hr>
                    </div>
                    <div className="title-texts">
                        <h1 className="game-title">Sudoku</h1>
                        <h1 className="game-version">2.1</h1>
                    </div>
                </div>

                <p className="home-text">Test your mind or challenge your friends with a logic puzzle</p>
    
                <div className="home-buttons">
                    <button type="button" className="home-button play" onClick={openModal}>Play</button>
                    {isLogged ?
                        <button type="button" className="home-button logout" id="logout-btn" onClick={logout}>Log out</button>
                        :
                        <button type="button" className="home-button signin" onClick={() => navigate('/login')}>Sign in</button>
                    }
                    {isLogged ? 
                        <></>
                        :
                        <button className="home-button signup" onClick={() => navigate('/register')}>Sign up</button>
                    }
                    {role == 'admin' ?
                        <button id='admin-btn' className="home-button" onClick={() => navigate('/admin')}>ADMIN</button>
                        :
                        <></>
                    }
                </div>
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
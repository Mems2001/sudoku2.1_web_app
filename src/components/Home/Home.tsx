import GamesModal from "./GamesModal"

import { useNavigate } from "react-router-dom"
import Logo from "../Shared/Logo"
import React from "react"

interface HomeProps {
    role: string | null,
    isLogged: boolean,
    logout(): void
}

const Home:React.FC<HomeProps> = ({isLogged, role, logout}:HomeProps) => {
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
                    <Logo />
                    <div className="title-texts">
                        <h1 className="game-title">Sudoku</h1>
                        <h1 className="game-version">2.1</h1>
                    </div>
                </div>

                <p className="home-text">Test your mind or challenge your friends with a logic puzzle</p>
    
                <div className="home-buttons">
                    {isLogged && (
                        <button type="button" className="home-button user" onClick={() => navigate('/my-profile')}>
                            <i className="fa-solid fa-user-tie fa-lg"></i>
                        </button>
                    )}
                    <button type="button" className="home-button play" onClick={openModal}>Play</button>
                    {isLogged ?
                        <button type="button" className="home-button logout" id="logout-btn" onClick={logout}>Log out</button>
                        :
                        <button type="button" className="home-button signin" onClick={() => navigate('/login')}>Sign in</button>
                    }
                    {isLogged ? 
                        <></>
                        :
                        <button type="button" className="home-button signup" onClick={() => navigate('/register')}>Sign up</button>
                    }
                    {role == 'admin' ?
                        <button type="button" className="home-button admin" onClick={() => navigate('/admin')}>ADMIN</button>
                        :
                        <></>
                    }
                </div>

                {role === 'anon' && (
                    <p className='home-user-warning'>*Playing as an anonymous user</p>
                )}
                {!role && (
                    <p className='home-user-warning'>*Something went wrong, please reload the page</p>
                )}
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
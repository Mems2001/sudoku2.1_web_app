import GamesModal from "./GamesModal"

import { useNavigate } from "react-router-dom"
import Logo from "../Shared/Logo"
import React, { useRef, useState } from "react"
import GameSettings from "../Games/GameSettings"
import { AnimatePresence } from "framer-motion"

interface HomeProps {
    role: string | null,
    isLogged: boolean,
    logout(): void
}

const Home:React.FC<HomeProps> = ({isLogged, role, logout}:HomeProps) => {
    const navigate = useNavigate()
    // We need this ref to handle focus inside the modal
    const gamesModalRef = useRef<HTMLDivElement>(null)
    const playButtonRef = useRef<HTMLButtonElement>(null)
    const [openSettings, setOpenSettings] = useState(false)
    const [openGamesModal, setOpenGamesModal] = useState(false)

    // Games modal functions

    function openModal() {
      setOpenGamesModal(true)
      setTimeout(() => {
         gamesModalRef.current?.querySelector('button')?.focus()
      }, 0)
    }
    
    function closeModal() {
      setOpenGamesModal(false)
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
                        <button type="button" className="home-button user" onClick={() => navigate('/my-profile')} aria-label="Go to my profile">
                            <i className="fa-solid fa-user-tie fa-lg" aria-hidden='true'></i>
                        </button>
                    )}
                    <button type="button" ref={playButtonRef} className="home-button play" onClick={openModal}>Play</button>
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
                    <button className="home-button play" type="button" aria-label="Open settings" onClick={() => {setOpenSettings(prev => !prev)}}>Settings</button>
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

            <div className="background-h" aria-hidden="true">
                <div className="line-h"></div>
                <div className="line-h"></div>
                <div className="line-h"></div>
                <div className="line-h"></div>
                <div className="line-h"></div>
                <div className="line-h"></div>
                <div className="line-h"></div>
                <div className="line-h"></div>
            </div>
            <div className="background-v" aria-hidden="true">
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

        <AnimatePresence>
            {openGamesModal && (
                <GamesModal closeModal={closeModal} isModalOpen={openGamesModal} ref={gamesModalRef}/>
            )}
        </AnimatePresence>

        <AnimatePresence>
            {openSettings && 
                (<GameSettings key='home_settings' homeCloseButton={() => setOpenSettings(false)}/>)
            }
        </AnimatePresence>
       </div>
    )
}

export default Home
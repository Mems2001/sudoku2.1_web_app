import { useState, forwardRef, useEffect, Ref, RefObject, useRef } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { PlayerData } from "../../models/dbTypes"
import { Ids } from "../../models/types"
import { AxiosError, AxiosResponse } from "axios"
import { useGoToGame } from "../../hooks/useGoToGame"
import { GamesServices } from "../../services/GamesServices"
import { GameType } from "../../models/game"
import { GamesServicesError } from "../../models/errors"
import { GameModalProps } from "../../assets/animations"

interface Props {
    closeModal: () => void,
    isModalOpen: boolean
}

const GamesModal = forwardRef<HTMLDivElement, Props> (({closeModal, isModalOpen}, ref) => {

    // Announcements for screen readers
    const [announcement, setAnnouncement] = useState<string>("")

    const [showSaved , setShowSaved] = useState(false)
    const [showNewGame , setShowNewGame] = useState(false)
    const [showDifficulties, setShowDifficulties] = useState(false)
    const [gameType, setGameType] = useState<GameType|null>(null)
    const [saved , setSaved] = useState<PlayerData[]>()
    const {goToGame} = useGoToGame()
    const navigate = useNavigate()

    //Esc key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Check if modal is open before proceeding
            if (!isModalOpen) return

            if (e.key === "Escape") {
                e.preventDefault()
                setShowSaved(false)
                setShowNewGame(false)
                setShowDifficulties(false)
                setGameType(null)
                closeModal()
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [])

    /**
     * Returns the name of the game type according to it.
     * @returns {string}
     */
    function handleGameTypeName(gameType:number):string|undefined {
        switch (gameType) {
            case 0:
                return 'Single player'
            case 1:
                return 'Vs time attack'
            case 2:
                return 'Cooperative'
        }
    }

    function handleDifficultyName(difficulty:number):string|undefined {
        switch (difficulty) {
            case 0:
                return 'Novice'
            case 1:
                return 'Easy'
            case 2: 
                return 'Normal'
            case 3: 
                return 'Hard'
            case 4:
                return 'Expert'
            case 5:
                return 'Master'
        }
    }

    function goToSavedGames() {
        try {
            getMySavedGames()
            setShowSaved(true)
        } catch (error) {
            console.error(error)
            throw new Error("Couldn't get your saved games")
        }
    }

    function goToSavedGame(game_id:Ids , gameType:number) {
        navigate(`/game/${gameType}/${game_id}`)
    }

    function getMySavedGames() {
        GamesServices.getSavedGames()
            .then((res:AxiosResponse) => {
                setSaved(res.data)
            })
            .catch((err:AxiosError) => {
                throw new GamesServicesError(err.message)
            })
           
    }

    function deleteSavedGame(player_id:Ids){
        GamesServices.deleteGame(player_id)
            .then(() => {
                getMySavedGames()
            })
            .catch((err:AxiosError) => {
                throw new GamesServicesError(err.message)
            })
    }

    return (
        <motion.div 
            {...GameModalProps}
            ref={ref} 
            className="games-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            
            {/* Hidden title for screen readers */}
            <h2 id="modal-title" className="sr-only">Game Selection Menu</h2>

            {/* Live region for announcements */}
            <div 
                role="status" 
                aria-live="polite" 
                aria-atomic="true" 
                className="sr-only"
            >
                {announcement}
            </div>

            {!showSaved && !showNewGame && !showDifficulties && (
                <div id="games" className="modal-window">
                    <button className="home-button modal-button" onClick={() => {setShowNewGame(true); setAnnouncement("Game type selection menu opened")}}>New Game</button>
                    <button className="home-button modal-button" onClick={() => {goToSavedGames(); setAnnouncement("Loading saved games")}}>Saved Games</button>
                </div>
                )
            }
            {showSaved && (
                <div className="modal-window" id="saved-games">
                    {saved?.map(game => 
                        (<div className="saved-game-buttons" key={game.Game.id}>
                            <button type="button" onClick={() => goToSavedGame(game.Game.id , game.Game.type)} className="saved-game home-button modal-button">{handleGameTypeName(game.Game.type)} {saved.indexOf(game)+1} {handleDifficultyName(game.Game.Puzzle.difficulty)}</button>
                            <button type="button" className="delete" onClick={() => deleteSavedGame(game.id)} aria-label={`Delete ${handleGameTypeName(game.Game.type)} game number ${saved.indexOf(game) + 1}`}>
                                <i className="fa-solid fa-trash fa-lg" aria-hidden="true"></i>
                            </button>
                        </div>)
                    )}
                    <button className="saved-game home-button modal-button" onClick={() => {setShowSaved(false); setAnnouncement("Back to main menu")}}>Back</button>
                </div>
                )
            }
            {showNewGame && (
                <div className="modal-window" id="new-game">
                    <button className="home-button modal-button" onClick={() => {setShowDifficulties(true);setShowNewGame(false);setGameType(0); setAnnouncement("Single player difficulty selection")}}>Single Player</button>
                    <button className="home-button modal-button" onClick={() => {setShowDifficulties(true);setShowNewGame(false);setGameType(1); setAnnouncement("Multiplayer time attack difficulty selection")}}>Multiplayer Time Attack</button>
                    <button className="home-button modal-button" onClick={() => {setShowDifficulties(true);setShowNewGame(false);setGameType(2); setAnnouncement("Multiplayer cooperative difficulty selection")}}>Multiplayer Cooperative</button>
                    <button className="home-button modal-button" onClick={() => {setShowNewGame(false); setAnnouncement("Back to main menu")}}>Back</button>
                </div>
                )
            }
            {showDifficulties && gameType !== null && (
                <div className="modal-window" id="new-game">
                    <button className="home-button modal-button signup" onClick={() => goToGame({gameType, difficulty:0, closeModal})}>Novice</button>
                    <button className="home-button modal-button signup" onClick={() => goToGame({gameType, difficulty:1, closeModal})}>Easy</button>
                    <button className="home-button modal-button signin" onClick={() => goToGame({gameType, difficulty:2, closeModal})}>Normal</button>
                    <button className="home-button modal-button signin" onClick={() => goToGame({gameType, difficulty:3, closeModal})}>Hard</button>
                    <button className="home-button modal-button logout" onClick={() => goToGame({gameType, difficulty:4, closeModal})}>Expert</button>
                    <button className="home-button modal-button master-difficulty" onClick={() => goToGame({gameType, difficulty:5, closeModal})}>Master</button>
                    <button className="home-button modal-button" onClick={() => {setShowDifficulties(false);setGameType(null); setAnnouncement("Back to game type selection")}}>Back</button>
                </div>
            )}

            <div
                onClick={() => {closeModal();setShowSaved(false);setShowNewGame(false);setShowDifficulties(false);setGameType(null)}} className="modal-auxiliar">
            </div>
        </motion.div>
    )
})

GamesModal.displayName = 'GamesModal'

export default GamesModal
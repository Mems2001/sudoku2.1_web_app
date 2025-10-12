import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { PlayerData } from "../../models/dbTypes"
import { Ids } from "../../models/types"
import { AxiosError, AxiosResponse } from "axios"
import { useGoToGame } from "../../hooks/useGoToGame"
import { GamesServices } from "../../services/GamesServices"
import { GameType } from "../../models/game"
import { GamesServicesError } from "../../models/errors"

interface Props {
    closeModal: () => void
}

const GamesModal: React.FC<Props> = ({closeModal}) => {

    const [showSaved , setShowSaved] = useState(false)
    const [showNewGame , setShowNewGame] = useState(false)
    const [showDifficulties, setShowDifficulties] = useState(false)
    const [gameType, setGameType] = useState<GameType|null>(null)
    const [saved , setSaved] = useState<PlayerData[]>()
    const {goToGame} = useGoToGame()
    const navigate = useNavigate()

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
        <div className="games-modal inactive">
            {!showSaved && !showNewGame && !showDifficulties && (
                <div id="games" className="modal-window">
                    <button className="home-button modal-button" onClick={() => setShowNewGame(true)}>New Game</button>
                    <button className="home-button modal-button" onClick={goToSavedGames}>Saved Games</button>
                </div>
                )
            }
            {showSaved && (
                <div className="modal-window" id="saved-games">
                    {saved?.map(game => 
                        (<div className="saved-game-buttons">
                            <button type="button" key={game.Game.id} onClick={() => goToSavedGame(game.Game.id , game.Game.type)} className="saved-game home-button modal-button">{handleGameTypeName(game.Game.type)} {saved.indexOf(game)+1} {handleDifficultyName(game.Game.Puzzle.difficulty)}</button>
                            <button type="button" className="delete" onClick={() => deleteSavedGame(game.id)}>
                                <i className="fa-solid fa-trash fa-lg"></i>
                            </button>
                        </div>)
                    )}
                    <button className="saved-game home-button modal-button" onClick={() => setShowSaved(false)}>Back</button>
                </div>
                )
            }
            {showNewGame && (
                <div className="modal-window" id="new-game">
                    <button className="home-button modal-button" onClick={() => {setShowDifficulties(true);setShowNewGame(false);setGameType(0)}}>Single Player</button>
                    <button className="home-button modal-button" onClick={() => {setShowDifficulties(true);setShowNewGame(false);setGameType(1)}}>Multiplayer Time Attack</button>
                    <button className="home-button modal-button" onClick={() => {setShowDifficulties(true);setShowNewGame(false);setGameType(2)}}>Multiplayer Cooperative</button>
                    <button className="home-button modal-button" onClick={() => setShowNewGame(false)}>Back</button>
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
                    <button className="home-button modal-button" onClick={() => {setShowDifficulties(false);setGameType(null)}}>Back</button>
                </div>
            )}
            <div onClick={() => {closeModal();setShowSaved(false);setShowNewGame(false);setShowDifficulties(false);setGameType(null)}} className="modal-auxiliar">

            </div>
        </div>
    )
}

export default GamesModal
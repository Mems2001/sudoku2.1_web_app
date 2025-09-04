import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { PlayerData } from "../../models/dbTypes"
import { Ids } from "../../models/types"
import { AxiosError, AxiosResponse } from "axios"
import { useGoToGame } from "../../hooks/useGoToGame"
import { GamesServices } from "../../services/GamesServices"

interface Props {
    closeModal: () => void
}

const GamesModal: React.FC<Props> = ({closeModal}) => {

    const [showSaved , setShowSaved] = useState(false)
    const [showNewGame , setShowNewGame] = useState(false)
    const [saved , setSaved] = useState<PlayerData[]>()
    const {goToGame} = useGoToGame()
    const navigate = useNavigate()

    /**
     * Returns the name of the game type according to it.
     * @returns {string}
     */
    function handleGameTypeName(gameType:number) {
        switch (gameType) {
            case 0:
                return 'Single player'
            case 1:
                return 'Vs time attack'
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
                console.error({message: err.message, err})
            })
           
    }

    return (
        <div className="games-modal inactive">
            {!showSaved && !showNewGame ?
                <div id="games" className="modal-window">
                    <button className="home-button modal-button" onClick={() => setShowNewGame(true)}>New Game</button>
                    <button className="home-button modal-button" onClick={goToSavedGames}>Saved Games</button>
                </div>
                :
                <></>
            }
            {showSaved?
                <div className="modal-window" id="saved-games">
                    {saved?.map(game => <button key={game.Game.id} onClick={() => goToSavedGame(game.Game.id , game.Game.type)} className="saved-game home-button modal-button">{handleGameTypeName(game.Game.type)} {saved.indexOf(game)+1}</button>)}
                    <button className="saved-game home-button modal-button" onClick={() => setShowSaved(false)}>Back</button>
                </div>
                :
                <></>
            }
            {showNewGame?
                <div className="modal-window" id="new-game">
                    <button className="home-button modal-button" onClick={() => goToGame({gameType: 0, closeModal})}>Single Player</button>
                    <button className="home-button modal-button" onClick={() => goToGame({gameType:1, closeModal})}>Multiplayer Time Attack</button>
                    <button className="home-button modal-button" onClick={() => goToGame({gameType:2, closeModal})}>Multiplayer Cooperative</button>
                    <button className="home-button modal-button" onClick={() => setShowNewGame(false)}>Back</button>
                </div>
                :
                <></>
            }
            <div onClick={() => {closeModal();setShowSaved(false)}} className="modal-auxiliar">

            </div>
        </div>
    )
}

export default GamesModal
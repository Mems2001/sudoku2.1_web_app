import { useState } from "react"
import { useNavigate } from "react-router-dom"
import variables from "../../../utils/variables"
import { PlayerData } from "../../app/dbTypes"
import { Ids } from "../../app/types"
import axios from "axios"

interface Props {
    goToGame: () => void,
    goToVs: () => void,
    closeModal: () => void
}

const GamesModal: React.FC<Props> = ({goToGame , closeModal , goToVs}) => {

    const [showSaved , setShowSaved] = useState(false)
    const [showNewGame , setShowNewGame] = useState(false)
    const [saved , setSaved] = useState<PlayerData[]>()
    const navigate = useNavigate()

    function handleGameType(gameType:number) {
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
        } catch (error) {
            console.error(error)
        }
        setShowSaved(true)
    }

    function goToSavedGame(game_id:Ids , gameType:number) {
        if (gameType === 0) navigate(`/game/${game_id}`)
        else navigate(`/game_vs/${game_id}`)
    }

    function getMySavedGames() {
        const URL = variables.url_prefix + '/api/v1/games/saved'
        axios.get(URL)
            .then(res => {
                setSaved(res.data)
            })
            .catch(err => {console.error(err)})
    }

    return (
        <div className="games-modal inactive">
            {!showSaved && !showNewGame ?
                <div id="games" className="modal-window">
                    <button onClick={() => setShowNewGame(true)}>New Game</button>
                    <button onClick={goToSavedGames}>Saved Games</button>
                </div>
                :
                <></>
            }
            {showSaved?
                <div className="modal-window" id="saved-games">
                    {saved?.map(game => <button key={game.Game.id} onClick={() => goToSavedGame(game.Game.id , game.Game.type)} className="saved-game">{handleGameType(game.Game.type)} {saved.indexOf(game)+1}</button>)}
                    <button className="saved-game" onClick={() => setShowSaved(false)}>Back</button>
                </div>
                :
                <></>
            }
            {showNewGame?
                <div className="modal-window" id="new-game">
                    <button onClick={goToGame}>Single Player</button>
                    <button onClick={goToVs}>Multiplayer Time Attack</button>
                    <button onClick={() => setShowNewGame(false)}>Back</button>
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
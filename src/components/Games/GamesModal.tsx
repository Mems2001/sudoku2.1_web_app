import { useState } from "react"
import { useNavigate } from "react-router-dom"
import variables from "../../../utils/variables"
import { GameData } from "../../app/dbTypes"
import { Ids } from "../../app/types"
import axios from "axios"

interface Props {
    goToPuzzle: () => void
    closeModal: () => void
}

const GamesModal: React.FC<Props> = ({goToPuzzle , closeModal}) => {

    const [showSaved , setShowSaved] = useState(false)
    const [saved , setSaved] = useState<GameData[]>()
    const navigate = useNavigate()

    function goToSavedGames() {
        try {
            getMySavedGames()
        } catch (error) {
            console.error(error)
        }
        setShowSaved(true)
    }

    function goToSavedGame(game_id:Ids) {
        navigate(`/game/${game_id}`)
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
            {!showSaved ?
                <div id="games" className="modal-window">
                    <button onClick={goToPuzzle}>New Game</button>
                    <button onClick={goToSavedGames}>Saved Games</button>
                </div>
                :
                <div className="modal-window" id="saved-games">
                    {saved?.map(game => <button key={game.id} onClick={() => goToSavedGame(game.id)} className="saved-game">{saved.indexOf(game)+1}</button>)}
                    <button className="saved-game" onClick={() => setShowSaved(false)}>Back</button>
                </div>
            }
            <div onClick={() => {closeModal();setShowSaved(false)}} className="modal-auxiliar">

            </div>
        </div>
    )
}

export default GamesModal
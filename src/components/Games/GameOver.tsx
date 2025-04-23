import axios from "axios"
import { useNavigate } from "react-router-dom"
import variables from "../../../utils/variables"
import { Puzzle } from "../../app/dbTypes"

interface GameOverProps {
    game_id: string | undefined,
    puzzle: Puzzle | undefined
}

const GameOver:React.FC<GameOverProps> = ({game_id , puzzle}) => {
    const navigate = useNavigate()

    async function retry () {
        const URL = variables.url_prefix + `/api/v1/players/single/${game_id}`
        const URL2 = variables.url_prefix + `/api/v1/games/${game_id}`
        try {
            await axios.patch(URL , {grid: puzzle?.grid , number: puzzle?.number , errors:0})
            await axios.patch(URL2 , {time:0})
            window.location.reload()
        } catch (error) {
            console.error(error)
        }
    }

    async function surrender() {
        const URL = variables.url_prefix + `/api/v1/players/single/${game_id}`
        const URL2 = variables.url_prefix + `/api/v1/games/${game_id}`
        try {
            await axios.patch(URL , {status:2})
            await axios.patch(URL2 , {status:2})
            navigate('/')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <section className="game-over">
            <div className="window">
                <h1>Game Over</h1>
                <div className="go-btns">
                    <button onClick={retry} id="retry">Reintentar</button>
                    <button onClick={surrender} id="surrender">Salir</button>
                </div>
            </div>
        </section>
    )
}

export default GameOver
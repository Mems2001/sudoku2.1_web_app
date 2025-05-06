import axios from "axios"
import { useNavigate } from "react-router-dom"
import variables from "../../../utils/variables"

interface GameCompletedProps {
    game_id: string | undefined,
    time: number
}

const GameCompleted:React.FC<GameCompletedProps> = ({game_id , time}) => {
    const navigate = useNavigate()

    async function continueH () {
        const URL = variables.url_prefix + `/api/v1/games/${game_id}`
        const URL2 = variables.url_prefix + `/api/v1/players/single/${game_id}`
        try {
            await axios.patch(URL , {time , status:1})
            await axios.patch(URL2 , {status:1})
            navigate('/')
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <section className="completed">
            <div className="window">
                <h1>¡Felicitaciones!</h1>
                <button onClick={continueH}>Continuar</button>
            </div>
        </section>
    )
}

export default GameCompleted
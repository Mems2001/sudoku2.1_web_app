import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Socket } from "socket.io-client"

interface GameCompletedProps {
    game_type: number,
    pauseGame: () => void,
    socket?: Socket
}

const GameCompleted:React.FC<GameCompletedProps> = ({game_type, pauseGame, socket}) => {
    const navigate = useNavigate()

    useEffect(
        () => {
            pauseGame()
            //This event can be called only when the users are playing a time attack multiplayer game, gameType = 1.
            if (game_type === 1 && socket) socket.emit('multiplayer-gameover')
        } , []
    )

    return (
        <section className="completed">
            <div className="window">
                <h1>¡Congratulations!</h1>
                <button onClick={() => navigate('/')}>Continuar</button>
            </div>
        </section>
    )
}

export default GameCompleted
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

interface GameCompletedProps {
    setTimerOn: React.Dispatch<React.SetStateAction<boolean>>,
    saveGame: any
}

const GameCompleted:React.FC<GameCompletedProps> = ({setTimerOn, saveGame}) => {
    const navigate = useNavigate()

    useEffect(
        () => {
            console.log('game completed')
            saveGame()
            setTimerOn(false)
        } , []
    )

    return (
        <section className="completed">
            <div className="window">
                <h1>¡Felicitaciones!</h1>
                <button onClick={() => navigate('/')}>Continuar</button>
            </div>
        </section>
    )
}

export default GameCompleted
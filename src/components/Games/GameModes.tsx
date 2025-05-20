import { useParams } from "react-router-dom"
import SinglePlayer from "./SinglePlayer"
import MultiplayerGame from "./multiplayerGame"

function GameModes () {
    const gameType = useParams().game_type

    switch (gameType) {
        case '0':
            return (
                <SinglePlayer />
            )
        case '1': 
            return (
                <MultiplayerGame gameType={1}/>
            )
        case '2':
            return (
                <MultiplayerGame gameType={2}/>
            )
    }
}

export default GameModes
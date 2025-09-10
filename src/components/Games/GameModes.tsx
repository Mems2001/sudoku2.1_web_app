import { useParams } from "react-router-dom"
import SinglePlayer from "./SinglePlayer"
import MultiplayerGame from "./MultiplayerGame"

function GameModes () {
    const gameType = useParams().game_type

    switch (gameType) {
        case '0':
            return (
                <SinglePlayer />
            )
        case '1': 
            return (
                <MultiplayerGame/>
            )
        case '2':
            return (
                <MultiplayerGame/>
            )
    }
}

export default GameModes
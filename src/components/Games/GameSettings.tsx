import { useAppSelector } from "../../models/hooks";
import { RootState } from "../../store/store";
import { UsersServices } from "../../services";

interface GameSettingsProps {
    gameType: number,
    cellsHighlight: boolean,
    numbersHighlight: boolean,
    setGameSettings: (payload: { cells_highlight: boolean; numbers_highlight: boolean; }) => { payload: { cells_highlight: boolean; numbers_highlight: boolean; }},
    clearCellsHighlighting: () => void,
    clearNumbersHighlighting: () => void,
    selectCells: () => void,
    sameNumbers: () => void
}

const GameSettins:React.FC<GameSettingsProps> = ({gameType, cellsHighlight , numbersHighlight , setGameSettings , clearCellsHighlighting , clearNumbersHighlighting , selectCells , sameNumbers}) => {
    const isLogged = useAppSelector((state:RootState) => state.isLogged.value)

    async function saveGameSettings (cellsHighlight:boolean, numbersHighlight:boolean) {
        if (isLogged) {
            try {
                const newSettings = await UsersServices.updateGameSettings(cellsHighlight, numbersHighlight)
                return console.log('new_game_settings:' , newSettings.data)
            } catch (error) {
                return console.error(error)
            }
        }
    }

    function handleColorGuides (cellsHighlight:boolean) {
        saveGameSettings(!cellsHighlight, numbersHighlight)
        setGameSettings({cells_highlight:!cellsHighlight, numbers_highlight:numbersHighlight})
        if (cellsHighlight) {
            clearCellsHighlighting()
        } else {
            selectCells()
        }
    }
    function handleNumberGuides (numbersHighlight:boolean) {
        saveGameSettings(cellsHighlight, !numbersHighlight)
        setGameSettings({cells_highlight:cellsHighlight, numbers_highlight:!numbersHighlight})
        if (numbersHighlight) {
            clearNumbersHighlighting()
        } else {
            sameNumbers()
        }
    }
    
    if (gameType === 0) 
    {
        return (
            <div className="game-settings">
                <div className="settings-window">
                    <div className="game-setting">
                        <label htmlFor="rc-match">Cells highlighting</label>
                        <input type="checkbox" id="rc-match" defaultChecked={cellsHighlight} onChange={() => handleColorGuides(cellsHighlight)}/>
                    </div>
                    <div className="game-setting">
                        <label htmlFor="n-match">Numbers highlighting</label>
                        <input type="checkbox" id="n-match" defaultChecked={numbersHighlight} onChange={() => handleNumberGuides(numbersHighlight)}/>
                    </div>
                </div>
                {/* <div className="auxiliar"></div> */}
            </div>
        )
    } else {
        return (
            <div className="settings-window">
                <div className="game-setting">
                    <label htmlFor="rc-match">Cells highlighting</label>
                    <input type="checkbox" id="rc-match" defaultChecked={cellsHighlight} onChange={() => handleColorGuides(cellsHighlight)}/>
                </div>
                <div className="game-setting">
                    <label htmlFor="n-match">Numbers highlighting</label>
                    <input type="checkbox" id="n-match" defaultChecked={numbersHighlight} onChange={() => handleNumberGuides(numbersHighlight)}/>
                </div>
            </div>
        )
    }
}

export default GameSettins
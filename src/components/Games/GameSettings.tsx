import { useAppDispatch, useAppSelector } from "../../models/hooks";
import { RootState } from "../../store/store";
import { UsersServices } from "../../services";
import { setGameSettings } from "../../store/gameSettings.slice";

interface GameSettingsProps {
    gameType: number,
    clearCellsHighlighting: () => void,
    clearNumbersHighlighting: () => void,
    selectCells: () => void,
    sameNumbers: () => void
}

const GameSettins:React.FC<GameSettingsProps> = ({gameType, clearCellsHighlighting , clearNumbersHighlighting , selectCells , sameNumbers}) => {
    const isLogged = useAppSelector((state:RootState) => state.isLogged.value)
    const game_settings = useAppSelector((state:RootState) => state.gameSettings.value)

    const dispatch = useAppDispatch()
    const highlight_colors = ["blue", "pink", "green", "yellow", "black"]

    async function saveGameSettings (cellsHighlight:boolean, numbersHighlight:boolean, highlightColor?:string, inputMode?: number) {
        if (isLogged) {
            try {
                const newSettings = await UsersServices.updateGameSettings(cellsHighlight, numbersHighlight, highlightColor, inputMode)
                return console.log('new_game_settings:' , newSettings.data)
            } catch (error) {
                return console.error(error)
            }
        }
    }

    function handleColorGuides (cellsHighlight:boolean) {
        saveGameSettings(!cellsHighlight, game_settings.numbers_highlight)
        dispatch(setGameSettings({cells_highlight:!cellsHighlight, numbers_highlight:game_settings.numbers_highlight, highlight_color: game_settings.highlight_color, input_mode: game_settings.input_mode}))
        if (cellsHighlight) {
            clearCellsHighlighting()
        } else {
            selectCells()
        }
    }
    function handleNumberGuides (numbersHighlight:boolean) {
        saveGameSettings(game_settings.cells_highlight, !numbersHighlight)
        dispatch(setGameSettings({cells_highlight: game_settings.cells_highlight, numbers_highlight:!numbersHighlight, highlight_color: game_settings.highlight_color, input_mode: game_settings.input_mode}))
        if (numbersHighlight) {
            clearNumbersHighlighting()
        } else {
            sameNumbers()
        }
    }

    function handleHighlightColor (highlightColor:string) {
        const cells = document.getElementsByClassName("cell") as HTMLCollectionOf<HTMLDivElement>
        for (const c of cells) {
            c.classList.remove(game_settings.highlight_color)
            c.classList.add(highlightColor)
        }
        saveGameSettings(game_settings.cells_highlight, game_settings.numbers_highlight, highlightColor)
        dispatch(setGameSettings({cells_highlight: game_settings.cells_highlight, numbers_highlight: game_settings.numbers_highlight, highlight_color: highlightColor, input_mode: game_settings.input_mode}))
    }

    function setInputModeButtons(e:React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.checked ? 0 : 1
        saveGameSettings(game_settings.cells_highlight, game_settings.numbers_highlight, game_settings.highlight_color, value)
        return dispatch(setGameSettings({...game_settings, input_mode: value}))
    }

    function setInputModeKeyboard(e:React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.checked ? 1 : 0
        saveGameSettings(game_settings.cells_highlight, game_settings.numbers_highlight, game_settings.highlight_color, value)
        return dispatch(setGameSettings({...game_settings, input_mode: value}))
    }
    
    if (gameType === 0) 
    {
        return (
            <div className="game-settings">
                <div className="settings-window">
                    <div className="game-setting">
                        <label htmlFor="n-match">Highlight numbers</label>
                        <input type="checkbox" id="n-match" defaultChecked={game_settings.numbers_highlight} onChange={() => handleNumberGuides(game_settings.numbers_highlight)}/>
                    </div>
                    <div className="game-setting">
                        <label htmlFor="rc-match">Highlight cells</label>
                        <input type="checkbox" id="rc-match" defaultChecked={game_settings.cells_highlight} onChange={() => handleColorGuides(game_settings.cells_highlight)}/>
                    </div>
                    <div className="game-setting">
                        <label>Highlight color:</label>
                    </div>
                    <div className="game-setting">
                        {highlight_colors.map(color => (
                            <div key={color} className="highlight-colors">
                                <label htmlFor={color} className={`color-checkbox ${color} ${color === game_settings.highlight_color && "selected"}`}></label>
                                <input id={color} type="checkbox" className="checkbox-hidden" onChange={() => handleHighlightColor(color)} defaultChecked={color === game_settings.highlight_color}/>
                            </div>
                        ))}
                    </div>
                    <div className="game-setting">
                        <label>Input mode:</label>
                    </div>
                    <div className="game-setting">
                        <div>
                            <label htmlFor="input-buttons">Buttons</label>
                            <input id='input-buttons' type="checkbox" checked={game_settings.input_mode === 0} onChange={setInputModeButtons}/>
                        </div>
                        <div>
                            <label htmlFor="input-keyboard">Keyboard</label>
                            <input id='input-keyboard' type="checkbox" checked={game_settings.input_mode === 1} onChange={setInputModeKeyboard}/>
                        </div>
                    </div>
                </div>
                
            </div>
        )
    } else {
        return (
            <div className="settings-window">
                <div className="game-setting">
                    <label htmlFor="n-match">Highlight numbers</label>
                    <input type="checkbox" id="n-match" defaultChecked={game_settings.numbers_highlight} onChange={() => handleNumberGuides(game_settings.numbers_highlight)}/>
                </div>
                <div className="game-setting">
                    <label htmlFor="rc-match">Highlight cells</label>
                    <input type="checkbox" id="rc-match" defaultChecked={game_settings.cells_highlight} onChange={() => handleColorGuides(game_settings.cells_highlight)}/>
                </div>
                <div className="game-setting">
                    <label>Highlight color:</label>
                </div>
                <div className="game-setting">
                    {highlight_colors.map(color => (
                        <div key={color} className="highlight-colors">
                            <label htmlFor={color} className={`color-checkbox ${color} ${color === game_settings.highlight_color && "selected"}`}></label>
                            <input id={color} type="checkbox" className="checkbox-hidden" onChange={() => handleHighlightColor(color)} defaultChecked={color === game_settings.highlight_color}/>
                        </div>
                    ))}
                </div>
                <div className="game-setting">
                    <label>Input mode:</label>
                </div>
                <div className="game-setting">
                    <div>
                        <label htmlFor="input-buttons">Buttons</label>
                        <input id='input-buttons' type="checkbox" checked={game_settings.input_mode === 0} onChange={setInputModeButtons}/>
                    </div>
                    <div>
                        <label htmlFor="input-keyboard">Keyboard</label>
                        <input id='input-keyboard' type="checkbox" checked={game_settings.input_mode === 1} onChange={setInputModeKeyboard}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default GameSettins
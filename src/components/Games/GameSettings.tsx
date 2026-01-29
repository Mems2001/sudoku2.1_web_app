import { useAppDispatch, useAppSelector } from "../../models/hooks";
import { RootState } from "../../store/store";
import { setGameSettings } from "../../store/gameSettings.slice";
import { motion } from 'framer-motion'
import { GameModalProps, GameModalWindowProps } from "../../assets/animations";
import { ProfilesServices } from "../../services/ProfilesServices";

interface GameSettingsProps {
    gameType?: number,
    clearCellsHighlighting?: () => void,
    clearNumbersHighlighting?: () => void,
    selectCells?: () => void,
    sameNumbers?: () => void,
    homeCloseButton?: () => void
}

/**
 * This component allows the user to change his game preferences. Works both in game or at the home screen.
 * @returns 
 */
const GameSettins:React.FC<GameSettingsProps> = ({gameType, clearCellsHighlighting , clearNumbersHighlighting , selectCells , sameNumbers, homeCloseButton}) => {
    const game_settings = useAppSelector((state:RootState) => state.gameSettings.value)

    const dispatch = useAppDispatch()
    const highlight_colors = ["blue", "pink", "green", "yellow", "black"]

    function closeSettingsModal() {
        if (homeCloseButton !== undefined) homeCloseButton()
    }

    /***
     * Saves the game settings to the profile, even for anon users.
     */
    async function saveGameSettings (cellsHighlight:boolean, numbersHighlight:boolean, highlightColor?:string, inputMode?: number) {
            try {
                const newSettings = await ProfilesServices.updateGameSettings(cellsHighlight, numbersHighlight, highlightColor, inputMode)
                return console.log('new_game_settings:' , newSettings?.data)
            } catch (error) {
                return console.error(error)
            }
    }

    function handleColorGuides (cellsHighlight:boolean) {
        saveGameSettings(!cellsHighlight, game_settings.numbers_highlight)
        dispatch(setGameSettings({cells_highlight:!cellsHighlight, numbers_highlight:game_settings.numbers_highlight, highlight_color: game_settings.highlight_color, input_mode: game_settings.input_mode}))

        // Controlls the function behavior when used inside a game or from the home screen.
        if (!gameType) return

        if (cellsHighlight && clearCellsHighlighting) {
            clearCellsHighlighting()
        } else if (selectCells) {
            selectCells()
        }
    }
    function handleNumberGuides (numbersHighlight:boolean) {
        saveGameSettings(game_settings.cells_highlight, !numbersHighlight)
        dispatch(setGameSettings({cells_highlight: game_settings.cells_highlight, numbers_highlight:!numbersHighlight, highlight_color: game_settings.highlight_color, input_mode: game_settings.input_mode}))

        // Controlls the function behavior when used inside a game or from the home screen.
        if (!gameType) return

        if (numbersHighlight && clearNumbersHighlighting) {
            clearNumbersHighlighting()
        } else if (sameNumbers) {
            sameNumbers()
        }
    }

    function handleHighlightColor (highlightColor:string) {
        saveGameSettings(game_settings.cells_highlight, game_settings.numbers_highlight, highlightColor)
        dispatch(setGameSettings({cells_highlight: game_settings.cells_highlight, numbers_highlight: game_settings.numbers_highlight, highlight_color: highlightColor, input_mode: game_settings.input_mode}))

        // Controlls the function behavior when used inside a game or from the home screen.
        if (!gameType) return

        const cells = document.getElementsByClassName("cell") as HTMLCollectionOf<HTMLDivElement>
        for (const c of cells) {
            c.classList.remove(game_settings.highlight_color)
            c.classList.add(highlightColor)
        }
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

    if (gameType === undefined || gameType === 0) {
        return (
            <motion.div className="game-settings"
            {...GameModalProps}>

                <motion.div className="settings-window"
                {...GameModalWindowProps}>
                    <div className="game-setting">
                        <label>Input mode:</label>
                        <div className="input-mode-container">
                            <label htmlFor="input-buttons">Buttons</label>
                            <input id='input-buttons' type="checkbox" checked={game_settings.input_mode === 0} onChange={setInputModeButtons}/>
                        </div>
                        <div className="input-mode-container">
                            <label htmlFor="input-keyboard">Keyboard</label>
                            <input id='input-keyboard' type="checkbox" checked={game_settings.input_mode === 1} onChange={setInputModeKeyboard}/>
                        </div>
                    </div>
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

                    {gameType === undefined && <button onClick={closeSettingsModal}>save & close</button>}
                </motion.div>
                
            </motion.div>
        )
    } else {
        return (
            <div className="settings-window">
                <div className="game-setting">
                    <label>Input mode:</label>
                    <div className="input-mode-container">
                        <label htmlFor="input-buttons">Buttons</label>
                        <input id='input-buttons' type="checkbox" checked={game_settings.input_mode === 0} onChange={setInputModeButtons}/>
                    </div>
                    <div className="input-mode-container">
                        <label htmlFor="input-keyboard">Keyboard</label>
                        <input id='input-keyboard' type="checkbox" checked={game_settings.input_mode === 1} onChange={setInputModeKeyboard}/>
                    </div>
                </div>
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
            </div>
        )
    }
}

export default GameSettins
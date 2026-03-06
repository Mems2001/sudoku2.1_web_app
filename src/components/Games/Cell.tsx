import React from "react"
import { Game } from "../../models/game"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { AnnotationsGrid } from "../../models/types"

interface CellProps {
    game: Game,
    cell: string,
    focusOperations(cell:string): void,
    timerOn: boolean,
    timeElapsed: number,
    turn?   : boolean,
    notebookMode: boolean,
    numberButton(number:number, timeElapsed:number): Promise<void>,
    currentFocused: string|undefined,
    setShowWheel: React.Dispatch<React.SetStateAction<boolean>>
}

const Cell:React.FC<CellProps> = ({game, cell, focusOperations, timerOn, timeElapsed, turn, notebookMode, numberButton, currentFocused, setShowWheel}) => {
    const { input_mode, highlight_color, cells_highlight, numbers_highlight } = useSelector((state:RootState) => state.gameSettings.value)

    /**
     * This function  ultimately verifies if the input value is correct. It is also in charge to purge or filter any non allowed imput and to turn it into a valid input if possible.
     * @param input The data received at the cell input.
     * @returns A boolean, wether the value is correct for the puzzle or not.
     */
    function validateInput(input:React.FormEvent<HTMLInputElement>) {
        let value = input.currentTarget.value

        //For cooperative games when it's not your turn you shouldn't be able to make an input, but, if for some reason you do then this check will fail every time.
        if (game.game_type == 2 && !turn) {
            value = ''
        }

        //Remove invalid characters
        value = value.replace(/[^1-9]/g, '')

        //Limit to one digit
        if (value.length > 1) {
          value = value.slice(0, 1)
        }

        input.currentTarget.value = value //We correct the value at the cell.
        if (game.game_type == 2 && !turn) return 

        return numberButton(value === '' ? 10 : parseInt(value), timeElapsed)
    }

    /**
     * This functions checks if there is any annotation number at the given cell position. It is used to decide if the annotations container should be rendered or not, and it also could be used to apply different styles to the cell if there are annotations at it.
     * @param annotations 
     * @param location 
     * @returns 
     */
    function checkAnnnotations(annotations: AnnotationsGrid, location:string) {
        const row = parseInt(location[0])
        const column = parseInt(location[1])
        const cell_anotation = annotations[row][column]

        for (let i = 0; i < 9; i++) {
            if (cell_anotation[i] != 0) {
                return true
            }
        }

        return false
    }

    function handleTouchStart() {
        if (cell === currentFocused && input_mode === 2) {
            setShowWheel(true)
        }
    }

    /**
    * This function adds the borders to the cell, so we can see the sudoku grid.
    */
    function cellClassHandler():string {
        let cell_class = 'cell' 
        if (parseInt(cell[1]) == 2 || parseInt(cell[1]) == 5) {
          cell_class += ' border-right'
        }
        if (parseInt(cell[1]) == 3 || parseInt(cell[1]) == 6) {
          cell_class += ' border-left'
        }
        if (parseInt(cell[0]) == 2 || parseInt(cell[0]) == 5) {
          cell_class += ' border-bottom' 
        }
        if (parseInt(cell[0]) == 3 || parseInt(cell[0]) == 6) {
          cell_class += ' border-top'
        }
        if (determineNumberHiglight()) {
            cell_class += ' font-bold'
        }

        return cell_class
    }

    function determineNumberHiglight():boolean {
        if (!numbers_highlight) return false
        if (currentFocused && game.getAnswersValueByPosition(cell) === game.getAnswersValueByPosition(currentFocused)) return true
        return false
    }

    function determineCellHighlight():boolean {
        if (!cells_highlight) return false
        if (currentFocused && (currentFocused[0] === cell[0] || currentFocused[1] === cell[1] || (Math.floor(parseInt(currentFocused[0])/3) === Math.floor(parseInt(cell[0])/3) && Math.floor(parseInt(currentFocused[1])/3) === Math.floor(parseInt(cell[1])/3)))) return true
        return false
    }

    return (
        <div id={`c${cell}`} onClick={() => focusOperations(cell)} className={`${cellClassHandler()}`} style={determineCellHighlight() ?{backgroundColor: `var(--hcolor-${highlight_color})`}:{}}>
            {game.verifyValue(cell)?
                (<p id={cell}>{game.getAnswersValueByPosition(cell)}</p>)
            : 
                (
                <div className="cell-auxiliar-container">
                    <input id={cell} type="number" inputMode="numeric" min={1} max={9} autoComplete="off" readOnly={input_mode === 0 || input_mode === 2 || notebookMode || cell !== currentFocused} maxLength={1} disabled={!timerOn} onInput={(e) => {validateInput(e)}} onPointerDown={handleTouchStart} onPointerUp={() => setShowWheel(false)}
                    defaultValue={game.getAnswersValueByPosition(cell) != 0 ? game.getAnswersValueByPosition(cell) : ''} 
                    className={!game.verifyValue(cell) ? 'incorrect' : 'correct'}
                    />
                    {checkAnnnotations(game.annotations, cell) && (
                        <div className="cell-annotations">
                            {[0,1,2,3,4,5,6,7,8].map(index => (
                                <span className={`cell-annotation ${currentFocused && numbers_highlight && game.annotations[parseInt(cell[0])][parseInt(cell[1])][index] === game.getAnswersValueByPosition(currentFocused)?'font-bold':''}`} id={`${cell}${index+1}`} key={`annotation-${cell}-${index}`}>
                                    {game.annotations[parseInt(cell[0])][parseInt(cell[1])][index] != 0 ? game.annotations[parseInt(cell[0])][parseInt(cell[1])][index] : ''}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                )               
            }
        </div>
    )
}

export default Cell
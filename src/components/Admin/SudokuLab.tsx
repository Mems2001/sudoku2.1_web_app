import { useState } from "react"
import { useGridCells } from "../../hooks"
import { Grid } from "../../models/types"
import { SudokusServices } from "../../services/SudokusServices"
import { PuzzlesServices } from "../../services"
import { useToaster } from "../../hooks/useToaster"

function SudokuLab() {
    const { cells } = useGridCells({isLab: true})
    const [algorithm, setAlgorithm] = useState<number|null>(null)
    const [difficulty, setDifficulty] = useState<number|null>(null)
    const [shownGrid, setShownGrid] = useState<Grid|null>(null)
    const [sudoku, setSudoku] = useState<Grid|null>(null)
    const [puzzle, setPuzzle] = useState<Grid|null>(null)
    const { openToaster } = useToaster()

    function handleAlgorithmChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setAlgorithm(parseInt(e.target.value))
    }
    function handleDifficultyChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setDifficulty(parseInt(e.target.value))
    }
    function handleDifficultyName(difficulty:number):string|undefined {
        switch (difficulty) {
            case 0:
                return 'Novice'
            case 1:
                return 'Easy'
            case 2: 
                return 'Normal'
            case 3: 
                return 'Hard'
            case 4:
                return 'Expert'
            case 5:
                return 'Master'
        }
    } 

    function getSudoku() {
        if (!algorithm) return
        SudokusServices.getSudokuTest(algorithm)
            .then(res => {
                // console.warn(res.data.grid)
                setSudoku(res.data.grid)
                setShownGrid(res.data.grid)
            })
            .catch(err => {
                console.error(err)
                setSudoku(null)
            })
    }
    function getPuzzle() {
        if (!difficulty && difficulty !== 0 || !sudoku || !algorithm) return
        PuzzlesServices.getPuzzleTest(sudoku, difficulty, algorithm)
            .then(res => {
                // console.warn(res.data)
                if (res.data) {
                    setPuzzle(res.data)
                    setShownGrid(res.data)
                } else {
                    openToaster('Failed to create the puzzle')
                }
            })
            .catch(err => {
                console.error(err)
                setPuzzle(null)
            })
    }

    return (
        <section className="grid-container-lab">
            <div className="grid-lab">
                {cells.map((cell, index) => (
                    <div key={`c${cell}${index}`} id={`c${cell}`} className="cell">{shownGrid && shownGrid[parseInt(cell[0])][parseInt(cell[1])] ? `${shownGrid[parseInt(cell[0])][parseInt(cell[1])]}`: ''}</div>
                ))}
            </div>
            <div className="lab-buttons-container">
                <div className="lab-buttons-container">
                    <h1>Step 1: Generate a sudoku</h1>
                    <select id="algorithm-picker" defaultValue='' onChange={handleAlgorithmChange}>
                        <option value="" disabled>Pick an algorithm</option>
                        <option value={1}>Algorithm 1</option>
                        <option value={2}>Algorithm 2</option>
                        <option value={3}>Algorithm 3</option>
                    </select>
                    <button disabled={!algorithm} className="menu-button" onClick={getSudoku}>Generate{algorithm ? ` with algorithm ${algorithm}` : ''}</button>
                </div>
                <div className="lab-buttons-container">
                    <h1>Step 2: Generate a puzzle</h1>
                    <select id="difficulty-picker" defaultValue='' onChange={handleDifficultyChange}>
                        <option value="" disabled>Pick a difficulty</option>
                        <option value={0}>Novice</option>
                        <option value={1}>Easy</option>
                        <option value={2}>Medium</option>
                        <option value={3}>Hard</option>
                        <option value={4}>Expert</option>
                        <option value={5}>Master</option>
                    </select>
                    <button disabled={!difficulty && difficulty !== 0} onClick={getPuzzle} className="menu-button">Generate{difficulty || difficulty === 0? ` ${handleDifficultyName(difficulty)} puzzle` : ''}</button>
                    <button disabled={!sudoku} onClick={() => setShownGrid(sudoku)} className="menu-button">Show solved sudoku</button>
                    <button disabled={!puzzle} onClick={() => setShownGrid(puzzle)} className="menu-button">Show puzzle</button>
                </div>
            </div>
        </section>
    )
}

export default SudokuLab
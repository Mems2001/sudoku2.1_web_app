import { useState } from "react"
import { useGridCells } from "../../hooks"
import { Grid } from "../../models/types"
import { SudokusServices } from "../../services/SudokusServices"

function SudokuLab() {
    const { cells } = useGridCells({isLab: true})
    const [sudoku, setSudoku] = useState<Grid|null>(null)

    function getSudoku(algorithm:string) {
        SudokusServices.getSudokuTest(algorithm)
            .then(res => {
                console.warn(res.data.grid)
                setSudoku(res.data.grid)
            })
            .catch(err => {
                console.error(err)
                setSudoku(null)
            })
    }

    return (
        <section className="grid-container-lab">
            <div className="grid-lab">
                {cells.map((cell,index) => (
                    <div key={`c${cell}`} id={`c${cell}`} className="cell">{sudoku ? `${sudoku[parseInt(cell[0])][parseInt(cell[1])]}`: `${index}`}</div>
                ))}
            </div>
            <div className="lab-buttons-container">
                <button className="menu-button" onClick={() => getSudoku('1')}>Algorithm 1</button>
                <button className="menu-button" onClick={() => getSudoku('2')}>Algorithm 2</button>
                <button className="menu-button" onClick={() => getSudoku('3')}>Algorithm 3</button>
            </div>
        </section>
    )
}

export default SudokuLab
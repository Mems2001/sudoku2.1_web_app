import { useEffect, useState } from "react"
import { useGridCells } from "../../hooks"
import { Cells, Grid } from "../../models/types"
import { AnimatePresence, motion } from "framer-motion"

import {loaderGridProps, loaderLogoProps} from '../../assets/animations'

function HomeLoader () {
    const [lastUpdatedCells, setLastUpdatedCells] = useState<Cells>([])

    const {cells} = useGridCells({isScreenLoader:true})

    const [puzzle, setPuzzle] = useState<Grid>([[0,8,0,0,0,0,0,2,0],[0,3,4,0,0,5,0,0,0],[0,0,0,9,0,0,4,0,0],[0,2,0,6,0,0,3,0,0],[0,0,8,0,9,3,0,7,0],[0,1,0,0,7,0,0,5,4],[3,6,0,5,1,0,0,0,0],[1,0,0,4,0,0,0,0,0],[0,0,0,0,0,0,2,0,0]]) 

    const answers:Grid = [[9,8,1,3,4,7,5,2,6],[2,3,4,8,6,5,1,9,7],[5,7,6,9,2,1,4,8,3],[7,2,9,6,5,4,3,1,8],[4,5,8,1,9,3,6,7,2],[6,1,3,2,7,8,9,5,4],[3,6,7,5,1,2,8,4,9],[1,9,2,4,8,6,7,3,5],[8,4,5,7,3,9,2,6,1]]

    /**
     * In order to randomly fill the puzzle we shuffle the coordinates array.
     * @param{Cells} coordinates - The array of coordinates.
     * @returns The shuffled array of coordinates. 
     */
    function shuffleArray(coordinates: Cells) {
        for (let i = coordinates.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [coordinates[i], coordinates[j]] = [coordinates[j], coordinates[i]]
        }
        return coordinates
    }

    function parseValue(cell:string) {
        const value = puzzle[parseInt(cell[0])][parseInt(cell[1])]

        return value !== 0 ? value : ''
    }

    function checkUpdatedCells(updated_cells: Cells, cell: string) {
        return updated_cells.includes(cell)
    }

    function assignValue() {
        const shuffled_cells = shuffleArray(cells)

        for (const cell of shuffled_cells) {
            const [row, col] = cell
            const r = parseInt(row)
            const c = parseInt(col)
            if (puzzle[r][c] != 0) continue
            const new_puzzle = puzzle.map(row => [...row]) as Grid
            new_puzzle[r][c] = answers[r][c]

            //State update for cell animations
            const new_array = lastUpdatedCells
            new_array.push(cell)
            setLastUpdatedCells(new_array)

            const targeted_cell = document.getElementById(`c${cell}`) as HTMLDivElement
            if (targeted_cell) targeted_cell.classList.add('cell-animate')

            return setPuzzle(new_puzzle)
        }
     
    }

    useEffect(
        () => {
            const timer = setTimeout(
                () => {
                    assignValue()
                }, 1000
            )

            return () => clearTimeout(timer)
        }, [puzzle]
    )

    return (
        <section className="loader-screen">
            <AnimatePresence>
                <motion.img
                {...loaderLogoProps}
                className="loader-logo" src="/sudoku21_favicon.svg"/>
            </AnimatePresence>

            <AnimatePresence>
                <motion.h2 
                {...loaderGridProps}
                className="loader-message">Our servers are taking longer than expected to respond. Please wait a few more seconds...</motion.h2>
            </AnimatePresence>

            <AnimatePresence>
                <motion.div
                {...loaderGridProps}
                className="loader-grid">
                    {cells.map((cell) => (
                            <div className='loader-cell' key={cell} id={`c${cell}`}>{parseValue(cell)}</div>
                    ))}
                </motion.div>
            </AnimatePresence>
        </section>
    )
}

export default HomeLoader
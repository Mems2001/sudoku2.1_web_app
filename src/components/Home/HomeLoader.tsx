import React, { useEffect, useMemo, useState } from "react"
import { useGridCells } from "../../hooks"
import { Cells, Grid } from "../../models/types"
import { AnimatePresence, motion } from "framer-motion"

import {cellVariants, gridVariants, loaderTextProps, loaderLogoProps} from '../../assets/animations'

interface HomeLoaderProps {
    role: string | null,
    authenticateSession(): void
}

const HomeLoader:React.FC<HomeLoaderProps> = ({role, authenticateSession}) => {
    const [timerOut, setTimerOut] = useState(false)
    const [blanksAmmount, setBlanksAmmount] = useState(0)
    const [lastUpdatedCells, setLastUpdatedCells] = useState<Cells>([])

    const {cells} = useGridCells({})
    const shuffledCells = useMemo(() => shuffleArray(cells), cells)

    const [backupPuzzle, setBackupPuzzle] = useState<Grid>([[0,8,0,0,0,0,0,2,0],[0,3,4,0,0,5,0,0,0],[0,0,0,9,0,0,4,0,0],[0,2,0,6,0,0,3,0,0],[0,0,8,0,9,3,0,7,0],[0,1,0,0,7,0,0,5,4],[3,6,0,5,1,0,0,0,0],[1,0,0,4,0,0,0,0,0],[0,0,0,0,0,0,2,0,0]])
    const [puzzle, setPuzzle] = useState<Grid>([[0,8,0,0,0,0,0,2,0],[0,3,4,0,0,5,0,0,0],[0,0,0,9,0,0,4,0,0],[0,2,0,6,0,0,3,0,0],[0,0,8,0,9,3,0,7,0],[0,1,0,0,7,0,0,5,4],[3,6,0,5,1,0,0,0,0],[1,0,0,4,0,0,0,0,0],[0,0,0,0,0,0,2,0,0]]) 

    const answers:Grid = [[9,8,1,3,4,7,5,2,6],[2,3,4,8,6,5,1,9,7],[5,7,6,9,2,1,4,8,3],[7,2,9,6,5,4,3,1,8],[4,5,8,1,9,3,6,7,2],[6,1,3,2,7,8,9,5,4],[3,6,7,5,1,2,8,4,9],[1,9,2,4,8,6,7,3,5],[8,4,5,7,3,9,2,6,1]]

    /**
     * In order to randomly fill the puzzle we shuffle the coordinates array.
     * @param{Cells} coordinates - The array of coordinates.
     * @returns The shuffled array of coordinates. 
     */
    function shuffleArray(coordinates: Cells) {
        const aux_array = [...coordinates]
        for (let i = aux_array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [aux_array[i], aux_array[j]] = [aux_array[j], aux_array[i]]
        }
        return aux_array
    }

    function countBlanks(puzzle: Grid) {
        let count = 0
        for (const row of puzzle) {
            for (const cell of row) {
                if (cell === 0) count++
            }
        }

        return setBlanksAmmount(count)
    }

    function parseValue(cell:string) {
        const value = puzzle[parseInt(cell[0])][parseInt(cell[1])]

        return value !== 0 ? value : ''
    }

    function classHandler(coordinates: Cells, cell:string) {
        let final_class = 'loader-cell'
        
        if (parseInt(cell[1]) == 2 || parseInt(cell[1]) == 5) {
          final_class += ' border-right'
        }
        if (parseInt(cell[1]) == 3 || parseInt(cell[1]) == 6) {
          final_class += ' border-left'
        }
        if (parseInt(cell[0]) == 2 || parseInt(cell[0]) == 5) {
          final_class += ' border-bottom'
        }
        if (parseInt(cell[0]) == 3 || parseInt(cell[0]) == 6) {
          final_class += ' border-top'
        }

        if (coordinates.includes(cell)) final_class += ' cell-animate'

        return final_class
    }

    /**
     * This functions first evaluate if the current puzzle has been solved. If so, it resets the puzzle to its initial unsolved state. If not, it fills the first blank cell it finds with the correct value.
     * @param cells - The array of coordinates to be filled. It is shuffled in order to fill the cells in a random order. 
     * @returns Either the updated puzzle with one more cell filled, or the initial unsolved puzzle if the current puzzle is already solved.
     */
    function assignValue(cells: Cells) {

        if (lastUpdatedCells.length === blanksAmmount) {
            
            setLastUpdatedCells([])
            return setPuzzle(backupPuzzle)
        }

        for (const cell of cells) {

            const [row, col] = cell
            const r = parseInt(row)
            const c = parseInt(col)
            if (puzzle[r][c] != 0) continue
            const new_puzzle = puzzle.map(row => [...row]) as Grid
            new_puzzle[r][c] = answers[r][c]

            //State update for cell animations
            const new_array = [...lastUpdatedCells]
            new_array.push(cell)
            setLastUpdatedCells(new_array)

            return setPuzzle(new_puzzle)
        }
    }

    useEffect(
        () => {
            countBlanks(puzzle)
            const timer = setTimeout(
                () => {
                    setTimerOut(true)
                }, 500
            )

            return () => clearTimeout(timer)
        }, []
    )

    useEffect(
        () => {
            if (timerOut) {
                const timer = setTimeout(
                    () => {
                        if (!role && lastUpdatedCells.length === blanksAmmount) authenticateSession()
                        assignValue(shuffledCells)
                    }, 1250
                )
    
                return () => clearTimeout(timer)
            }
        }, [puzzle, timerOut]
    )

    if (timerOut) return (
        <section className="loader-screen">
            <AnimatePresence>
                <motion.img
                {...loaderLogoProps}
                className="loader-logo" src="/sudoku21_favicon.svg"/>
            </AnimatePresence>

            <AnimatePresence>
                <motion.h2 
                {...loaderTextProps}
                className="loader-message">Our servers are taking longer than expected to respond. Please wait a few more seconds...</motion.h2>
            </AnimatePresence>

            <AnimatePresence>
                <motion.div
                variants={gridVariants}
                initial='hidden'
                animate= 'show'
                className="loader-grid">
                    {cells.map((cell) => (
                            <motion.div 
                            variants={cellVariants}
                            className={classHandler(lastUpdatedCells, cell)} key={cell} id={`c${cell}`}>{parseValue(cell)}</motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>
        </section>
    )
}

export default HomeLoader
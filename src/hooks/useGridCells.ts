import { useEffect } from "react";
import { Cells } from "../models/types";
import { Game } from "../models/game";

interface UseGridCells {
    game: Game|null,
    setTurn: React.Dispatch<React.SetStateAction<boolean | undefined>>
}

export const useGridCells = ({game, setTurn}: UseGridCells):{cells: Cells} => {
    const cells:Cells = [];

    /**
     * This function defines the cell's names of the sudoku grid, so we can use them later. The names are defined as a string with the format 'xy' where x is the row coordinate and y is the column coordinate, startind from 0 to 8.
     * @param {Cells} cells - An empty array of strings that will be filled with strings representing matrix positioning row+column within a sudoku grid destined to used as html elements ids.
    */
    function defineCells (cells:Cells):void {
        for (let i=0 ; i < 9 ; i++) {
          for (let j=0 ; j < 9 ; j++) {
            cells.push(`${i}${j}`);
          }
        };
    }
    defineCells(cells)

    /**
    * This function adds the borders to the cells, so we can see the sudoku grid.
    * @param cells - An array of strings wich contains all the posible cell's names of a sudoku 9x9 grid written as row+column string concatenation.
    */
    function cellsBorders (cells:Cells):void {
      for (let cell of cells) {
        if (parseInt(cell[1]) == 2 || parseInt(cell[1]) == 5) {
          const c = document.getElementById(`c${cell}`) as HTMLDivElement
          c.classList.add('border-right')
        }
        if (parseInt(cell[1]) == 3 || parseInt(cell[1]) == 6) {
          const c = document.getElementById(`c${cell}`) as HTMLDivElement
          c.classList.add('border-left')
        }
        if (parseInt(cell[0]) == 2 || parseInt(cell[0]) == 5) {
          const c = document.getElementById(`c${cell}`) as HTMLDivElement
          c.classList.add('border-bottom')
        }
        if (parseInt(cell[0]) == 3 || parseInt(cell[0]) == 6) {
          const c = document.getElementById(`c${cell}`) as HTMLDivElement
          c.classList.add('border-top')
        }
      }
    }

    useEffect(
          () => {
            if (game) {
              cellsBorders(cells)
              setTurn(game.host)
            }
          } , [game]
        )

    return {cells}
}
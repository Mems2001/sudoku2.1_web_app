import { useEffect } from "react";
import { Cells } from "../models/types";
import { Game } from "../models/game";

interface UseGridCells {
    game?: Game|null,
    setTurn?: React.Dispatch<React.SetStateAction<boolean | undefined>>
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

    useEffect(
          () => {
            if (game && setTurn) {
              setTurn(game.host)
            }
          } , [game]
        )

    return {cells}
}
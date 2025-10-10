import React from "react";
import { Game, GameType } from "../../models/game";
import { CellAnnotation } from "../../models/types";

interface NumberButtonsProps {
    game: Game,
    game_type: GameType,
    input_mode: number,
    notebookMode: boolean,
    turn?: boolean,
    timeElapsed: number,
    currentFocused?: string,
    numberButton(value:number|CellAnnotation, timeElapsed:number): Promise<void>
}

const NumberButtons:React.FC<NumberButtonsProps> = ({game, game_type, input_mode, notebookMode, turn, timeElapsed, currentFocused, numberButton}) => {
    async function handleAnnotation(value:number) {
        if (!currentFocused) return

        const prev_annotation = game.annotations[parseInt(currentFocused[0])][parseInt(currentFocused[1])]
        let new_annotation:CellAnnotation = [...prev_annotation]
        if (prev_annotation[value-1] != 0) {
            new_annotation[value-1] = 0
        } else {
            new_annotation[value-1] = value
        }

        await numberButton(new_annotation, timeElapsed)
    }

    if (notebookMode) return (
        <div className="remaining-numbers">
            <h2>Annotations:</h2>
            <div className="numbers">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n , index) => 
                <button onClick={() => handleAnnotation(n)} className="remaining-number" key={index}
                >{index +1}</button>
              )}
            </div> 
        </div>
    ) 
    else return (
        <div className="remaining-numbers">
          <h2>Remaining numbers:</h2>
          <div className="numbers">
            {game.remainingNumbers.map((n , index) => 
              <button onClick={async () => await numberButton(index+1, timeElapsed)} className="remaining-number" key={index}
              disabled={(game_type===2 && !turn) || input_mode === 1}>{n<9?index +1:''}</button>
            )}
            {input_mode === 0 && (
              <button onClick={async () => await numberButton(10, timeElapsed)}
                disabled={game_type===2 && !turn}>
                <i className="fa-solid fa-eraser fa-2xl"></i>
              </button>
            )}
          </div> 
        </div>
    )
}

export default NumberButtons
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
    numberButton(value:number|CellAnnotation, timeElapsed:number): Promise<void>,
    setAnnotation(value:number): Promise<void>
}

const NumberButtons:React.FC<NumberButtonsProps> = ({game, game_type, input_mode, notebookMode, turn, timeElapsed, numberButton, setAnnotation}) => {

    if (notebookMode) return (
        <div className="remaining-numbers">
            <h2>Annotations:</h2>
            <div className="numbers">
              {game.remainingNumbers.map((n , index) => 
                <button onClick={async() => {if (input_mode === 1) await setAnnotation(n)}} className="remaining-number" key={index} disabled={n>=9}
                >{n<9 ? index +1 : ''}</button>
              )}
            </div> 
        </div>
    ) 
    else return (
        <div className="remaining-numbers">
          <h2>Remaining numbers:</h2>
          <div className="numbers">
            {game.remainingNumbers.map((n , index) => 
              <button onClick={async () => {if (input_mode === 1) await numberButton(index+1, timeElapsed)}} className="remaining-number" key={index}
              disabled={(game_type===2 && !turn) || input_mode === 1 || n >= 9}>{n<9?index +1:''}</button>
            )}
            {(input_mode === 0 || input_mode === 2) && (
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
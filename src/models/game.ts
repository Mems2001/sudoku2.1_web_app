import { PuzzleS, Sudoku } from "./dbTypes"
import { AnnotationsGrid, CellAnnotation, Grid, Ids, numbers } from "./types"
import { GamesServices, PlayersServices } from "../services"

export type GameType = 0 | 1 | 2

export interface UpdatedGameData {
    updatedGrid: Grid,
    updatedNumber: string,
    updatedErrors: number,
    updatedAnnotations: AnnotationsGrid
}

/**
 * This class represents a full Sudoku game and implements the sudoku's rules and preserves its correct structure. All the properties that are objects contain properties such as grid (wich represents the values of the sudoku, puzzle or answers arranged as an array of arrays according to the 9x9 sudoku official dimmensions) and a number (wich is  string that concatenates all the values of the grid). This class sort of mirrors the player and game tables in the database, with the objective to simplify and modularize the sudoku's rules related logic, encapsulating it as methods that prevents us to rewrite logic in every component that uses a sudoku puzzle.
 * @property id - The unique identifier for the game table.
 * @property player_id - The unique identifier for the player table.
 * @private sudoku - An object representing the "solved" puzzle or the fullfilled grid. The control object to wich any attempt of answer will be compared to check correctness.
 * @private puzzle - An object representing the "unsolved sudoku" or the incomplete grid wich the user will fill. This object will not be modified.
 * @private answers - An object containing the values provided by the user as an attempt to correctly fill the puzzle.
 * @property remainingNumbers - An array wich its "index + 1" represents a number value from 1 to 9 (numbers allowed to fill any sudoku cell) and its value represents the number of times that number apppeared in the answers grid or number. Destined to inform the user wich values are still available to fill the grid (if the number of appeareances is less than 9 is available, otherwise it is not).
 * @private errors - A number representing the number of mistakes committed by the user.
 */
export class Game {
    id: Ids | undefined
    game_type: GameType
    player_id: Ids
    host: boolean
    #sudoku: Sudoku
    #puzzle: PuzzleS
    #answers: {
        number: string,
        grid: Grid
    }
    #annotations: AnnotationsGrid
    remainingNumbers: numbers
    #errors: number

    constructor(game_type: GameType, player_id:Ids , host:boolean , sudoku: Sudoku , puzzle: PuzzleS , id: Ids | undefined , answersN: string, answersGrid: Grid, annotations: AnnotationsGrid, errors: number ) {
        this.id = id
        this.game_type = game_type
        this.player_id = player_id
        this.host = host
        this.#sudoku = sudoku
        this.#puzzle = puzzle
        this.#answers = {
            number: answersN,
            grid: answersGrid
        }
        this.#annotations = annotations
        this.remainingNumbers = this.#checkRemainingNumbers(this.answers.number)
        this.#errors = errors ?? 0
    }

    get sudoku() {
        return this.#sudoku
    }

    get puzzle() {
        return this.#puzzle
    }

    get answers() {
        return this.#answers
    }

    get annotations() {
        return this.#annotations
    }

    getAnswersValueByPosition(position:string) {
        return this.#answers.grid[parseInt(position[0])][parseInt(position[1])]
    }

    getSudokuValueByPosition(position:string) {
        return this.#sudoku.grid[parseInt(position[0])][parseInt(position[1])]
    }
    
    #setErrors (number:number) {
        this.#errors = number
    }

    getErrors () {
        return this.#errors
    }

    #setAnswersGrid (grid:Grid) {
        this.answers.grid = grid
    }

    #setAnswersNumber (number:string) {
        this.answers.number = number
    }

    #setAnnotations (annotations: AnnotationsGrid) {
        this.#annotations = annotations
    }

    /**
     * Counts each 1 to 9 number apparition within a sudoku puzzle. Needed for the constructor.
     * @param number - A string that represents the concatenation of all numbers inside a sudoku puzzle.
     * @returns An array wich its element's index+1 represents the numeral and its value represents how many times this number have appeared in the param.
     */
    #checkRemainingNumbers(number:string | undefined) {
        let aux:numbers = Array(9).fill(0) as numbers
        for (let i=1 ; i < 10 ; i++) {
            for (let n of Array.from(number || [])) {
                if (parseInt(n) == i) {
                    aux[i-1] += 1
                }
            }
        }
        // console.log(aux)
        return aux
    }

    /**
     * Counts each 1 to 9 number apparition within a sudoku puzzle and sets an array wich each element's index represent the 1 to 9 number and its value represents the number of times that numeral appeared in the param
     * @param number - A string that represents the concatenation of all numbers inside a sudoku
     */
    #setRemainingNumbers(number:string | undefined) {
        this.remainingNumbers = this.#checkRemainingNumbers(number)
    }

    /**
     * Compares the provided value to the value from the corresponding sudoku at the provided location
     * @param location - A string that represents the concatenation of a particular row and column of the grid.
     * @returns A boolean value being true if the provided value matches the corresponding sudoku value at the provided location (think of the sudoku object as the solved puzzle), and false otherwise.
     */
    verifyValue(location:string) {
        if (this.getSudokuValueByPosition(location) == this.getAnswersValueByPosition(location)) {
            return true
        }
        return false
    }

    /**
     * Sets a particular value to any desired position of the anwsers grid or the annotations grid. It also checks the correctness of the value (if it is a number) and finally saves the game.
     * @param {string} location - A string that represents the concatenation of a particular row and column of the grid. Both named as numbers from 0 to 8 taken from left to right in case of colmuns and from top to bottom in case of rows.
     * @param {number|CellAnnotation} value  - The desired value to be set.
     * @param {number} timeElapsed - The time elapsed since the game started.
     * @returns {UpdatedGameData} If the game was successfully saved returns the updated game data object, including a grid, number and number of errors, undefined otherwise.
     */
    async setValue (location:string , value:number|CellAnnotation, timeElapsed:number):Promise<UpdatedGameData|undefined> {
        // console.warn("---> setting value", value, location)
        if (typeof value === "number") {
            let parsedValue = value
            if (value === 10) {
                parsedValue = 0
            }
            const row = parseInt(location[0])
            const col = parseInt(location[1])
            this.answers.grid[row].splice(col , 1 , parsedValue)
            let newNumber = ''
            for (let row of this.answers.grid) {
                for (let n of row) {
                    newNumber += String(n)
                }
            }
            this.answers.number = newNumber
            this.#setRemainingNumbers(this.answers.number)
        } else {
            this.#annotations[parseInt(location[0])][parseInt(location[1])] = value
        }

        //Value checking
        let updatedPlayer
        if (typeof value === 'number') {
            if (this.verifyValue(location)) {
                if (this.completedGameCheck()) updatedPlayer = await this.saveAnswers(this.answers.grid, this.answers.number, this.#annotations, timeElapsed, 1)
                else updatedPlayer = await this.saveAnswers(this.answers.grid, this.answers.number, this.#annotations, timeElapsed)
            } else {
                if (value != 10) {
                    this.#setErrors(this.#errors + 1)
                    // console.warn('Errors committed:', this.#errors)
                    
                    if (this.gameOverCheck()) updatedPlayer = await this.saveAnswers(this.answers.grid, this.answers.number, this.#annotations, timeElapsed, 2)
                    else updatedPlayer = await this.saveAnswers(this.answers.grid, this.answers.number, this.#annotations, timeElapsed)
                } else {
                    updatedPlayer = await this.saveAnswers(this.answers.grid, this.answers.number, this.#annotations, timeElapsed)
                }
            }
        } else {
            updatedPlayer = await this.saveAnswers(this.answers.grid, this.answers.number, this.#annotations, timeElapsed)
        }

        if (updatedPlayer) return {
            updatedGrid: updatedPlayer.updatedGrid,
            updatedNumber: updatedPlayer.updatedNumber,
            updatedErrors: updatedPlayer.updatedErrors,
            updatedAnnotations: updatedPlayer.updatedAnnotations
        }

        return undefined
    }

    /**
     * This function is used to save the game in the database acording to the game_id and game_type
     * @param {Grid} grid Matrix of sudoku values updated by the user.
     * @param {string} number
     * @param {number} timeElapsed Time run to the point of this saving. 
     * @param {number} playerStatus A number that represents if the player is still playing(0), won(1) or lost(2) the game.
     * @returns {UpdatedGameData} If the game was successfully saved returns the updated game data object, including a grid, number and number of errors, undefined otherwise.
     */
    async saveAnswers (grid:Grid, number:string, annotations: AnnotationsGrid, timeElapsed:number, playerStatus?:number):Promise<UpdatedGameData|undefined> {
        // console.warn('Saving game...' , grid, number, playerStatus)
        try {
            let updatedPlayer
            if (this.id) {
                updatedPlayer = await PlayersServices.updatePlayer(this.id, this.game_type, grid, number, annotations, this.#errors, playerStatus)
                // Game status will be handled at the back-end.
                await GamesServices.updateGame(this.id, timeElapsed)
            }
            // console.warn(updatedPlayer?.data)
            if (updatedPlayer) {
                this.setAnswers(updatedPlayer.data.grid, updatedPlayer.data.number, updatedPlayer.data.errors, updatedPlayer.data.annotations)
                return {
                    updatedGrid: updatedPlayer.data.grid,
                    updatedNumber: updatedPlayer.data.number,
                    updatedErrors: updatedPlayer.data.errors,
                    updatedAnnotations: updatedPlayer.data.annotations
                }
            }

        } catch (err:any) {
            console.error(err)
        }
    }

    setAnswers(updatedGrid: Grid, updatedNumber: string, updatedErrors: number, updatedAnnotations: AnnotationsGrid) {
        this.#setAnswersGrid(updatedGrid)
        this.#setAnswersNumber(updatedNumber)
        this.#setErrors(updatedErrors)
        this.#setRemainingNumbers(updatedNumber)
        this.#setAnnotations(updatedAnnotations)
    }
    
    completedGameCheck() {
        if (this.sudoku.number === this.answers.number) {
            // console.log('game completed method')
            return true
        }
        return false
    }

    gameOverCheck() {
        if (this.#errors >= 3) return true
        return false
    }
}
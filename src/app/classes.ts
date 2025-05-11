import axios from "axios"
import variables from "../../utils/variables"
import { PuzzleS, Sudoku } from "./dbTypes"
import { Grid, Ids, numbers } from "./types"

/**
 * This class represents a full Sudoku game. All the properties that are objects contain properties such as grid (wich represents the values of the sudoku, puzzle or answers arranged as an array of arrays according to the 9x9 sudoku official dimmensions) and a number (wich is  string that concatenates all the values of the grid). This class sort of mirrors the player and game tables in the database, with the objective to simplify and modularize the majority of the sudoku's rules related logic as posible, encapsulating it as methods that prevents us to rewrite logic in every component that uses a sudoku puzzle.
 * @property id - The unique identifier for the game table.
 * @property player_id - The unique identifier for the player table.
 * @property sudoku - An object representing the "solved" puzzle or the fullfilled grid. The control object to wich any attempt of answer will be compared to check correctness.
 * @property puzzle - An object representing the "unsolved sudoku" or the incomplete grid wich the user will fill. This object will not be modified.
 * @property answers - An object containing the values provided by the user as an attempt to correctly fill the puzzle.
 * @property remainingNumbers - An array wich its "index + 1" represents a number value from 1 to 9 (numbers allowed to fill any sudoku cell) and its value represents the number of times that number apppeared in the answers grid or number. Destined to inform the user wich values are still available to fill the grid (if the number of appeareances is less than 9 is available, otherwise it is not).
 * @property errors - A number representing the number of mistakes committed by the user.
 */
export class Game {
    id: Ids | undefined
    player_id: Ids
    host: boolean
    _sudoku: Sudoku
    _puzzle: PuzzleS
    answers: {
        number: string,
        grid: Grid
    }
    remainingNumbers: numbers
    errors: number

    constructor(player_id:Ids , host:boolean , sudoku: Sudoku , puzzle: PuzzleS , id: Ids | undefined , answersN: string, answersGrid: Grid ) {
        this.id = id
        this.player_id = player_id
        this.host = host
        this._sudoku = sudoku
        this._puzzle = puzzle
        this.answers = {
            number: answersN,
            grid: answersGrid
        }
        this.remainingNumbers = this._checkRemainingNumbers(this.answers.number)
        this.errors = 0
    }

    get sudoku() {
        return this._sudoku
    }

    get puzzle() {
        return this._puzzle
    }

    /**
     * Counts each 1 to 9 number apparition within a sudoku puzzle
     * @param number - A string that represents the concatenation of all numbers inside a sudoku puzzle.
     * @returns An array wich its element's index+1 represents the numeral and its value represents how many times this number have appeared in the param.
     */
    _checkRemainingNumbers(number:string | undefined) {
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
    setRemainingNumbers(number:string | undefined) {
        this.remainingNumbers = this._checkRemainingNumbers(number)
    }

    /**
     * Compares the provided value to the value from the corresponding sudoku at the providad location
     * @param location - A string that represents the concatenation of a particular row and column of the grid.
     * @param value - A number obtained from the provided location.
     * @returns A boolean value being true if the provided value matches the corresponding sudoku value at the provided location (think of the sudoku object as the solved puzzle), and false otherwise.
     */
    verifyValue(location:string ,value:number) {
        const row = parseInt(location[0])
        const col = parseInt(location[1])
        if (this.sudoku.grid[row][col] == value) {
            return true
        }
        return false
    }

    setErrors (number:number) {
        this.errors = number
    }

    setAnswersGrid (grid:Grid) {
        this.answers.grid = grid
    }

    setAnswersNumber (number:string) {
        this.answers.number = number
    }

    /**
     * Sets a particular value to any desired position of the ansers grid. It also checks the correctness of the value and finally saves the game.
     * @param location - A string that represents the concatenation of a particular row and column of the grid. Both named as numbers from 0 to 8 taken from left to right in case of colmuns and from top to bottom in case of rows.
     * @param value  - The desired value to be set.
     * @param timeElapsed - The time elapsed since the game started.
     */
    setValue (location:string , value:number, timeElapsed:number) {
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
        this.setRemainingNumbers(this.answers.number)

        //Value checking
       
        if (this.verifyValue(location, value)) {
            if (this.completedGameCheck()) this.saveAnswers(this.answers.grid, this.answers.number, timeElapsed, 1)
            else this.saveAnswers(this.answers.grid, this.answers.number, timeElapsed)
        } else {
            if (value != 10) {
                this.setErrors(this.errors + 1)
                if (this.gameOverCheck()) this.saveAnswers(this.answers.grid, this.answers.number, timeElapsed, 2)
                else this.saveAnswers(this.answers.grid, this.answers.number, timeElapsed)
            } else {
                this.saveAnswers(this.answers.grid, this.answers.number, timeElapsed)
            }
        }
    }

    /**
     * This function is used to save the game in the database acording to the game_id
     * @param grid: Matrix of sudoku values updated by the user.
     * @param errors: Number of errors that th user committed.
     * @param timeElapsed: Time run to the point of this saving. 
     */
    async saveAnswers (grid:Grid, number:string, timeElapsed:number , playerStatus?:number) {
        // console.log('Saving game...' , this)
        const URL = variables.url_prefix + `/api/v1/players/single/${this.id}`
        const URL2 = variables.url_prefix + `/api/v1/games/${this.id}`
        try {
            const updatedPlayer = await axios.patch(URL , {grid, number,status:playerStatus, errors:this.errors})
            // console.log(updatedPlayer.data)
            await axios.patch(URL2 , {time: timeElapsed})
            this.setAnswersGrid(updatedPlayer.data.grid)
            this.setAnswersNumber(updatedPlayer.data.number)
        } catch (err:any) {
            console.error(err)
        }
      }
    
    completedGameCheck() {
        if (this.sudoku.number === this.answers.number) {
            // console.log('game completed method')
            return true
        }
        return false
    }

    gameOverCheck() {
        if (this.errors >= 3) return true
        return false
    }
}
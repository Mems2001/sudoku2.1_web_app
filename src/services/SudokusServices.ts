import axios from 'axios'
import variables from '../../utils/variables'

const api_prefix = variables.url_prefix + '/api/v1/sudokus'

export class SudokusServices {
    static async getSudokuTest(algorithm: string) {
        try {
            const response = await axios.get(api_prefix + `/test/${algorithm}`)
            console.warn(response)
            return response
        } catch (error:any) {
            console.error({message: error.message})
            throw new Error("Couln't get a random sudoku")
        }
    }
}
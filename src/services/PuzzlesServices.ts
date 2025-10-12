import axios, { AxiosError, AxiosResponse } from 'axios'
import variables from '../../utils/variables'
import { PuzzleData } from '../models/dbTypes'
import { PuzzlesServicesError } from '../models/errors'

const api_prefix = variables.url_prefix + '/api/v1/puzzles' 

export class PuzzlesServices {
    static async getRandomPuzzle(difficulty:number):Promise<AxiosResponse<PuzzleData>> {
        try {
            const response = await axios.get<PuzzleData>(`${api_prefix}/get_random/${difficulty}`)
            return response
        } catch (error:any) {
            // console.error({message: error.message})
            const altError = error as AxiosError
            throw new PuzzlesServicesError(altError.message)
        }
    }
}
import axios, { AxiosError } from 'axios'
import variables from '../../utils/variables'
import { SudokusServicesError } from '../models/errors'
import { Grid } from '../models/types'

const api_prefix = variables.url_prefix + '/api/v1/sudokus'

export class SudokusServices {
    static async getSudokuTest(algorithm: number) {
        try {
            const response = await axios.get(api_prefix + `/test/${algorithm}`)
            console.warn(response)
            return response
        } catch (error:any) {
            // console.error({message: error.message})
            const altError = error as AxiosError
            throw new SudokusServicesError(altError.message)
        }
    }
}
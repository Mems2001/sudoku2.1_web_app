import axios from 'axios'
import variables from '../../utils/variables'
import { handleErrorType } from '../models/errors'

interface GameSettingsBody {
    cellsHighlight: boolean, 
    numbersHighlight: boolean,
    highlightColor?: string,
    inputMode?: number
}

const api_prefix = variables.url_prefix + "/api/v1/profiles"

export class ProfilesServices {
    static async updateGameSettings(cellsHighlight: boolean, numbersHighlight: boolean, highlightColor?:string, inputMode?:number) {
        try {
            const body: GameSettingsBody = {
                cellsHighlight,
                numbersHighlight,
                highlightColor, 
                inputMode
            }
            const response = await axios.patch(`${api_prefix}/game-settings`, body)
            return response
        } catch (error:any) {
            // console.error({message: error.message})
           return handleErrorType('profiles-services', error)
        }
    }
}
import axios, { AxiosResponse } from 'axios'
import variables from '../../utils/variables'
import { LoginForm } from '../models/types'

interface GameSettingsBody {
    cellsHighlight: boolean, 
    numbersHighlight: boolean
}

const api_prefix = variables.url_prefix + "/api/v1/users"

export class UsersServices {
    static async register(data:LoginForm) {
        try {
            const response = await axios.post(`${api_prefix}/register`, data)
            return response
        } catch (error:any) {
            console.error({message: error.message})
            throw new Error("Not registered")
        }
    }

    static async updateGameSettings(cellsHighlight: boolean, numbersHighlight: boolean) {
        try {
            const body: GameSettingsBody = {
                cellsHighlight,
                numbersHighlight
            }
            const response = await axios.patch(`${api_prefix}/game_settings`, body)
            return response
        } catch (error:any) {
            console.error({message: error.message})
            throw new Error("Could not update the game settings")
        }
    }

    static async getAnon():Promise<AxiosResponse<any>> {
        try {
            const response = await axios.get(`${api_prefix}/anon`)
            return response
        } catch (error:any) {
            console.error({message: error.message})
            throw new Error("Could not get the Anon user")
        }
    }
}
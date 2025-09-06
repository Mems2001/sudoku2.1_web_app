import axios, { AxiosError, AxiosResponse } from 'axios'
import variables from '../../utils/variables'
import { LoginForm } from '../models/types'
import { v4 } from 'uuid'
import { AuthenticationResponse } from '../models/errors'

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

    static async postAnon():Promise<AxiosResponse<AuthenticationResponse, AuthenticationResponse>> {
        let preId = localStorage.getItem("anon-sudoku")
        try {
            if (!preId) {
                preId = v4()
                localStorage.setItem("anon-sudoku", preId)
            }
            const response = await axios.post<AuthenticationResponse>(`${api_prefix}/anon`, {pre_id: preId})
            return response
        } catch (error) {
            const altError = error as AxiosError<AuthenticationResponse>
            throw altError.response?.data
        }
    }
}
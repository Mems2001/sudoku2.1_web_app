import axios, { AxiosResponse } from 'axios'
import variables from '../../utils/variables'
import { GameData } from '../models/dbTypes'
import { PostGameBody } from '../models/types'

const api_prefix = variables.url_prefix + '/api/v1/games'

export class GamesServices {

    static async getSavedGames ():Promise<AxiosResponse<GameData>> {
        try {
            const response = await axios.get<GameData>(`${api_prefix}/saved`)
            return response
        } catch (error:any) {
            console.error({message: error.message})
            throw new Error("Couldn't get the saved game")
        }
    }

    static async createGame (body:PostGameBody):Promise<AxiosResponse<GameData>> {
        try {
            const response = await axios.post<GameData>(api_prefix, body)
            return response
        } catch (error:any) {
            console.error({message: error.message})
            throw new Error("Couldn't create the game")
        }
    }
}
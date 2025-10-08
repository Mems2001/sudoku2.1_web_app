import axios, { AxiosResponse } from 'axios'
import variables from '../../utils/variables'
import { GameData } from '../models/dbTypes'
import { Ids } from '../models/types'

export interface PostGameBody {
    puzzle_id: string,
    gameType: number,
    status?: number
}

export interface UpdateGameBody {
    time: number,
    status?: number
}

const api_prefix = variables.url_prefix + '/api/v1/games'

export class GamesServices {

    static async getSavedGames ():Promise<AxiosResponse<GameData>> {
        try {
            const response = await axios.get<GameData>(`${api_prefix}/saved`)
            console.warn(response)
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

    static async updateGame (game_id:Ids, time: number, status?:number):Promise<AxiosResponse<GameData>> {
        try {
            const body: UpdateGameBody = {
                time, 
                status
            }
            const response = await axios.patch<GameData>(`${api_prefix}/${game_id}`, body)
            return response
        } catch (error:any) {
            console.error({message: error.message})
            throw new Error("Couldn't update the game")
        }
    }
}
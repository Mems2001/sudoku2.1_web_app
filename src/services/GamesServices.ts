import axios, { AxiosError, AxiosResponse } from 'axios'
import variables from '../../utils/variables'
import { GameData } from '../models/dbTypes'
import { Ids } from '../models/types'
import { GamesServicesError } from '../models/errors'

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
            // console.warn(response)
            return response
        } catch (error:any) {
            // console.error({message: error.message})
            const altError = error as AxiosError
            throw new GamesServicesError(altError.message)
        }
    }

    static async createGame (body:PostGameBody):Promise<AxiosResponse<GameData>> {
        try {
            const response = await axios.post<GameData>(api_prefix, body)
            return response
        } catch (error:any) {
            // console.error({message: error.message})
            const altError = error as AxiosError
            throw new GamesServicesError(altError.message)
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
            // console.error({message: error.message})
            const altError = error as AxiosError
            throw new GamesServicesError(altError.message)
        }
    }

    static async deleteGame (player_id: Ids) {
        try {
            const response = await axios.delete(`${api_prefix}/${player_id}`)
            return response
        } catch (error:any) {
            // console.error({message: error.message})
            const altError = error as AxiosError
            throw new GamesServicesError(altError.message)
        }
    }
}
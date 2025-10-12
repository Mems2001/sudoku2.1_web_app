import axios, { AxiosError, AxiosResponse } from "axios"
import { AnnotationsGrid, Grid, Ids } from "../models/types"
import { PlayerData } from "../models/dbTypes"
import variables from '../../utils/variables'
import { GameType } from "../models/game"
import { PlayersServicesError } from "../models/errors"

interface UpdatePlayerBody {
    game_type: GameType, 
    grid: Grid, 
    number:string,
    errors: number, 
    status?: number,
    annotations?: AnnotationsGrid, 
}

const api_prefix = variables.url_prefix + '/api/v1/players'

export class PlayersServices {
    
    static async getGamePlayersList(game_id: Ids):Promise<AxiosResponse<PlayerData[]>> {
        try {
            const response = await axios.get<PlayerData[]>(`${api_prefix}/multi/${game_id}`)
            return response
        } catch (error:any) {
            // console.error({message: error.message})
            const altError = error as AxiosError
            throw new PlayersServicesError(altError.message)
        }
    }

    static async getPlayerByGameId(game_id:Ids):Promise<AxiosResponse<PlayerData>> {
           try {
               const response = await axios.get<PlayerData>(`${api_prefix}/single/${game_id}`)
               return response
           } catch (error:any) {
            //    console.error({message: error.message})
               const altError = error as AxiosError
               throw new PlayersServicesError(altError.message)
           }
       }

    static async updatePlayer(game_id: Ids, game_type: GameType, grid: Grid, number: string, annotations: AnnotationsGrid, errors: number, status?: number):Promise<AxiosResponse<PlayerData>> {
        try {
            const body:UpdatePlayerBody = {
                game_type,
                grid,
                annotations,
                number,
                errors,
                status
            }
            const response = await axios.patch<PlayerData>(`${api_prefix}/single/${game_id}`, body)
            // console.warn(response)
            return response
        } catch (error:any) {
            // console.error({message: error.message})
            const altError = error as AxiosError
            throw new PlayersServicesError(altError.message)
        }   
    }

    static async getPlayerIsOnList (game_id:Ids):Promise<AxiosResponse<boolean>> {
        try {
            const response = await axios.get<boolean>(`${api_prefix}/on_list/${game_id}`)
            return response
        } catch (error:any) {
            // console.error({message: error.message})
            const altError = error as AxiosError
            throw new PlayersServicesError(altError.message)
        }
    }
}
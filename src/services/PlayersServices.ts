import axios, { AxiosResponse } from "axios"
import { Grid, Ids } from "../models/types"
import { PlayerData } from "../models/dbTypes"
import variables from '../../utils/variables'

interface UpdatePlayerBody {
    grid: Grid, number:string, errors: number, status: number
}

const api_prefix = variables.url_prefix + '/api/v1/players'

export class PlayersServices {
    
    static async getGamePlayersList(game_id: Ids):Promise<AxiosResponse<PlayerData[]>> {
        try {
            const response = await axios.get<PlayerData[]>(`${api_prefix}/multi/${game_id}`)
            return response
        } catch (error:any) {
            console.error({message: error.message})
            throw new Error("Couldn't get the game's player list")
        }
    }

    static async getPlayerByGameId(game_id:Ids):Promise<AxiosResponse<PlayerData>> {
           try {
               const response = await axios.get<PlayerData>(`${api_prefix}/single/${game_id}`)
               return response
           } catch (error:any) {
               console.error({message: error.message})
               throw new Error("Couldn't get the player data")
           }
       }

    static async updatePlayer(game_id: Ids, grid: Grid, number: string, errors: number, status: number):Promise<AxiosResponse<PlayerData>> {
        try {
            const body:UpdatePlayerBody = {
                grid,
                number,
                errors,
                status
            }
            const response = await axios.patch<PlayerData>(`${api_prefix}/single/${game_id}`, body)
            return response
        } catch (error:any) {
            console.error({message: error.message})
            throw new Error("Failed user update")
        }   
    }

    static async getPlayerIsOnList (game_id:Ids):Promise<AxiosResponse<boolean>> {
        try {
            const response = await axios.get<boolean>(`${api_prefix}/on_list/${game_id}`)
            return response
        } catch (error:any) {
            console.error({message: error.message})
            throw new Error("Couldn't check if the player is on the list")
        }
    }
}
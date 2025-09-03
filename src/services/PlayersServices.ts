import axios, { AxiosResponse } from "axios"
import { Ids } from "../models/types"
import { PlayerData } from "../models/dbTypes"
import variables from '../../utils/variables'

const api_prefix = variables.url_prefix + '/api/v1/players'

export class PlayersServices {
    
     static async getPlayerByGameId(game_id:Ids):Promise<AxiosResponse<PlayerData>> {
            try {
                const response = await axios.get<PlayerData>(`${api_prefix}/single/${game_id}`)
                return response
            } catch (error:any) {
                console.error({message: error.message})
                throw new Error("Couldn't get the player's game")
            }
        }

}
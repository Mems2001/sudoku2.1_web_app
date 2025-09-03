import axios, { AxiosResponse } from "axios"
import variables from '../../utils/variables'
import { LoginForm } from "../models/types"

const api_prefix = variables.url_prefix + "/api/v1/auth"

class AuthServices {

    static async getAuthenticateSession():Promise<AxiosResponse> {
        try {
            const response = await axios.get(`${api_prefix}/authenticate_session`)
            console.log(response)
            return response
        } catch (error:any) {
            console.error('Session authentication error:', error.message, error)
            throw new Error("Session not authenticated")
        }
    }

    static async login(data:LoginForm):Promise<AxiosResponse<any>> {
        try {
            const response = await axios.post(`${api_prefix}/login`, data)
            return response
        } catch(error:any) {
            console.error({message: error.message})
            throw new Error("Not logged in")
        }
    }
    
}

export default AuthServices

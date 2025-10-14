import axios, { AxiosError, AxiosResponse } from "axios"
import variables from '../../utils/variables'
import { LoginForm } from "../models/types"
import { handleErrorType } from "../models/errors"
import { AuthenticationResponse } from "../models/dbTypes"

const api_prefix = variables.url_prefix + "/api/v1/auth"

class AuthServices {

    static async getAuthenticateSession():Promise<AxiosResponse<AuthenticationResponse>> {
        try {
            const response = await axios.get<AuthenticationResponse>(`${api_prefix}/authenticate_session`)
            // console.log(response)
            return response
        } catch (error:any) {
            return handleErrorType('authentication', error)
        }
    }

    static async login(data:LoginForm):Promise<AxiosResponse<AuthenticationResponse>> {
        try {
            const response = await axios.post<AuthenticationResponse>(`${api_prefix}/login`, data)
            // console.log(response)
            return response
        } catch(error:any) {
            return handleErrorType('login', error)
        }
    }

    static async logout():Promise<AxiosResponse<AuthenticationResponse>> {
        try {
            const response = await axios.get<AuthenticationResponse>(`${api_prefix}/logout`)
            // console.log(response)
            return response
        } catch (error:any) {
            return handleErrorType('logout', error)
        }
    }
    
}

export default AuthServices

import axios, { AxiosError, AxiosResponse } from "axios"
import variables from '../../utils/variables'
import { LoginForm } from "../models/types"
import { AuthenticationResponse, LoginErrorResponse } from "../models/errors"

const api_prefix = variables.url_prefix + "/api/v1/auth"

class AuthServices {

    static async getAuthenticateSession():Promise<AxiosResponse<AuthenticationResponse, AuthenticationResponse>> {
        try {
            const response = await axios.get<AuthenticationResponse>(`${api_prefix}/authenticate_session`)
            // console.log(response)
            return response
        } catch (error) {
            const altError = error as AxiosError<AuthenticationResponse>
            // console.error(altError)
            throw altError.response?.data
        }
    }

    static async login(data:LoginForm):Promise<AxiosResponse<AuthenticationResponse, LoginErrorResponse>> {
        try {
            const response = await axios.post<AuthenticationResponse>(`${api_prefix}/login`, data)
            // console.log(response)
            return response
        } catch(error) {
            const altError = error as AxiosError<LoginErrorResponse>
            // console.error(altError.response)
            throw altError.response?.data
        }
    }

    static async logout():Promise<AxiosResponse<AuthenticationResponse, AuthenticationResponse>> {
        try {
            const response = await axios.get<AuthenticationResponse>(`${api_prefix}/logout`)
            console.log(response)
            return response
        } catch (error) {
            const altError = error as AxiosError<AuthenticationResponse>
            throw altError.response?.data
        }
    }
    
}

export default AuthServices

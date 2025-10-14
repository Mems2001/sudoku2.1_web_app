import axios, { AxiosResponse } from 'axios'
import variables from '../../utils/variables'
import { LoginForm } from '../models/types'
import { v4 } from 'uuid'
import { AuthenticationResponse } from '../models/dbTypes'
import { handleErrorType } from '../models/errors'

const api_prefix = variables.url_prefix + "/api/v1/users"

export class UsersServices {
    static async register(data:LoginForm):Promise<AxiosResponse<any>> {
        try {
            const response = await axios.post<any>(`${api_prefix}/register`, data)
            return response
        } catch (error:any) {
            // console.error({message: error.message})
            return handleErrorType('users-services', error)
        }
    }

    static async postAnon():Promise<AxiosResponse<AuthenticationResponse>> {
        let preId = localStorage.getItem("anon-sudoku")
        try {
            if (!preId) {
                preId = v4()
                localStorage.setItem("anon-sudoku", preId)
            }
            const response = await axios.post<AuthenticationResponse>(`${api_prefix}/anon`, {pre_id: preId})
            return response
        } catch (error:any) {
            return handleErrorType('authentication', error)
        }
    }
}
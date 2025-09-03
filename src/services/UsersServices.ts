import axios from 'axios'
import variables from '../../utils/variables'
import { LoginForm } from '../models/types'

const api_prefix = variables.url_prefix + "/api/v1/users"

export class UsersServices {
    static async register(data:LoginForm) {
        try {
            const response = await axios.post(`${api_prefix}/register`, data)
            return response
        } catch (error:any) {
            console.error({message: error.message})
            throw new Error("Not registered")
        }
    }
}
import { Ids } from "./types"

//Back-end
export interface GameSettings {
    cells_highlight: boolean,
    numbers_highlight: boolean,
    highlight_color: string
}

export interface AuthenticationResponse {
    message: string,
    settings: GameSettings,
    class?: string
    type?: number,
    user_id?: Ids,
    role: string | null,
}

export interface LoginErrorResponse {
    message: string,
    class: string,
    type: number
}

export class LoginError extends Error {
    constructor (message:string) {
        super(message)
        this.name = "LoginError"
    }
}

export class LogoutError extends Error {
    constructor (message:string) {
        super(message)
        this.name = "LogoutError"
    }
}

export class AuthenticationError extends Error {
    constructor (message:string) {
        super(message)
        this.name = "AuthenticationError"
    }
}
//Back-end

import { AxiosError } from "axios"

export interface GeneralErrorResponse {
    message: string,
    error: any
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

export class GamesServicesError extends Error {
    constructor (message:string) {
        super(message)
        this.name = "Games Services Error"
    }
}

export class PlayersServicesError extends Error {
    constructor (message:string) {
        super(message)
        this.name = "Players Services Error"
    }
}

export class PuzzlesServicesError extends Error {
    constructor (message:string) {
        super(message)
        this.name = "Puzzles Services Error"
    }
}

export class SudokusServicesError extends Error {
    constructor (message:string) {
        super(message)
        this.name = "Sudokus Services Error"
    }
}

export class UsersServicesError extends Error {
    constructor (message: string) {
        super(message)
        this.name = "Users Services Error"
    }
}

export class ProfilesServicesError extends Error {
    constructor (message: string) {
        super(message)
        this.name = "Profiles Services Error"
    }
}

const errorTypes = {
    "login": LoginError,
    "logout": LogoutError,
    "authentication": AuthenticationError,
    "games-services": GamesServicesError,
    "players-services": PlayersServicesError,
    "puzzles-services": PuzzlesServicesError,
    "sudokus-services": SudokusServicesError,
    "users-services": UsersServicesError,
    "profiles-services": ProfilesServicesError
} as const

export function handleErrorType (type: keyof typeof errorTypes, error:any):any {
    let altError
    if (error.response.data.message) {
        altError = error as AxiosError<GeneralErrorResponse>
        throw new errorTypes[type](`${altError.message}: ${altError.response!.data.message}`)
    } else {
        altError = error as AxiosError
        throw new errorTypes[type](altError.message!)
    }
}
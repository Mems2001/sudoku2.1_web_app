//Back-end

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
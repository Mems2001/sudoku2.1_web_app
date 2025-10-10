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
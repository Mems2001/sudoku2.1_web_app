import { Sudoku } from "./dbTypes"

export type Ids = `${string}-${string}-${string}-${string}-${string}`

export interface PostGameBody {
    puzzle_id: string,
    gameType: number
}

export interface LoginForm {
    username?: string,
    email?: string,
    password?: string,
    useUsername?: boolean
}

export type Username = Pick<LoginForm , 'username'>
export type Email = Pick<LoginForm , 'email'>
export type Password = Pick<LoginForm , 'password'>
export type UseUsername = Pick<LoginForm , 'useUsername'>

// Games

export type Cells = Array<string>

export type Grid = [
    [number, number, number, number, number, number, number, number, number],
    [number, number, number, number, number, number, number, number, number],
    [number, number, number, number, number, number, number, number, number],
    [number, number, number, number, number, number, number, number, number],
    [number, number, number, number, number, number, number, number, number],
    [number, number, number, number, number, number, number, number, number],
    [number, number, number, number, number, number, number ,number ,number],
    [number ,number ,number ,number ,number ,number ,number ,number ,number],
    [number ,number ,number ,number ,number ,number ,number ,number ,number]
]

export interface GameHeaderProps {
    errores: number,
    time: number,
    pause: () => void,
    play: () => void,
    timerOn: boolean,
    save: () => void
}

export interface CurrentPlayer {
    player_id?: Ids,
    isHost: boolean
}

export type numbers = [number , number , number , number , number , number , number , number , number]
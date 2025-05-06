import {Grid, Ids} from './types'

// Puzzles

export interface Puzzle {
    data:       PuzzleData;
    status:     number;
    statusText: string;
    headers:    PuzzleHeaders;
    config:     Config;
    request:    Request;
}

export interface PuzzleData {
    id:         Ids;
    sudokuId:   Ids;
    number:     string;
    grid:       Grid;
    created_at: Date;
    updated_at: Date;
    sudoku_id:  Ids;
    Sudoku:    Sudoku;
}

// Games

export interface Game {
    data:       GameData;
    status:     number;
    statusText: string;
    headers:    WelcomeHeaders;
    config:     Config;
    request:    Request;
}

export interface GameData {
    id:         Ids;
    puzzle_id:  Ids;
    updated_at: Date;
    created_at: Date;
    puzzleId:   Ids;
    status:     number;
    time:       number;
    Puzzle: PuzzleData
}

// Sudokus

export interface Sudoku {
    id:     Ids | undefined;
    number: string;
    grid:   Grid;
}

// Player

export interface PlayerData {
    id:         Ids;
    userId:     Ids;
    gameId:     Ids;
    grid:       Grid;
    number:     string;
    errors:     number;
    status:     number;
    host:       boolean;
    created_at: Date;
    updated_at: Date;
    user_id:    Ids;
    game_id:    Ids;
    Game:       Game;
    User:       User;
}

export interface User {
    username: string
}

export interface Game {
    id: Ids;
    status: number;
    time:   number;
    Puzzle: Puzzle;
}

export interface Puzzle {
    grid:   Grid;
    number: string;
    Sudoku: Sudoku;
}
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

export interface Config {
    transitional:      Transitional;
    adapter:           string[];
    transformRequest:  null[];
    transformResponse: null[];
    timeout:           number;
    xsrfCookieName:    string;
    xsrfHeaderName:    string;
    maxContentLength:  number;
    maxBodyLength:     number;
    env:               Request;
    headers:           ConfigHeaders;
    withCredentials:   boolean;
    method:            string;
    url:               string;
    allowAbsoluteUrls: boolean;
}

export interface Request {
}

export interface ConfigHeaders {
    Accept: string;
}

export interface Transitional {
    silentJSONParsing:   boolean;
    forcedJSONParsing:   boolean;
    clarifyTimeoutError: boolean;
}

export interface PuzzleData {
    id:         Ids;
    sudokuId:   Ids;
    number:     string;
    grid:       Grid;
    created_at: Date;
    updated_at: Date;
    sudoku_id:  Ids;
}

export interface PuzzleHeaders {
    "content-length": string;
    "content-type":   string;
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

export interface Config {
    transitional:      Transitional;
    adapter:           string[];
    transformRequest:  null[];
    transformResponse: null[];
    timeout:           number;
    xsrfCookieName:    string;
    xsrfHeaderName:    string;
    maxContentLength:  number;
    maxBodyLength:     number;
    env:               Request;
    headers:           ConfigHeaders;
    withCredentials:   boolean;
    method:            string;
    url:               string;
    data:              string;
    allowAbsoluteUrls: boolean;
}

export interface Request {
}

export interface ConfigHeaders {
    Accept:         string;
    "Content-Type": string;
}

export interface Transitional {
    silentJSONParsing:   boolean;
    forcedJSONParsing:   boolean;
    clarifyTimeoutError: boolean;
}

export interface GameData {
    id:         Ids;
    user_id:    Ids;
    sudoku_id:  Ids;
    puzzle_id:  Ids;
    number:     string;
    grid:       Grid;
    updated_at: Date;
    created_at: Date;
    userId:     Ids;
    sudokuId:   Ids;
    puzzleId:   Ids;
    status:     number;
    errors:     number;
    time:       number;
}

export interface WelcomeHeaders {
    "content-length": string;
    "content-type":   string;
}

// Sudokus

export interface Sudoku {
    id:     string;
    number: string;
    grid:   Grid;
}
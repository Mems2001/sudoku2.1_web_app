export type Url = string | undefined

export interface PostGameBody {
    puzzle_id: string,
    sudoku_id: string
}

// Api calls

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
    id:         string;
    sudokuId:   string;
    number:     string;
    grid:       Array<number[]>;
    created_at: Date;
    updated_at: Date;
    sudoku_id:  string;
}

export interface PuzzleHeaders {
    "content-length": string;
    "content-type":   string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toPuzzle(json: string): Puzzle {
        return JSON.parse(json);
    }

    public static puzzleToJson(value: Puzzle): string {
        return JSON.stringify(value);
    }
}

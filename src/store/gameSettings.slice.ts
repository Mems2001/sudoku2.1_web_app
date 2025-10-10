import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store"

interface GameSettings {
    value: {
        cells_highlight: boolean,
        numbers_highlight: boolean,
        highlight_color: string,
        input_mode: number
    }
}
const initialState:GameSettings = {
    value: {
        cells_highlight: true,
        numbers_highlight: true,
        highlight_color: "blue",
        input_mode: 0
    }
}

export const gameSettingsSlice = createSlice({
    name: 'game_settings',
    initialState,
    reducers: {
        setGameSettings : (state , action: PayloadAction<{cells_highlight:boolean,numbers_highlight:boolean, highlight_color:string, input_mode: number}>) => {
            state.value.cells_highlight = action.payload.cells_highlight
            state.value.numbers_highlight = action.payload.numbers_highlight
            state.value.highlight_color = action.payload.highlight_color
            state.value.input_mode = action.payload.input_mode
        }
    }
})

export const {setGameSettings} = gameSettingsSlice.actions
export const selectGameSettings = (state: RootState) => state.gameSettings.value
export default gameSettingsSlice.reducer
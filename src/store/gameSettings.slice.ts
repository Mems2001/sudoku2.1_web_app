import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store"

interface GameSettings {
    value: {
        cells_highlight: boolean,
        numbers_highlight: boolean
    }
}
const initialState:GameSettings = {
    value: {
        cells_highlight: true,
        numbers_highlight: true
    }
}

export const gameSettingsSlice = createSlice({
    name: 'game_settings',
    initialState,
    reducers: {
        setGameSettings : (state , action: PayloadAction<{cells_highlight:boolean,numbers_highlight:boolean}>) => {
            state.value.cells_highlight = action.payload.cells_highlight
            state.value.numbers_highlight = action.payload.numbers_highlight
        }
    }
})

export const {setGameSettings} = gameSettingsSlice.actions
export const selectGameSettings = (state: RootState) => state.gameSettings.value
export default gameSettingsSlice.reducer
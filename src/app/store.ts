import { configureStore } from "@reduxjs/toolkit";
import { isLoggedSlice } from "../features/isLogged.slice";
import { roleSlice } from "../features/role.slice";
import { gameSettingsSlice } from "../features/gameSettings.slice";

export const store = configureStore({
    reducer: {
        isLogged: isLoggedSlice.reducer,
        role: roleSlice.reducer,
        gameSettings: gameSettingsSlice.reducer
    }
})


export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
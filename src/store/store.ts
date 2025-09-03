import { configureStore } from "@reduxjs/toolkit";
import { isLoggedSlice } from "../store/isLogged.slice";
import { roleSlice } from "../store/role.slice";
import { gameSettingsSlice } from "../store/gameSettings.slice";

export const store = configureStore({
    reducer: {
        isLogged: isLoggedSlice.reducer,
        role: roleSlice.reducer,
        gameSettings: gameSettingsSlice.reducer
    }
})


export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
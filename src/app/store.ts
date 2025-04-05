import { configureStore } from "@reduxjs/toolkit";
import { isLoggedSlice } from "../features/isLogged.slice";
import { roleSlice } from "../features/role.slice";

export const store = configureStore({
    reducer: {
        isLogged: isLoggedSlice.reducer,
        role: roleSlice.reducer
    }
})


export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
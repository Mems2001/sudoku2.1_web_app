import { configureStore } from "@reduxjs/toolkit";
import { isLoggedSlice } from "../features/isLogged.slice";
import { roleSlice } from "../features/role.slice";

const store = configureStore({
    reducer: {
        isLogged: isLoggedSlice,
        role: roleSlice
    }
})


export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
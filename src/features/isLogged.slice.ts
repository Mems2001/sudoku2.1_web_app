import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../app/store"

interface loggedState {
    value: boolean
}
const initialState:loggedState = {
    value: false
}

export const isLoggedSlice = createSlice({
    name: 'isLogged',
    initialState,
    reducers: {
        setLoggedIn: (state) => {state.value = true},
        setLoggedOut: (state) => {state.value = false}
    }
})

export const {setLoggedIn , setLoggedOut} = isLoggedSlice.actions
export const selectIsLogged = (state: RootState) => state.isLogged.value
export default isLoggedSlice.reducer
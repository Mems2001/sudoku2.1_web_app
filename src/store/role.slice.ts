import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store"
import { RoleType } from "../models/dbTypes"

interface Role {
    value: RoleType | null
}
const initialState:Role = {
    value: null
}

export const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        setRole : (state , action: PayloadAction<RoleType>) => {state.value = action.payload}
    }
})

export const {setRole} = roleSlice.actions
export const selectRole = (state: RootState) => state.role.value
export default roleSlice.reducer
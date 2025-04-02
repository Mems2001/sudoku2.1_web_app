import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../app/store"

interface Role {
    value: string | null
}
const initialState:Role = {
    value: null
}

export const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        setRole : (state , action: PayloadAction<string | null>) => {state.value = action.payload}
    }
})

export const {setRole} = roleSlice.actions
export const selectRole = (state: RootState) => state.role.value
export default roleSlice.reducer
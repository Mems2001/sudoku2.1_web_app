import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store"

interface showToasterState {
    value: boolean
}
const initialState:showToasterState = {
    value: false
}

export const showToasterSlice = createSlice({
    name: 'showToaster',
    initialState,
    reducers: {
        setShowToaster: (state) => {state.value = true},
        setHideToaster: (state) => {state.value = false}
    }
})

export const {setShowToaster, setHideToaster} = showToasterSlice.actions
export const selectShowToaster = (state: RootState) => state.showToaster.value
export default showToasterSlice.reducer
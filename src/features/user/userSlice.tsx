import { User } from "../../app/types"
import { createSlice } from "@reduxjs/toolkit"
import { userApi } from "../../app/services/userApi"
import { RootState } from "../../app/store"

interface InitialState {
  user: User | null
  isAuthenticated: boolean
  users: User[] | null
  currentUser: User | null
  token?: string
}

const initialState: InitialState = {
  user: null,
  isAuthenticated: false,
  users: null,
  currentUser: null
}

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: () => initialState,
    resetUser: (state) => {
      state.user = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(userApi.endpoints.login.matchFulfilled, (state: InitialState, action) => {
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addMatcher(userApi.endpoints.current.matchFulfilled, (state: InitialState, action) => {
        state.isAuthenticated = true
        state.currentUser = action.payload
      })
      .addMatcher(userApi.endpoints.getUserById.matchFulfilled, (state: InitialState, action) => {
        state.isAuthenticated = true
        state.user = action.payload
      })
  }

})

export const {logout, resetUser} = slice.actions
export default slice.reducer

export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated
export const selectCurrent = (state: RootState) =>
  state.user.currentUser
export const selectUser = (state: RootState) =>
  state.user.user
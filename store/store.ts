import { configureStore } from "@reduxjs/toolkit"
import memesReducer from "./features/memesSlice"
import userReducer from "./features/userSlice"
import themeReducer from "./features/themeSlice"

export const store = configureStore({
  reducer: {
    memes: memesReducer,
    user: userReducer,
    theme: themeReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface ThemeState {
  mode: "light" | "dark" | "system"
}

// Initialize from localStorage if available
const initialState: ThemeState = {
  mode: "system",
}

if (typeof window !== "undefined") {
  const theme = localStorage.getItem("theme")
  if (theme) {
    initialState.mode = theme as "light" | "dark" | "system"
  }
}

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.mode = action.payload

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", action.payload)
      }
    },
  },
})

export const { setTheme } = themeSlice.actions

export default themeSlice.reducer


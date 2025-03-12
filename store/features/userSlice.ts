import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "@/types"

interface UserState {
  currentUser: User | null
  isAuthenticated: boolean
  users: User[]
  authError: string | null
}

// Initialize state from localStorage if available
const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  users: [],
  authError: null,
}

if (typeof window !== "undefined") {
  // Load users
  const users = localStorage.getItem("memeverse_users")
  if (users) {
    initialState.users = JSON.parse(users)
  } else {
    // Default users
    initialState.users = [
      {
        id: "1",
        name: "Meme Lover",
        email: "demo@example.com",
        password: "password123", // In a real app, this would be hashed
        bio: "I love creating and sharing memes!",
        profilePicture: "/placeholder.svg?height=200&width=200",
      },
    ]
    localStorage.setItem("memeverse_users", JSON.stringify(initialState.users))
  }

  // Check for logged in user
  const loggedInUser = localStorage.getItem("memeverse_current_user")
  if (loggedInUser) {
    initialState.currentUser = JSON.parse(loggedInUser)
    initialState.isAuthenticated = true
  }
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload,
        }

        // Update user in users array
        state.users = state.users.map((user) => (user.id === state.currentUser?.id ? state.currentUser : user))

        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("memeverse_current_user", JSON.stringify(state.currentUser))
          localStorage.setItem("memeverse_users", JSON.stringify(state.users))
        }
      }
    },

    register: (state, action: PayloadAction<{ name: string; email: string; password: string }>) => {
      const { name, email, password } = action.payload

      // Check if email already exists
      const userExists = state.users.some((user) => user.email === email)

      if (userExists) {
        state.authError = "Email already in use"
        return
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        password, // In a real app, this would be hashed
        bio: `Hi, I'm ${name}!`,
        profilePicture: "/placeholder.svg?height=200&width=200",
      }

      // Add to users array
      state.users.push(newUser)

      // Set as current user
      state.currentUser = newUser
      state.isAuthenticated = true
      state.authError = null

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("memeverse_users", JSON.stringify(state.users))
        localStorage.setItem("memeverse_current_user", JSON.stringify(newUser))
      }
    },

    login: (state, action: PayloadAction<{ email: string; password: string }>) => {
      const { email, password } = action.payload

      // Find user
      const user = state.users.find((user) => user.email === email && user.password === password)

      if (user) {
        state.currentUser = user
        state.isAuthenticated = true
        state.authError = null

        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("memeverse_current_user", JSON.stringify(user))
        }
      } else {
        state.authError = "Invalid email or password"
      }
    },

    logout: (state) => {
      state.currentUser = null
      state.isAuthenticated = false
      state.authError = null

      // Remove from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("memeverse_current_user")
      }
    },

    clearAuthError: (state) => {
      state.authError = null
    },
  },
})

export const { updateUser, register, login, logout, clearAuthError } = userSlice.actions

export default userSlice.reducer


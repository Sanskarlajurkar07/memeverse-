import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Meme, Comment } from "@/types"

interface MemesState {
  trending: Meme[]
  all: Meme[]
  userMemes: Meme[]
  likedMemes: string[]
  currentMeme: Meme | null
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
  filter: "trending" | "new" | "classic" | "random"
  searchQuery: string
}

const initialState: MemesState = {
  trending: [],
  all: [],
  userMemes: [],
  likedMemes: [],
  currentMeme: null,
  status: "idle",
  error: null,
  filter: "trending",
  searchQuery: "",
}

// Load liked memes from localStorage
if (typeof window !== "undefined") {
  const likedMemes = localStorage.getItem("likedMemes")
  if (likedMemes) {
    initialState.likedMemes = JSON.parse(likedMemes)
  }
}

export const fetchMemes = createAsyncThunk("memes/fetchMemes", async () => {
  const response = await fetch("https://api.imgflip.com/get_memes")
  const data = await response.json()

  if (!data.success) {
    throw new Error("Failed to fetch memes")
  }

  // Transform the data to match our Meme type
  return data.data.memes.map((meme: any) => ({
    id: meme.id,
    name: meme.name,
    url: meme.url,
    width: meme.width,
    height: meme.height,
    box_count: meme.box_count,
    captions: [],
    likes: Math.floor(Math.random() * 1000),
    comments: [],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    category: ["trending", "new", "classic", "random"][Math.floor(Math.random() * 4)],
  }))
})

export const fetchMemeById = createAsyncThunk("memes/fetchMemeById", async (id: string) => {
  const response = await fetch("https://api.imgflip.com/get_memes")
  const data = await response.json()

  if (!data.success) {
    throw new Error("Failed to fetch meme")
  }

  const meme = data.data.memes.find((m: any) => m.id === id)

  if (!meme) {
    throw new Error("Meme not found")
  }

  // Transform the data to match our Meme type
  return {
    id: meme.id,
    name: meme.name,
    url: meme.url,
    width: meme.width,
    height: meme.height,
    box_count: meme.box_count,
    captions: [],
    likes: Math.floor(Math.random() * 1000),
    comments: [],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    category: ["trending", "new", "classic", "random"][Math.floor(Math.random() * 4)],
  }
})

const memesSlice = createSlice({
  name: "memes",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<"trending" | "new" | "classic" | "random">) => {
      state.filter = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    likeMeme: (state, action: PayloadAction<string>) => {
      if (state.likedMemes.includes(action.payload)) {
        state.likedMemes = state.likedMemes.filter((id) => id !== action.payload)
      } else {
        state.likedMemes.push(action.payload)
      }

      // Update the likes count in the memes arrays
      const updateLikes = (meme: Meme) => {
        if (meme.id === action.payload) {
          if (state.likedMemes.includes(action.payload)) {
            return { ...meme, likes: meme.likes + 1 }
          } else {
            return { ...meme, likes: Math.max(0, meme.likes - 1) }
          }
        }
        return meme
      }

      state.trending = state.trending.map(updateLikes)
      state.all = state.all.map(updateLikes)

      if (state.currentMeme && state.currentMeme.id === action.payload) {
        state.currentMeme = updateLikes(state.currentMeme)
      }

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("likedMemes", JSON.stringify(state.likedMemes))
      }
    },
    addComment: (state, action: PayloadAction<{ memeId: string; comment: Comment }>) => {
      const { memeId, comment } = action.payload

      // Add comment to the current meme if it matches
      if (state.currentMeme && state.currentMeme.id === memeId) {
        state.currentMeme.comments.push(comment)
      }

      // Add comment to the meme in the all array
      state.all = state.all.map((meme) => {
        if (meme.id === memeId) {
          return {
            ...meme,
            comments: [...meme.comments, comment],
          }
        }
        return meme
      })

      // Save comments to localStorage
      if (typeof window !== "undefined") {
        const comments = JSON.parse(localStorage.getItem("memeComments") || "{}")
        comments[memeId] = comments[memeId] || []
        comments[memeId].push(comment)
        localStorage.setItem("memeComments", JSON.stringify(comments))
      }
    },
    uploadMeme: (state, action: PayloadAction<Meme>) => {
      state.userMemes.unshift(action.payload)
      state.all.unshift(action.payload)

      // Save to localStorage
      if (typeof window !== "undefined") {
        const userMemes = JSON.parse(localStorage.getItem("userMemes") || "[]")
        userMemes.unshift(action.payload)
        localStorage.setItem("userMemes", JSON.stringify(userMemes))
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMemes.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchMemes.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.all = action.payload
        state.trending = action.payload.filter((meme) => meme.category === "trending").slice(0, 10)

        // Load user memes from localStorage
        if (typeof window !== "undefined") {
          const userMemes = localStorage.getItem("userMemes")
          if (userMemes) {
            state.userMemes = JSON.parse(userMemes)
          }
        }

        // Load comments from localStorage
        if (typeof window !== "undefined") {
          const comments = JSON.parse(localStorage.getItem("memeComments") || "{}")
          state.all = state.all.map((meme) => {
            if (comments[meme.id]) {
              return {
                ...meme,
                comments: comments[meme.id],
              }
            }
            return meme
          })
        }
      })
      .addCase(fetchMemes.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch memes"
      })
      .addCase(fetchMemeById.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchMemeById.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.currentMeme = action.payload

        // Load comments from localStorage
        if (typeof window !== "undefined") {
          const comments = JSON.parse(localStorage.getItem("memeComments") || "{}")
          if (comments[action.payload.id]) {
            state.currentMeme.comments = comments[action.payload.id]
          }
        }
      })
      .addCase(fetchMemeById.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch meme"
      })
  },
})

export const { setFilter, setSearchQuery, likeMeme, addComment, uploadMeme } = memesSlice.actions

export default memesSlice.reducer


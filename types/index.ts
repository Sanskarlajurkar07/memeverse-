export interface Meme {
  id: string
  name: string
  url: string
  width: number
  height: number
  box_count: number
  captions: string[]
  likes: number
  comments: Comment[]
  createdAt: string
  category: "trending" | "new" | "classic" | "random"
  userId?: string // Add this to track who uploaded the meme
}

export interface Comment {
  id: string
  text: string
  user: {
    id: string
    name: string
    profilePicture: string
  }
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  password: string // In a real app, this would never be stored in the client
  bio: string
  profilePicture: string
}


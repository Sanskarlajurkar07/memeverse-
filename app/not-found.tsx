"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

// Array of funny 404 meme images
const memeImages = [
  "https://i.imgflip.com/7z7t9c.jpg",
  "https://i.imgflip.com/7z7tgj.jpg",
  "https://i.imgflip.com/7z7tl5.jpg",
  "https://i.imgflip.com/7z7tq3.jpg",
  "https://i.imgflip.com/7z7tv1.jpg",
]

// Array of funny 404 messages
const memeMessages = [
  "Looks like this meme has gone into hiding!",
  "404: Meme not found. It's probably busy being viral elsewhere.",
  "This page has been abducted by aliens... or maybe it never existed?",
  "You've reached the edge of the memeverse. There's nothing here!",
  "Oops! This page is as real as my motivation to exercise.",
]

export default function NotFound() {
  const [randomIndex] = useState(() => Math.floor(Math.random() * memeImages.length))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-8xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
            404
          </h1>

          <div className="relative aspect-square mb-6 rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
              </div>
            ) : (
              <img
                src={memeImages[randomIndex] || "/placeholder.svg"}
                alt="404 Meme"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <p className="text-xl mb-8">{memeMessages[randomIndex]}</p>

          <Button asChild size="lg">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Back to MemeVerse
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}


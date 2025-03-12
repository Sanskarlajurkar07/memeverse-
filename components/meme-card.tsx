"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { likeMeme } from "@/store/features/memesSlice"
import type { RootState } from "@/store/store"
import type { Meme } from "@/types"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface MemeCardProps {
  meme: Meme
  priority?: boolean
}

export default function MemeCard({ meme, priority = false }: MemeCardProps) {
  const dispatch = useDispatch()
  const likedMemes = useSelector((state: RootState) => state.memes.likedMemes)
  const isLiked = likedMemes.includes(meme.id)
  const [isHovered, setIsHovered] = useState(false)

  const handleLike = () => {
    dispatch(likeMeme(meme.id))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/memes/${meme.id}`}>
          <Image
            src={meme.url || "/placeholder.svg"}
            alt={meme.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500"
            style={{
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
            priority={priority}
          />
        </Link>
      </div>

      <div className="p-4">
        <Link href={`/memes/${meme.id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-1 hover:text-primary transition-colors">{meme.name}</h3>
        </Link>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span>{formatDistanceToNow(new Date(meme.createdAt), { addSuffix: true })}</span>
          <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">{meme.category}</span>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleLike}
            className="flex items-center space-x-1 group"
            aria-label={isLiked ? "Unlike" : "Like"}
          >
            <Heart
              className={cn(
                "w-5 h-5 transition-all",
                isLiked ? "text-red-500 fill-red-500" : "text-muted-foreground group-hover:text-red-500",
              )}
            />
            <span
              className={cn(
                "transition-colors",
                isLiked ? "text-red-500" : "text-muted-foreground group-hover:text-red-500",
              )}
            >
              {meme.likes}
            </span>
          </button>

          <Link
            href={`/memes/${meme.id}`}
            className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{meme.comments.length}</span>
          </Link>

          <button
            className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/memes/${meme.id}`)
              // You could add a toast notification here
            }}
            aria-label="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}


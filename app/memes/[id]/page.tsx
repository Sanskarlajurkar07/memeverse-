"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { fetchMemeById, likeMeme, addComment } from "@/store/features/memesSlice"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Heart, MessageCircle, Share2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { v4 as uuidv4 } from "uuid"

export default function MemeDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const { currentMeme, status, error, likedMemes } = useSelector((state: RootState) => state.memes)
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const [commentText, setCommentText] = useState("")
  const isLiked = likedMemes.includes(id)

  useEffect(() => {
    dispatch(fetchMemeById(id))
  }, [dispatch, id])

  const handleLike = () => {
    dispatch(likeMeme(id))
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    // You could add a toast notification here
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()

    if (!commentText.trim() || !currentUser) return

    const newComment = {
      id: uuidv4(),
      text: commentText,
      user: {
        id: currentUser.id,
        name: currentUser.name,
        profilePicture: currentUser.profilePicture,
      },
      createdAt: new Date().toISOString(),
    }

    dispatch(addComment({ memeId: id, comment: newComment }))
    setCommentText("")
  }

  if (status === "loading") {
    return (
      <div className="pt-20 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-muted-foreground">Loading meme...</p>
        </div>
      </div>
    )
  }

  if (status === "failed") {
    return (
      <div className="pt-20 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button asChild variant="outline">
            <Link href="/memes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Memes
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!currentMeme) {
    return (
      <div className="pt-20 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Meme not found</p>
          <Button asChild variant="outline">
            <Link href="/memes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Memes
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/memes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Memes
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-lg overflow-hidden shadow-md"
            >
              <div className="relative aspect-square sm:aspect-video">
                <Image
                  src={currentMeme.url || "/placeholder.svg"}
                  alt={currentMeme.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain"
                  priority
                />
              </div>

              <div className="p-4 sm:p-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{currentMeme.name}</h1>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
                  <span>{formatDistanceToNow(new Date(currentMeme.createdAt), { addSuffix: true })}</span>
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                    {currentMeme.category}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={handleLike}
                    className="flex items-center space-x-2 group"
                    aria-label={isLiked ? "Unlike" : "Like"}
                  >
                    <Heart
                      className={cn(
                        "w-6 h-6 transition-all",
                        isLiked ? "text-red-500 fill-red-500" : "text-muted-foreground group-hover:text-red-500",
                      )}
                    />
                    <span
                      className={cn(
                        "transition-colors",
                        isLiked ? "text-red-500" : "text-muted-foreground group-hover:text-red-500",
                      )}
                    >
                      {currentMeme.likes} Likes
                    </span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Share"
                  >
                    <Share2 className="w-6 h-6" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-card rounded-lg shadow-md p-4 sm:p-6 mb-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                Comments ({currentMeme.comments.length})
              </h2>

              <form onSubmit={handleSubmitComment} className="mb-6">
                <Textarea
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="mb-2"
                />
                <Button type="submit" disabled={!commentText.trim()}>
                  Post Comment
                </Button>
              </form>

              {currentMeme.comments.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No comments yet. Be the first to comment!</p>
              ) : (
                <div className="space-y-4">
                  {currentMeme.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar>
                        <AvatarImage src={comment.user.profilePicture} alt={comment.user.name} />
                        <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{comment.user.name}</p>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}


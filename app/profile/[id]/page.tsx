"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { motion } from "framer-motion"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Grid, Heart, Share2 } from "lucide-react"
import MemeCard from "@/components/meme-card"
import type { User } from "@/types"

export default function SharedProfilePage() {
  const { id } = useParams<{ id: string }>()
  const { users } = useSelector((state: RootState) => state.user)
  const { all, likedMemes } = useSelector((state: RootState) => state.memes)

  const [user, setUser] = useState<User | null>(null)
  const [userMemes, setUserMemes] = useState<any[]>([])
  const [userLikedMemes, setUserLikedMemes] = useState<any[]>([])

  useEffect(() => {
    // Find the user by ID
    const foundUser = users.find((u) => u.id === id)
    setUser(foundUser || null)

    // For this demo, we'll just show random memes as the user's memes
    // In a real app, you would filter memes by user ID
    setUserMemes(all.slice(0, 6))
    setUserLikedMemes(all.filter((meme) => likedMemes.includes(meme.id)).slice(0, 6))
  }, [id, users, all, likedMemes])

  const handleShareProfile = () => {
    // Copy current URL to clipboard
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        alert("Profile link copied to clipboard!")
      })
      .catch(() => {
        alert("Failed to copy link. The profile URL is: " + window.location.href)
      })
  }

  if (!user) {
    return (
      <div className="pt-20 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">User not found</p>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <Card className="mb-8">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={user.profilePicture} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold mb-2">{user.name}</h1>
                      <p className="text-muted-foreground mb-4">{user.bio}</p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShareProfile}
                      className="hidden md:flex items-center gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Share Profile
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{userMemes.length}</p>
                      <p className="text-sm text-muted-foreground">Uploads</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{userLikedMemes.length}</p>
                      <p className="text-sm text-muted-foreground">Liked</p>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" onClick={handleShareProfile} className="mt-4 md:hidden">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="uploads">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="uploads" className="flex items-center gap-2">
                <Grid className="h-4 w-4" />
                Uploads
              </TabsTrigger>
              <TabsTrigger value="liked" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Liked Memes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="uploads">
              {userMemes.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-lg">
                  <p className="text-muted-foreground">This user hasn't uploaded any memes yet.</p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                >
                  {userMemes.map((meme) => (
                    <MemeCard key={meme.id} meme={meme} />
                  ))}
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="liked">
              {userLikedMemes.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-lg">
                  <p className="text-muted-foreground">This user hasn't liked any memes yet.</p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                >
                  {userLikedMemes.map((meme) => (
                    <MemeCard key={meme.id} meme={meme} />
                  ))}
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}


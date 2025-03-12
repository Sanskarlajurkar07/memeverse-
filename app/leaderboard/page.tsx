"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { fetchMemes } from "@/store/features/memesSlice"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Users, Heart, MessageCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function LeaderboardPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { all, status, error } = useSelector((state: RootState) => state.memes)

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMemes())
    }
  }, [dispatch, status])

  // Sort memes by likes
  const topMemes = [...all].sort((a, b) => b.likes - a.likes).slice(0, 10)

  // Create a map of user engagement (likes + comments)
  const userEngagement = all.reduce(
    (acc, meme) => {
      // For this demo, we'll create some random users
      const randomUsers = [
        { id: "1", name: "Meme Lover", profilePicture: "/placeholder.svg?height=40&width=40" },
        { id: "2", name: "Meme Lord", profilePicture: "/placeholder.svg?height=40&width=40" },
        { id: "3", name: "Meme Queen", profilePicture: "/placeholder.svg?height=40&width=40" },
        { id: "4", name: "Meme Master", profilePicture: "/placeholder.svg?height=40&width=40" },
        { id: "5", name: "Meme Wizard", profilePicture: "/placeholder.svg?height=40&width=40" },
      ]

      const randomUser = randomUsers[Math.floor(Math.random() * randomUsers.length)]

      if (!acc[randomUser.id]) {
        acc[randomUser.id] = {
          user: randomUser,
          engagement: 0,
          memes: 0,
        }
      }

      acc[randomUser.id].engagement += meme.likes + meme.comments.length
      acc[randomUser.id].memes += 1

      return acc
    },
    {} as Record<
      string,
      { user: { id: string; name: string; profilePicture: string }; engagement: number; memes: number }
    >,
  )

  // Convert to array and sort by engagement
  const topUsers = Object.values(userEngagement)
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 10)

  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Leaderboard</h1>
          <p className="text-muted-foreground mb-8">
            Check out the top memes and most active users in the MemeVerse community.
          </p>

          <Tabs defaultValue="memes">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="memes" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Top Memes
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Top Users
              </TabsTrigger>
            </TabsList>

            <TabsContent value="memes">
              {status === "loading" && (
                <div className="text-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                  <p className="mt-4 text-muted-foreground">Loading leaderboard...</p>
                </div>
              )}

              {status === "failed" && (
                <div className="text-center py-12">
                  <p className="text-red-500">Error: {error}</p>
                </div>
              )}

              {status === "succeeded" && (
                <div className="space-y-4">
                  {topMemes.map((meme, index) => (
                    <motion.div
                      key={meme.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                    >
                      <Link href={`/memes/${meme.id}`}>
                        <div className="flex items-center p-4">
                          <div className="flex-shrink-0 w-16 text-center">
                            <span
                              className={`text-2xl font-bold ${
                                index === 0
                                  ? "text-yellow-500"
                                  : index === 1
                                    ? "text-gray-400"
                                    : index === 2
                                      ? "text-amber-600"
                                      : "text-muted-foreground"
                              }`}
                            >
                              #{index + 1}
                            </span>
                          </div>

                          <div className="flex-shrink-0 relative h-16 w-16 rounded-md overflow-hidden mr-4">
                            <Image src={meme.url || "/placeholder.svg"} alt={meme.name} fill className="object-cover" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold truncate">{meme.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(meme.createdAt), { addSuffix: true })}
                            </p>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-red-500">
                              <Heart className="h-5 w-5 mr-1 fill-red-500" />
                              <span>{meme.likes}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <MessageCircle className="h-5 w-5 mr-1" />
                              <span>{meme.comments.length}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="users">
              <div className="space-y-4">
                {topUsers.map((userData, index) => (
                  <motion.div
                    key={userData.user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-card rounded-lg overflow-hidden shadow-md p-4 flex items-center"
                  >
                    <div className="flex-shrink-0 w-16 text-center">
                      <span
                        className={`text-2xl font-bold ${
                          index === 0
                            ? "text-yellow-500"
                            : index === 1
                              ? "text-gray-400"
                              : index === 2
                                ? "text-amber-600"
                                : "text-muted-foreground"
                        }`}
                      >
                        #{index + 1}
                      </span>
                    </div>

                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={userData.user.profilePicture} alt={userData.user.name} />
                      <AvatarFallback>{userData.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold truncate">{userData.user.name}</h3>
                      <p className="text-sm text-muted-foreground">{userData.memes} memes uploaded</p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold">{userData.engagement}</p>
                      <p className="text-sm text-muted-foreground">engagement points</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}


"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { updateUser } from "@/store/features/userSlice"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { User, Pencil, Grid, Heart } from "lucide-react"
import MemeCard from "@/components/meme-card"

export default function ProfilePage() {
  const dispatch = useDispatch()
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const { userMemes, all, likedMemes } = useSelector((state: RootState) => state.memes)

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(currentUser?.name || "")
  const [bio, setBio] = useState(currentUser?.bio || "")
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Get liked memes
  const likedMemesData = all.filter((meme) => likedMemes.includes(meme.id))

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (!selectedFile) {
      return
    }

    // Check if file is an image
    if (!selectedFile.type.match("image/(jpeg|png|jpg|webp)")) {
      return
    }

    // Create preview URL
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleSaveProfile = () => {
    if (!currentUser) return

    dispatch(
      updateUser({
        name,
        bio,
        profilePicture: previewUrl || currentUser.profilePicture,
      }),
    )

    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setName(currentUser?.name || "")
    setBio(currentUser?.bio || "")
    setPreviewUrl(null)
    setIsEditing(false)
  }

  if (!currentUser) {
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
                <div className="relative">
                  {isEditing ? (
                    <div
                      className="relative h-32 w-32 rounded-full overflow-hidden cursor-pointer border-2 border-dashed border-primary/50 flex items-center justify-center"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/jpeg,image/png,image/jpg,image/webp"
                      />

                      {previewUrl ? (
                        <Image src={previewUrl || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                      ) : (
                        <>
                          <Avatar className="h-32 w-32">
                            <AvatarImage src={currentUser.profilePicture} alt={currentUser.name} />
                            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <Pencil className="h-6 w-6 text-white" />
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={currentUser.profilePicture} alt={currentUser.name} />
                      <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>

                <div className="flex-1 text-center md:text-left">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
                      </div>

                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="mt-1 min-h-[100px]"
                        />
                      </div>

                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveProfile}>Save Profile</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <div>
                          <h1 className="text-2xl md:text-3xl font-bold mb-2">{currentUser.name}</h1>
                          <p className="text-muted-foreground mb-4">{currentUser.bio}</p>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                          className="hidden md:flex items-center gap-2"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit Profile
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                        <div className="text-center">
                          <p className="text-2xl font-bold">{userMemes.length}</p>
                          <p className="text-sm text-muted-foreground">Uploads</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">{likedMemes.length}</p>
                          <p className="text-sm text-muted-foreground">Liked</p>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="mt-4 md:hidden">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="uploads">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="uploads" className="flex items-center gap-2">
                <Grid className="h-4 w-4" />
                My Uploads
              </TabsTrigger>
              <TabsTrigger value="liked" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Liked Memes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="uploads">
              {userMemes.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-lg">
                  <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Uploads Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't uploaded any memes yet. Start sharing your creativity!
                  </p>
                  <Button asChild>
                    <Link href="/upload">Upload Your First Meme</Link>
                  </Button>
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
              {likedMemesData.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-lg">
                  <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Liked Memes</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't liked any memes yet. Explore and find memes you love!
                  </p>
                  <Button asChild>
                    <Link href="/memes">Explore Memes</Link>
                  </Button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                >
                  {likedMemesData.map((meme) => (
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


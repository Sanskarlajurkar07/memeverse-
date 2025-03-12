"use client"

import type React from "react"

import { useState, useRef, type ChangeEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { uploadMeme } from "@/store/features/memesSlice"
import type { RootState } from "@/store/store"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, ImageIcon, Sparkles, X, LogIn } from "lucide-react"

export default function UploadPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { currentUser, isAuthenticated } = useSelector((state: RootState) => state.user)

  const [name, setName] = useState("")
  const [caption, setCaption] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aiCaption, setAiCaption] = useState<string | null>(null)
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      // If not authenticated, redirect to login page after a short delay
      const timer = setTimeout(() => {
        router.push("/auth/login?redirect=/upload")
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, router])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (!selectedFile) {
      return
    }

    // Check if file is an image or gif
    if (!selectedFile.type.match("image/(jpeg|png|gif|jpg|webp)")) {
      setError("Please upload an image file (JPEG, PNG, GIF, WEBP)")
      return
    }

    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB")
      return
    }

    setFile(selectedFile)
    setError(null)

    // Create preview URL
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const droppedFile = e.dataTransfer.files?.[0]

    if (!droppedFile) {
      return
    }

    // Check if file is an image or gif
    if (!droppedFile.type.match("image/(jpeg|png|gif|jpg|webp)")) {
      setError("Please upload an image file (JPEG, PNG, GIF, WEBP)")
      return
    }

    // Check file size (max 5MB)
    if (droppedFile.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB")
      return
    }

    setFile(droppedFile)
    setError(null)

    // Create preview URL
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(droppedFile)
  }

  const handleRemoveFile = () => {
    setFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const generateAICaption = async () => {
    if (!previewUrl) return

    setIsGeneratingCaption(true)

    try {
      // Simulate AI caption generation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const captions = [
        "When you finally find the bug in your code after 5 hours",
        "That moment when you realize it's only Tuesday",
        "Me explaining to my mom why I need a new gaming PC",
        "When someone says they'll be there in 5 minutes",
        "How I look waiting for my food delivery",
        "When the WiFi goes out for 0.5 seconds",
        "Nobody: My brain at 3 AM:",
        "When you try to explain a meme to your parents",
      ]

      // Pick a random caption
      const randomCaption = captions[Math.floor(Math.random() * captions.length)]
      setAiCaption(randomCaption)
    } catch (error) {
      setError("Failed to generate AI caption. Please try again.")
    } finally {
      setIsGeneratingCaption(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file || !name) {
      setError("Please provide a meme name and upload an image")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // In a real app, you would upload the file to a server here
      // For this demo, we'll simulate an upload delay and use the local preview URL
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create a new meme object
      const newMeme = {
        id: uuidv4(),
        name,
        url: previewUrl as string,
        width: 500,
        height: 500,
        box_count: 2,
        captions: caption ? [caption] : [],
        likes: 0,
        comments: [],
        createdAt: new Date().toISOString(),
        category: "new" as const,
        userId: currentUser?.id, // Add user ID to track who uploaded the meme
      }

      // Dispatch the action to add the meme
      dispatch(uploadMeme(newMeme))

      // Redirect to the meme details page
      router.push(`/memes/${newMeme.id}`)
    } catch (error) {
      setError("Failed to upload meme. Please try again.")
      setIsUploading(false)
    }
  }

  const useAiCaption = () => {
    if (aiCaption) {
      setCaption(aiCaption)
    }
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="pt-20 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <LogIn className="h-16 w-16 mx-auto text-primary mb-4" />
            <h1 className="text-2xl font-bold mb-4">Login Required</h1>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to upload memes. Redirecting you to the login page...
            </p>
            <Button asChild>
              <Link href="/auth/login?redirect=/upload">Go to Login</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Upload Your Meme</h1>
          <p className="text-muted-foreground mb-8">Share your creativity with the MemeVerse community.</p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <div
                  className="border-2 border-dashed rounded-lg p-4 h-[300px] flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                  />

                  {previewUrl ? (
                    <div className="relative w-full h-full">
                      <Image src={previewUrl || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveFile()
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="bg-primary/10 rounded-full p-4 mb-4">
                        <Upload className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-center mb-2">
                        <span className="font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-sm text-muted-foreground text-center">JPEG, PNG, GIF or WEBP (max. 5MB)</p>
                    </>
                  )}
                </div>

                {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Meme Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Give your meme a catchy name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Caption</Label>
                  <Tabs defaultValue="manual" className="mt-1">
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="manual" className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Manual
                      </TabsTrigger>
                      <TabsTrigger value="ai" className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        AI Generated
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="manual">
                      <Textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Add a funny caption to your meme"
                        className="min-h-[120px]"
                      />
                    </TabsContent>
                    <TabsContent value="ai">
                      <Card>
                        <CardContent className="pt-6">
                          {aiCaption ? (
                            <div className="space-y-4">
                              <p className="p-3 bg-muted rounded-md">{aiCaption}</p>
                              <div className="flex justify-between">
                                <Button type="button" variant="outline" onClick={generateAICaption}>
                                  Generate Another
                                </Button>
                                <Button type="button" onClick={useAiCaption}>
                                  Use This Caption
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <Button
                                type="button"
                                onClick={generateAICaption}
                                disabled={!previewUrl || isGeneratingCaption}
                                className="flex items-center gap-2"
                              >
                                {isGeneratingCaption ? (
                                  <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                                    Generating...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="h-4 w-4" />
                                    Generate AI Caption
                                  </>
                                )}
                              </Button>
                              {!previewUrl && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  Upload an image first to generate a caption
                                </p>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isUploading || !file || !name} className="min-w-[150px]">
                {isUploading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                    Uploading...
                  </>
                ) : (
                  "Upload Meme"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


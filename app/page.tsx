"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { fetchMemes } from "@/store/features/memesSlice"
import { motion } from "framer-motion"
import Link from "next/link"
import MemeCard from "@/components/meme-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>()
  const { trending, status, error } = useSelector((state: RootState) => state.memes)

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMemes())
    }
  }, [dispatch, status])

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
                  MemeVerse
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Your ultimate destination for exploring, creating, and sharing the best memes on the internet.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                >
                  <Link href="/memes">Explore Memes</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/upload">Upload Your Meme</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-500/20 z-10 rounded-lg" />
              {trending.length > 0 && (
                <img
                  src={trending[0].url || "/placeholder.svg"}
                  alt="Featured Meme"
                  className="w-full h-full object-cover"
                />
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trending Memes */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Trending Memes</h2>
            <Button asChild variant="ghost" className="group">
              <Link href="/memes" className="flex items-center gap-2">
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {status === "loading" && (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="mt-4 text-muted-foreground">Loading memes...</p>
            </div>
          )}

          {status === "failed" && (
            <div className="text-center py-12">
              <p className="text-red-500">Error: {error}</p>
            </div>
          )}

          {status === "succeeded" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {trending.slice(0, 8).map((meme, index) => (
                <MemeCard key={meme.id} meme={meme} priority={index < 4} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Why Choose MemeVerse?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-card p-6 rounded-lg shadow-md"
            >
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover Memes</h3>
              <p className="text-muted-foreground">
                Explore thousands of memes across different categories and find your favorites.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-card p-6 rounded-lg shadow-md"
            >
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create & Customize</h3>
              <p className="text-muted-foreground">
                Upload your own memes or customize existing templates with our easy-to-use editor.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-card p-6 rounded-lg shadow-md"
            >
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Share & Engage</h3>
              <p className="text-muted-foreground">
                Share your favorite memes with friends and engage with the community through likes and comments.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-500 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Join the Fun?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start exploring, creating, and sharing memes with the MemeVerse community today!
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/memes">Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}


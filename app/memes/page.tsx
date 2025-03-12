"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { fetchMemes, setFilter, setSearchQuery } from "@/store/features/memesSlice"
import { motion } from "framer-motion"
import { useDebounce } from "@/hooks/use-debounce"
import MemeCard from "@/components/meme-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, SlidersHorizontal, TrendingUp, Clock, History, Shuffle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MemesPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { all, status, error, filter, searchQuery } = useSelector((state: RootState) => state.memes)
  const [search, setSearch] = useState(searchQuery)
  const debouncedSearch = useDebounce(search, 500)
  const [sortBy, setSortBy] = useState<"likes" | "date" | "comments">("likes")
  const [page, setPage] = useState(1)
  const itemsPerPage = 12

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMemes())
    }
  }, [dispatch, status])

  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearch))
  }, [debouncedSearch, dispatch])

  // Filter and sort memes
  const filteredMemes = all.filter((meme) => {
    // Filter by category
    const categoryMatch = filter === "trending" ? true : meme.category === filter

    // Filter by search query
    const searchMatch = meme.name.toLowerCase().includes(searchQuery.toLowerCase())

    return categoryMatch && searchMatch
  })

  // Sort memes
  const sortedMemes = [...filteredMemes].sort((a, b) => {
    if (sortBy === "likes") {
      return b.likes - a.likes
    } else if (sortBy === "date") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else {
      return b.comments.length - a.comments.length
    }
  })

  // Paginate memes
  const paginatedMemes = sortedMemes.slice(0, page * itemsPerPage)
  const hasMore = paginatedMemes.length < sortedMemes.length

  const handleLoadMore = () => {
    setPage((prev) => prev + 1)
  }

  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Explore Memes</h1>
          <p className="text-muted-foreground">Discover and enjoy the best memes from around the internet.</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search memes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Tabs defaultValue={filter} className="w-full" onValueChange={(value) => dispatch(setFilter(value as any))}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="trending" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="hidden sm:inline">Trending</span>
                </TabsTrigger>
                <TabsTrigger value="new" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="hidden sm:inline">New</span>
                </TabsTrigger>
                <TabsTrigger value="classic" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  <span className="hidden sm:inline">Classic</span>
                </TabsTrigger>
                <TabsTrigger value="random" className="flex items-center gap-2">
                  <Shuffle className="w-4 h-4" />
                  <span className="hidden sm:inline">Random</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="likes">Most Liked</SelectItem>
                  <SelectItem value="date">Newest</SelectItem>
                  <SelectItem value="comments">Most Comments</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Memes Grid */}
        {status === "loading" && page === 1 && (
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

        {status === "succeeded" && paginatedMemes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl">No memes found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                dispatch(setFilter("trending"))
                setSearch("")
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}

        {status === "succeeded" && paginatedMemes.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {paginatedMemes.map((meme, index) => (
                <MemeCard key={meme.id} meme={meme} priority={index < 8 && page === 1} />
              ))}
            </motion.div>

            {hasMore && (
              <div className="text-center mt-8">
                <Button onClick={handleLoadMore} disabled={status === "loading"} className="min-w-[150px]">
                  {status === "loading" ? (
                    <>
                      <span className="mr-2">Loading</span>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}


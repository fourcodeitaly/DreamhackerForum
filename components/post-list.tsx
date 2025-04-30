"use client"

import { useState, useEffect } from "react"
import { PostCard } from "./post-card"
import { Pagination } from "./pagination"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import type { Post } from "@/lib/db/posts"

interface PostListProps {
  initialPosts: Post[]
  totalPosts: number
  currentPage?: number
}

export function PostList({ initialPosts, totalPosts, currentPage = 1 }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const postsPerPage = 10
  const totalPages = Math.ceil(totalPosts / postsPerPage)

  useEffect(() => {
    setPosts(initialPosts)
  }, [initialPosts])

  const handlePageChange = (page: number) => {
    if (page === currentPage) return

    setIsLoading(true)

    // Create new search params
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())

    // Navigate to the new page
    router.push(`${pathname}?${params.toString()}`)

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (posts.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium">No posts found</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">There are no posts in this category yet.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  )
}

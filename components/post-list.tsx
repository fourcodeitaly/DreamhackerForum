import { PostCard } from "./post-card"
import { Pagination } from "./pagination"
import type { Post } from "@/lib/db/posts/posts-modify"

interface PostListProps {
  posts?: Post[]
  totalPosts?: number
  currentPage?: number
  page?: number
  sort?: string
  category?: string
  pathname: string
}

export async function PostList({
  posts = [],
  totalPosts = 0,
  currentPage = 1,
  page,
  sort,
  category,
  pathname,
}: PostListProps) {
  const postsPerPage = 10
  const totalPages = Math.ceil(totalPosts / postsPerPage)
  const effectivePage = page || currentPage

  if (posts.length === 0) {
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
          <Pagination currentPage={effectivePage} totalPages={totalPages} pathname={pathname} />
        </div>
      )}
    </div>
  )
}

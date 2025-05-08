"use client";

import { useState, useEffect } from "react";
import { PostCard } from "./post-card";
import { Pagination } from "./pagination";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { Post } from "@/lib/db/posts";

interface PostListProps {
  initialPosts?: Post[];
  totalPosts?: number;
  currentPage?: number;
  page?: number;
  sort?: string;
  category?: string;
}

export function PostList({
  initialPosts = [],
  totalPosts = 0,
  currentPage = 1,
  page,
  sort,
  category,
}: PostListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(totalPosts);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const postsPerPage = 10;
  const totalPages = Math.ceil(total / postsPerPage);
  const effectivePage = page || currentPage;

  useEffect(() => {
    // If we have initialPosts, use them
    if (initialPosts && initialPosts.length > 0) {
      setPosts(initialPosts);
      setTotal(totalPosts || 0);
      if (isLoading) {
        setIsLoading(false);
      }
      return;
    }

    // Otherwise, fetch posts based on page, sort, category
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        // Construct the API URL with query parameters
        let url = `/api/posts?page=${effectivePage}&limit=${postsPerPage}`;
        if (sort) url += `&sort=${sort}`;
        if (category) url += `&category=${category}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.posts) {
          setPosts(data.posts);
          setTotal(data.total || data.posts.length);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [initialPosts, totalPosts, page, sort, category, effectivePage]);

  const handlePageChange = (page: number) => {
    if (page === effectivePage) return;

    setIsLoading(true);

    // Create new search params
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());

    // Navigate to the new page
    router.push(`${pathname}?${params.toString()}`);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (posts.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium">No posts found</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          There are no posts in this category yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      {isLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 dark:bg-gray-800 animate-pulse h-40 rounded-lg"
            ></div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={effectivePage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

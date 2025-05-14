import { queryOne } from "../postgres";
import { getPosts } from "../posts/post-get";
import type { Post } from "../posts/posts-modify";

export async function getCategory(
  categoryId: string
): Promise<{ name: { en: string } } | null> {
  try {
    return await queryOne("SELECT name FROM categories WHERE id = $1", [
      categoryId,
    ]);
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

export async function getPostsByCategory(
  categoryId: string,
  page = 1,
  limit = 10
): Promise<{ posts: Post[]; total: number }> {
  try {
    return await getPosts(page, limit, false, categoryId);
  } catch (error) {
    console.error("Error fetching category posts:", error);
    return { posts: [], total: 0 };
  }
}

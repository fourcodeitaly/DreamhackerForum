// Helper function to normalize post data structure
export function normalizePostData(post: any): any {
  // If it's already in the expected format, return as is
  if (post && typeof post.title === "object" && typeof post.content === "object") {
    return post
  }

  // Convert to the expected format
  if (post) {
    return {
      ...post,
      title: {
        en: post.title || "",
        zh: post.title_zh || "",
        vi: post.title_vi || "",
      },
      content: {
        en: post.content || "",
        zh: post.content_zh || "",
        vi: post.content_vi || "",
      },
      excerpt: post.excerpt
        ? {
            en: post.excerpt,
            zh: post.excerpt_zh || "",
            vi: post.excerpt_vi || "",
          }
        : undefined,
    }
  }

  return post
}

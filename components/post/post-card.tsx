"use client";

import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Bookmark, Award } from "lucide-react";
import type { Post } from "@/lib/db/posts/posts-modify";
import { toCamelCase } from "@/utils/snake-case";
import { cn, formatRelativeTime } from "@/utils/utils";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PostCardProps {
  post: Post;
}

export const postImages = [
  {
    tagName: "Vietnam",
    imageUrl:
      "https://mediaen.vietnamplus.vn/images/cc571c067c64d4f85fb35f04673bf296f4c4f5791ae8c9f28fdb97e2ff6667db4724049428606a33929faecb3948eedf/bachkhoa.jpg",
    flag: "🇻🇳",
  },
  {
    tagName: "United States",
    imageUrl:
      "https://www.harvard.edu/wp-content/uploads/2023/11/110823_Features_KS_713-scaled.jpg",
    flag: "🇺🇸",
  },
  {
    tagName: "Canada",
    imageUrl:
      "https://images.theconversation.com/files/505191/original/file-20230118-12-zrgl8s.jpg?ixlib=rb-1.1.0&rect=11%2C39%2C3782%2C2485&q=45&auto=format&w=930&fit=clip",
    flag: "🇨🇦",
  },
  {
    tagName: "Australia",
    imageUrl:
      "https://www.extravelmoney.com/blog/wp-content/uploads/2017/06/Best-Universities-In-Australia-For-MS-Monash-University.jpg",
    flag: "🇦🇺",
  },
  {
    tagName: "New Zealand",
    imageUrl:
      "https://teanabroad.org/wp-content/uploads/2015/10/Otago-Feature1-1-623x480.jpg",
    flag: "🇳🇿",
  },
  {
    tagName: "United Kingdom",
    imageUrl:
      "https://student-cms.prd.timeshighereducation.com/sites/default/files/styles/default/public/cbh_rhul_arch1_0026v1_1_0.jpg?itok=qOtCnkFQ",
    flag: "🇬🇧",
  },
  {
    tagName: "Germany",
    imageUrl: "https://www.avanse.com/blogs/images/11jan-blog-2024.jpg",
    flag: "🇩🇪",
  },
  {
    tagName: "France",
    imageUrl:
      "https://student-cms.prd.timeshighereducation.com/sites/default/files/styles/default/public/istock-532135289.jpg?itok=Tzwepdt5",
    flag: "🇫🇷",
  },
  {
    tagName: "Italy",
    imageUrl:
      "https://storage-prtl-co.imgix.net/endor/articles/1615/images/1523449083_shutterstock_363437531.jpg?max-w=660&max-h=532&fit=crop&q=40",
    flag: "🇮🇹",
  },
  {
    tagName: "Spain",
    imageUrl:
      "https://storage-prtl-co.imgix.net/endor/articles/2988/images/1716457365_shutterstock_786312625.jpg?max-w=660&max-h=532&fit=crop&q=40",
    flag: "🇪🇸",
  },
  {
    tagName: "Netherlands",
    imageUrl: "https://www.avanse.com/blogs/images/Blog_28Aug-2023.jpg",
    flag: "🇳🇱",
  },
  {
    tagName: "China",
    imageUrl:
      "https://www.china-admissions.com/wp-content/uploads/2025/04/Introducing-Renmin-Business-School.jpg",
    flag: "🇨🇳",
  },
  {
    tagName: "Japan",
    imageUrl:
      "https://static.wixstatic.com/media/bf7b7c_956dae8a32984b25b66a336044da33e2~mv2.jpg/v1/fill/w_568,h_344,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/bf7b7c_956dae8a32984b25b66a336044da33e2~mv2.jpg",
    flag: "🇯🇵",
  },
  {
    tagName: "Korea",
    imageUrl:
      "https://intlaffairs.hku.hk/backend/wp-content/uploads/2022/09/Korea-University.jpg",
    flag: "🇰🇷",
  },
  {
    tagName: "Austria",
    imageUrl:
      "https://www.elanet-se.org/wp-content/uploads/2020/11/uni-4825471_1920.jpg",
    flag: "🇦🇹",
  },
  {
    tagName: "Sweden",
    imageUrl:
      "https://cms.studyinsweden.se//app/uploads/2013/10/KTH-Borgg%C3%A5rden_Jann-Lipka-870x579-1.jpg",
    flag: "🇸🇪",
  },
];

export function PostCard({ post }: PostCardProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [saved, setSaved] = useState(post.saved);

  const postTitle =
    post.title?.[language as keyof typeof post.title] || post.title?.en || "";
  const hasScholarshipTag = post.tags?.some(
    (tag) => tag.id === "c34d416e-1bed-4474-a020-e83032e2b15d"
  );
  const hasInternshipTag = post.tags?.some(
    (tag) => tag.id === "8dbc5297-53da-482b-b895-0345d5143bbd"
  );

  // Get the first image from post.images or fallback to post.image_url
  // const postImage = post.images?.[0]?.image_url || post.image_url;
  // const postImage =
  //   "https://upload.wikimedia.org/wikipedia/commons/c/cd/University-of-Alabama-EngineeringResearchCenter-01.jpg";

  const postImage =
    postImages[
      postImages.findIndex((image) =>
        post.tags?.some((tag) => tag.name === image.tagName)
      )
    ]?.imageUrl ||
    "https://upload.wikimedia.org/wikipedia/commons/c/cd/University-of-Alabama-EngineeringResearchCenter-01.jpg";

  const postFlag =
    postImages[
      postImages.findIndex((image) =>
        post.tags?.some((tag) => tag.name === image.tagName)
      )
    ]?.flag || "🌍";

  const handleLike = async () => {
    if (!user) return;

    // Optimistically update UI
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));

    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // Revert optimistic update on error
        setLiked(liked);
        setLikesCount((prev) => (liked ? prev + 1 : prev - 1));
        throw new Error("Failed to update like status");
      }

      // Update with actual server data
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error(t("errorLikingPost"));
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaved((prev) => !prev);

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          action: saved ? "unsave" : "save",
        }),
      });

      if (!response.ok) {
        setSaved((prev) => !prev);
        throw new Error("Failed to update saved status");
      }
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const getExcerpt = (content: string) => {
    // Remove first line if it starts with #
    return (
      content
        .split("\n")
        .filter((line, index) => {
          // Keep all lines except the first one that starts with #
          return index !== 0 || !line.trim().startsWith("#");
        })
        .join("\n")
        .split("--------------------------------------")[0] || ""
    );
  };

  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="p-4">
        <div className="flex gap-6">
          {postImage && (
            <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 hidden md:block">
              <img
                src={postImage}
                alt={postTitle}
                className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-200"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <Link href={`/profile/${post.user?.username || "unknown"}`}>
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={post.user?.image_url || ""}
                    alt={post.user?.name || ""}
                  />
                  <AvatarFallback>{post.user?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
              </Link>
              <Link
                href={`/profile/${post.user?.username || "unknown"}`}
                className="text-sm font-light hover:underline"
              >
                {post.user?.name}
              </Link>
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(post.created_at || "")}
              </span>
              <span className="text-lg text-muted-foreground">{postFlag}</span>
            </div>
            <div className="flex place-items-start gap-2 justify-between">
              <div className="flex-1">
                <Link href={`/posts/${post.id}`} className="block">
                  <h2 className="text-base font-medium hover:underline mb-2 line-clamp-2">
                    <span className="mr-2">🔥</span>
                    {postTitle}
                  </h2>
                </Link>
                {post.content?.vi && (
                  <div className="hidden md:block">
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {getExcerpt(post.content.vi)}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex flex-col md:flex-row gap-2 items-end">
                  {hasInternshipTag && (
                    <Link href={`/posts?category=internship`}>
                      <Badge
                        variant="default"
                        className="bg-green-700 hover:bg-green-800 text-nowrap"
                      >
                        {t("internship").split(")")[1]}
                      </Badge>
                    </Link>
                  )}
                  {hasScholarshipTag && (
                    <Link
                      href={`/posts?tag=c34d416e-1bed-4474-a020-e83032e2b15d`}
                    >
                      <Badge
                        variant="default"
                        className="bg-yellow-500 hover:bg-yellow-600 text-nowrap animate-pulse"
                      >
                        {t("scholarship").split(")")[1]}
                      </Badge>
                    </Link>
                  )}
                  {post.event && (
                    <Link href={`/events/${post.event.id}`}>
                      <Badge
                        variant="default"
                        className="bg-red-500 hover:bg-red-600 text-nowrap"
                      >
                        {t("eventsTag").split(")")[1]}
                      </Badge>
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 text-xs text-muted-foreground justify-between mt-2">
              <div className="flex items-center gap-2 flex-wrap">
                {post.category && (
                  <Link href={`/posts?category=${post.category.id}`}>
                    <Badge
                      variant="outline"
                      className="hover:bg-accent text-muted-foreground text-xs whitespace-nowrap min-w-[80px]"
                    >
                      {t(toCamelCase(post.category.id))}
                    </Badge>
                  </Link>
                )}
                {post.tags && post.tags.length > 1 ? (
                  <>
                    <Link href={`/posts?tag=${post.tags[0].id}`}>
                      <Badge
                        variant="outline"
                        className="hover:bg-accent text-muted-foreground text-xs cursor-pointer line-clamp-1"
                      >
                        {post.tags[0].name.length > 30
                          ? `${post.tags[0].name.slice(0, 30)}...`
                          : post.tags[0].name}
                      </Badge>
                    </Link>
                    {post.tags.length > 1 && (
                      <Link href={`/posts/${post.id}`}>
                        <Badge
                          variant="outline"
                          className="hover:bg-accent text-muted-foreground text-xs cursor-pointer line-clamp-1"
                        >
                          +{post.tags.length - 1}
                        </Badge>
                      </Link>
                    )}
                  </>
                ) : (
                  post.tags?.map((tag) => (
                    <Badge
                      key={tag.id + post.id}
                      variant="outline"
                      className="hover:bg-accent text-muted-foreground text-xs cursor-pointer"
                    >
                      {tag.name}
                    </Badge>
                  ))
                )}
              </div>

              <div className="flex gap-2 justify-between items-center">
                <div className="flex justify-end text-xs text-muted-foreground gap-4">
                  <div
                    className="flex items-center cursor-pointer group"
                    onClick={handleLike}
                  >
                    <Heart
                      className={cn(
                        "h-3 w-3 mr-1 transition-all duration-200 ease-in-out",
                        liked
                          ? "fill-red-500 text-red-500 scale-110"
                          : "text-muted-foreground group-hover:scale-150"
                      )}
                    />
                    <span className="transition-all duration-200 ease-in-out">
                      {likesCount || 0}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1 text-green-700" />
                    {post.comments_count || 0}
                  </div>
                  <div className="flex items-center">
                    <Bookmark className="h-3 w-3 mr-1 text-yellow-700" />
                    {post.saved_count || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

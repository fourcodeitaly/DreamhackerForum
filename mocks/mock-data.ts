import { Resource } from "@/lib/types/resource";

export function getMockResources(): Resource[] {
  return [
    {
      id: "resource-1",
      title: "US F-1 Visa Interview Questions and Answers",
      description:
        "A comprehensive guide with 50+ common questions asked in F-1 visa interviews and suggested answers.",
      type: "pdf",
      author: "Emily Chen",
      tags: ["Visa Interview", "F-1 Visa", "US Study"],
    },
    {
      id: "resource-2",
      title: "UK University Interview Preparation Guide",
      description:
        "Learn how to prepare for academic interviews at UK universities with this detailed guide.",
      type: "pdf",
      author: "James Wilson",
      tags: ["University Interview", "UK Study", "Admission Tips"],
    },
    {
      id: "resource-3",
      title: "IELTS Speaking Practice Videos",
      description:
        "A series of video lessons and practice exercises to help you prepare for the IELTS speaking test.",
      type: "video",
      author: "Anh Nguyen",
      tags: ["IELTS", "Language Test", "Speaking Tips"],
    },
    {
      id: "resource-4",
      title: "Scholarship Interview Simulator",
      description:
        "An interactive tool that simulates scholarship interviews with common questions and feedback.",
      type: "link",
      author: "Miguel Rodriguez",
      tags: ["Scholarship", "Interview Tips", "Preparation"],
    },
    {
      id: "resource-5",
      title: "Cultural Adjustment Guide for International Students",
      description:
        "Tips and strategies for dealing with culture shock and adapting to life in a new country.",
      type: "pdf",
      author: "Li Wei",
      tags: ["Culture Shock", "Adjustment Tips", "International Student"],
    },
    {
      id: "resource-6",
      title: "Study Abroad Application Checklist",
      description:
        "A comprehensive checklist to ensure you don't miss any important steps in your study abroad application.",
      type: "pdf",
      author: "Sarah Johnson",
      tags: ["Application Tips", "Study Abroad", "Checklist"],
    },
  ];
}

// Mock notifications
export function getMockNotifications() {
  return [
    {
      id: "notification-1",
      type: "like",
      content: "James Wilson liked your post",
      createdAt: "2023-06-20T10:30:00.000Z",
      read: false,
      link: "/posts/post-1",
    },
    {
      id: "notification-2",
      type: "comment",
      content: "Anh Nguyen commented on your post",
      createdAt: "2023-06-19T14:45:00.000Z",
      read: false,
      link: "/posts/post-1#comments",
    },
    {
      id: "notification-3",
      type: "reply",
      content: "Emily Chen replied to your comment",
      createdAt: "2023-06-18T09:15:00.000Z",
      read: false,
      link: "/posts/post-2#comments",
    },
    {
      id: "notification-4",
      type: "like",
      content: "Miguel Rodriguez liked your comment",
      createdAt: "2023-06-17T16:20:00.000Z",
      read: true,
      link: "/posts/post-3#comments",
    },
    {
      id: "notification-5",
      type: "mention",
      content: "Li Wei mentioned you in a comment",
      createdAt: "2023-06-16T11:30:00.000Z",
      read: true,
      link: "/posts/post-4#comments",
    },
  ];
}

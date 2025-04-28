// Mock data for the application

// Mock current user
export function getMockCurrentUser() {
  return {
    id: "user-1",
    name: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    image: "/placeholder.svg?height=40&width=40",
    notifications: 3,
    joinedAt: "2023-01-15T00:00:00.000Z",
    bio: "Student passionate about studying abroad and helping others with their journey.",
    location: "New York, USA",
    postsCount: 12,
    commentsCount: 48,
    likesReceived: 156,
    badges: [
      { id: "badge-1", name: "Top Contributor" },
      { id: "badge-2", name: "Helpful Commenter" },
    ],
  }
}

// Mock user by username
export function getMockUserByUsername(username: string) {
  if (username === "johndoe") {
    return getMockCurrentUser()
  }

  return {
    id: `user-${username}`,
    name: username.charAt(0).toUpperCase() + username.slice(1),
    username,
    email: `${username}@example.com`,
    image: "/placeholder.svg?height=40&width=40",
    notifications: 0,
    joinedAt: "2023-03-20T00:00:00.000Z",
    bio: "Student preparing for study abroad interviews.",
    location: "London, UK",
    postsCount: 5,
    commentsCount: 17,
    likesReceived: 42,
    badges: [{ id: "badge-3", name: "Rising Star" }],
  }
}

// Mock posts
export function getMockPosts(page = 1, limit = 10) {
  const posts = [
    {
      id: "post-1",
      title: "My Experience with US Student Visa Interview",
      excerpt: "I recently had my F-1 visa interview and wanted to share some tips that helped me succeed.",
      content:
        "I recently had my F-1 visa interview at the US Embassy and I'm happy to share that I was approved! Here are some tips that helped me:\n\n1. Be confident and concise in your answers\n2. Bring all required documentation neatly organized\n3. Clearly explain your study plans and why you chose your specific program\n4. Demonstrate ties to your home country\n5. Be honest about your intentions to return after completing your studies\n\nThe interview itself was quite short, only about 3-4 minutes. The officer asked about my program, why I chose that university, my career plans after graduation, and how I planned to finance my education.\n\nRemember to dress professionally and arrive early. Good luck with your interviews!",
      author: {
        id: "user-2",
        name: "Emily Chen",
        username: "emilychen",
        image: "/placeholder.svg?height=40&width=40",
      },
      createdAt: "2023-06-15T10:30:00.000Z",
      likesCount: 42,
      commentsCount: 12,
      tags: ["Visa Interview", "F-1 Visa", "US Study"],
      image: "/placeholder.svg?height=400&width=600",
      isPinned: true,
      liked: false,
      saved: false,
    },
    {
      id: "post-2",
      title: "Common Questions in UK University Interviews",
      excerpt: "Preparing for a UK university interview? Here are the most common questions you might face.",
      content:
        "After going through multiple UK university interviews and talking to friends who did the same, I've compiled a list of common questions that come up:\n\n1. Why did you choose this university and course?\n2. What aspects of the course interest you most?\n3. How does this course fit into your career plans?\n4. What relevant experience do you have?\n5. What are your strengths and weaknesses?\n6. Discuss a current issue related to your field of study\n7. What books or articles have you read related to this subject?\n8. What extracurricular activities do you participate in?\n\nFor academic courses, be prepared for subject-specific questions that test your knowledge and critical thinking. For example, if you're applying for Economics, they might ask you to discuss a current economic issue.\n\nMy advice is to practice your answers but don't memorize them word for word. The interviewers want to see your genuine interest and ability to think on your feet.",
      author: {
        id: "user-3",
        name: "James Wilson",
        username: "jameswilson",
        image: "/placeholder.svg?height=40&width=40",
      },
      createdAt: "2023-06-10T14:20:00.000Z",
      likesCount: 38,
      commentsCount: 9,
      tags: ["University Interview", "UK Study", "Admission Tips"],
      image: "/placeholder.svg?height=400&width=600",
      isPinned: false,
      liked: true,
      saved: true,
    },
    {
      id: "post-3",
      title: "How I Prepared for My IELTS Speaking Test",
      excerpt: "Sharing my preparation strategy that helped me score an 8.0 in the IELTS speaking section.",
      content:
        "I recently took the IELTS test and scored an 8.0 in the speaking section. Here's how I prepared:\n\n1. Daily practice: I spoke English every day, even if just to myself\n2. Recording myself: This helped me identify my mistakes and areas for improvement\n3. Learning common topics: I researched common IELTS speaking topics and prepared ideas for them\n4. Vocabulary expansion: I focused on learning topic-specific vocabulary\n5. Mock interviews: I practiced with friends and online tutors\n6. Watching English content: Movies, TV shows, and YouTube videos helped improve my fluency\n\nDuring the test, I made sure to speak confidently and elaborate on my answers without going off-topic. When I didn't know something, I was honest but tried to redirect the conversation to something related that I could talk about.\n\nRemember that the examiner is assessing your language skills, not your knowledge on every topic. Good luck with your test!",
      author: {
        id: "user-4",
        name: "Anh Nguyen",
        username: "anhnguyen",
        image: "/placeholder.svg?height=40&width=40",
      },
      createdAt: "2023-06-05T09:15:00.000Z",
      likesCount: 56,
      commentsCount: 15,
      tags: ["IELTS", "Language Test", "Speaking Tips"],
      image: null,
      isPinned: false,
      liked: false,
      saved: false,
    },
    {
      id: "post-4",
      title: "Scholarship Interview Success: My Fulbright Experience",
      excerpt: "How I prepared for and succeeded in my Fulbright scholarship interview.",
      content:
        "The Fulbright scholarship interview was one of the most challenging yet rewarding experiences in my academic journey. Here's how I approached it:\n\n1. Research: I thoroughly researched the Fulbright program, its values, and its mission\n2. Personal statement review: I reviewed my application materials to ensure consistency\n3. Current events: I stayed updated on relations between my country and the US\n4. Practice interviews: I conducted multiple mock interviews with professors\n5. Cultural preparation: I thought about how to represent my culture and its values\n\nDuring the interview, the panel asked about my research proposal, why I chose the US for my studies, how I would contribute to cultural exchange, and my plans after completing the program.\n\nThe key to my success was demonstrating genuine passion for my field and a clear vision of how the Fulbright experience would help me make a positive impact in my home country.\n\nIf you're preparing for a scholarship interview, remember that they're looking for not just academic excellence but also cultural ambassadors.",
      author: {
        id: "user-5",
        name: "Miguel Rodriguez",
        username: "miguelr",
        image: "/placeholder.svg?height=40&width=40",
      },
      createdAt: "2023-05-28T16:45:00.000Z",
      likesCount: 72,
      commentsCount: 21,
      tags: ["Scholarship", "Fulbright", "Interview Tips"],
      image: "/placeholder.svg?height=400&width=600",
      isPinned: false,
      liked: false,
      saved: true,
    },
    {
      id: "post-5",
      title: "Dealing with Culture Shock: My First Month in Germany",
      excerpt: "The challenges I faced and how I overcame culture shock when I started studying in Germany.",
      content:
        "When I arrived in Germany for my master's program, I experienced significant culture shock despite all my preparation. Here's what I found challenging and how I adapted:\n\n1. Language barrier: Even with basic German skills, daily communication was difficult\n2. Different academic expectations: The German university system emphasizes independent learning\n3. Administrative procedures: Dealing with bureaucracy was overwhelming\n4. Social norms: Understanding unwritten social rules took time\n5. Homesickness: Missing familiar food, friends, and family was harder than expected\n\nWhat helped me adjust:\n\n1. Joining international student groups\n2. Finding a language tandem partner\n3. Establishing a routine\n4. Exploring my new city\n5. Staying connected with home while making an effort to integrate\n\nAfter about a month, things started feeling more normal. Now, six months in, I've made good friends and feel much more comfortable navigating daily life.\n\nIf you're about to study abroad, expect some adjustment difficulties but know that they're temporary. Be patient with yourself and open to new experiences.",
      author: {
        id: "user-6",
        name: "Li Wei",
        username: "liwei",
        image: "/placeholder.svg?height=40&width=40",
      },
      createdAt: "2023-05-20T11:30:00.000Z",
      likesCount: 63,
      commentsCount: 18,
      tags: ["Culture Shock", "Germany", "Adjustment Tips"],
      image: "/placeholder.svg?height=400&width=600",
      isPinned: false,
      liked: true,
      saved: false,
    },
    {
      id: "post-6",
      title: "5 Common Mistakes to Avoid in Your Study Abroad Application",
      excerpt: "Learn from my experience and avoid these pitfalls in your applications.",
      content:
        "After going through multiple study abroad applications (and helping friends with theirs), I've noticed these common mistakes that can hurt your chances:\n\n1. Generic personal statements: Tailoring your statement to each university is crucial\n2. Missing deadlines: Create a timeline with all important dates\n3. Poor research about the program: Show that you understand what makes this program unique\n4. Neglecting recommendation letters: Choose recommenders who know you well and brief them properly\n5. Overlooking language requirements: Start preparing for language tests early\n\nThe most successful applications demonstrate a clear fit between your goals and what the program offers. Take time to research each university and program thoroughly.\n\nAlso, don't underestimate the importance of proofreading! Small errors can create a negative impression about your attention to detail.\n\nStart your applications early to give yourself time to revise and improve them. Good luck!",
      author: {
        id: "user-7",
        name: "Sarah Johnson",
        username: "sarahj",
        image: "/placeholder.svg?height=40&width=40",
      },
      createdAt: "2023-05-15T13:20:00.000Z",
      likesCount: 85,
      commentsCount: 24,
      tags: ["Application Tips", "Study Abroad", "Common Mistakes"],
      image: null,
      isPinned: false,
      liked: false,
      saved: false,
    },
    {
      id: "post-7",
      title: "How to Budget for Your Study Abroad Experience",
      excerpt: "Financial planning tips to help you manage your money while studying overseas.",
      content:
        "One of the biggest challenges of studying abroad is managing your finances. Here's how I budgeted for my year in Canada:\n\n1. Research all costs: Beyond tuition, consider housing, food, transportation, insurance, visa fees, and emergency funds\n2. Create a detailed budget: I used a spreadsheet to track all expected expenses\n3. Look for scholarships: I applied to over 15 scholarships and received two\n4. Consider part-time work: Check if your visa allows for working and plan accordingly\n5. Open a local bank account: This saved me money on international transaction fees\n6. Use student discounts: Always carry your student ID for discounts\n7. Cook at home: Eating out was my biggest unnecessary expense\n\nI also recommend setting up a financial cushion for unexpected expenses. During my year abroad, I had to replace my laptop when it broke, which I hadn't planned for.\n\nTracking your spending is crucial. I used a budgeting app to categorize my expenses and identify areas where I could cut back.\n\nWith careful planning, studying abroad can be affordable and you can avoid the stress of financial worries.",
      author: {
        id: "user-8",
        name: "Carlos Mendoza",
        username: "carlosm",
        image: "/placeholder.svg?height=40&width=40",
      },
      createdAt: "2023-05-10T10:15:00.000Z",
      likesCount: 79,
      commentsCount: 31,
      tags: ["Budgeting", "Financial Tips", "Study Abroad"],
      image: "/placeholder.svg?height=400&width=600",
      isPinned: false,
      liked: false,
      saved: false,
    },
    {
      id: "post-8",
      title: "My Experience with the German Student Visa Process",
      excerpt: "A step-by-step guide to navigating the German student visa application.",
      content:
        "The German student visa process can seem complicated, but with proper preparation, it's manageable. Here's my experience:\n\n1. Acceptance letter: First, I secured admission to a German university\n2. Blocked account: I opened a blocked account with Deutsche Bank and deposited the required amount (currently €11,208)\n3. Health insurance: I purchased German health insurance for students\n4. Visa appointment: I scheduled an appointment at the German embassy (do this early as slots fill up quickly)\n5. Application form: I completed the National Visa application form\n6. Required documents: I gathered passport, photos, acceptance letter, blocked account certificate, health insurance proof, CV, and motivation letter\n7. Interview: My visa interview was brief and focused on my study plans and financial means\n\nThe entire process took about 6 weeks from application to receiving my visa. The most time-consuming part was opening the blocked account, so start that process early.\n\nDuring the interview, be clear about your intentions to return to your home country after your studies. The visa officer wants to ensure you're a genuine student with temporary migration intentions.\n\nGood luck with your application!",
      author: {
        id: "user-9",
        name: "Priya Sharma",
        username: "priyas",
        image: "/placeholder.svg?height=40&width=40",
      },
      createdAt: "2023-05-05T14:40:00.000Z",
      likesCount: 67,
      commentsCount: 19,
      tags: ["German Visa", "Visa Process", "Study in Germany"],
      image: "/placeholder.svg?height=400&width=600",
      isPinned: false,
      liked: true,
      saved: true,
    },
    {
      id: "post-9",
      title: "How I Improved My TOEFL Score from 90 to 110",
      excerpt: "The strategies and resources that helped me significantly boost my TOEFL score.",
      content:
        "After scoring 90 on my first TOEFL attempt (which wasn't enough for my target universities), I changed my approach and improved to 110. Here's what worked:\n\n1. Targeted practice: Instead of general English practice, I focused specifically on TOEFL-style questions\n2. Section-by-section approach: I identified my weakest sections (speaking and writing) and dedicated more time to them\n3. Timed practice: I always practiced under timed conditions to build stamina and speed\n4. Note-taking skills: I developed a personal shorthand system for the listening and speaking sections\n5. Template development: For writing and speaking, I created flexible templates to organize my responses\n6. Vocabulary expansion: I built a vocabulary list specific to common TOEFL topics\n7. Regular review: I reviewed my mistakes weekly and focused on understanding why I got things wrong\n\nThe resources that helped me most were the Official TOEFL Guide, TOEFL practice tests from ETS, and NoteFull's YouTube videos. I also joined a study group where we practiced speaking with each other.\n\nFor the speaking section specifically, recording myself and listening back was uncomfortable but extremely effective. It helped me identify issues with my pronunciation, pacing, and organization.\n\nIf you're preparing for the TOEFL, give yourself at least 2-3 months of consistent practice. Taking the test multiple times is also an option if your schedule and budget allow for it.\n\nGood luck with your preparation!",
      author: {
        id: "user-10",
        name: "Ahmed Hassan",
        username: "ahmedh",
        image: "/placeholder.svg?height=40&width=40",
      },
      createdAt: "2023-04-28T09:30:00.000Z",
      likesCount: 94,
      commentsCount: 27,
      tags: ["TOEFL", "Language Test", "Score Improvement"],
      image: null,
      isPinned: false,
      liked: false,
      saved: false,
    },
    {
      id: "post-10",
      title: "Preparing for a Scholarship Interview: Do's and Don'ts",
      excerpt: "Lessons learned from my successful Chevening Scholarship interview.",
      content:
        "After successfully going through the Chevening Scholarship interview process, here are my top do's and don'ts:\n\nDO:\n1. Research the scholarship values and align your answers with them\n2. Prepare concrete examples that demonstrate your leadership and networking skills\n3. Be clear about your career plan and how the scholarship fits into it\n4. Know your proposed course of study inside out\n5. Practice with mock interviews, especially with challenging questions\n6. Show enthusiasm for both your field and the opportunity\n\nDON'T:\n1. Memorize scripted answers - they sound unnatural\n2. Exaggerate your achievements - authenticity matters\n3. Focus only on how the scholarship benefits you personally\n4. Underestimate questions about returning to your home country\n5. Forget to research the host country's culture and current affairs\n6. Rush your answers - take a moment to gather your thoughts\n\nThe interview panel is looking for candidates who will be good ambassadors and who have a clear vision for how they'll use their education to make an impact.\n\nI found that telling a coherent story about my past experiences, current goals, and future plans made my interview much stronger. Good luck!",
      author: {
        id: "user-11",
        name: "Grace Okafor",
        username: "graceo",
        image: "/placeholder.svg?height=40&width=40",
      },
      createdAt: "2023-04-20T15:15:00.000Z",
      likesCount: 88,
      commentsCount: 23,
      tags: ["Scholarship", "Interview Tips", "Chevening"],
      image: "/placeholder.svg?height=400&width=600",
      isPinned: false,
      liked: false,
      saved: false,
    },
  ]

  // Calculate start and end indices for pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  return posts.slice(startIndex, endIndex)
}

// Mock post by ID
export function getMockPostById(id: string) {
  const allPosts = getMockPosts(1, 100)
  return allPosts.find((post) => post.id === id) || null
}

// Mock comments for a post
export function getMockComments(postId: string) {
  const comments = [
    {
      id: "comment-1",
      postId: "post-1",
      author: {
        id: "user-3",
        name: "James Wilson",
        username: "jameswilson",
        image: "/placeholder.svg?height=40&width=40",
      },
      content:
        "This is really helpful! I have my visa interview next week and was feeling nervous. Your tips have given me more confidence.",
      createdAt: "2023-06-15T14:30:00.000Z",
      likesCount: 5,
      liked: false,
      parentId: null,
    },
    {
      id: "comment-2",
      postId: "post-1",
      author: {
        id: "user-5",
        name: "Miguel Rodriguez",
        username: "miguelr",
        image: "/placeholder.svg?height=40&width=40",
      },
      content: "Did they ask you about your financial situation? That's what I'm most worried about for my interview.",
      createdAt: "2023-06-15T15:45:00.000Z",
      likesCount: 3,
      liked: true,
      parentId: null,
    },
    {
      id: "comment-3",
      postId: "post-1",
      author: {
        id: "user-2",
        name: "Emily Chen",
        username: "emilychen",
        image: "/placeholder.svg?height=40&width=40",
      },
      content:
        "Yes, they did ask about finances. Make sure you have your bank statements and sponsorship letters ready. They want to see that you can support yourself without working illegally.",
      createdAt: "2023-06-15T16:20:00.000Z",
      likesCount: 7,
      liked: false,
      parentId: "comment-2",
    },
    {
      id: "comment-4",
      postId: "post-1",
      author: {
        id: "user-6",
        name: "Li Wei",
        username: "liwei",
        image: "/placeholder.svg?height=40&width=40",
      },
      content: "How early did you arrive for your appointment? I've heard some embassies have long security lines.",
      createdAt: "2023-06-16T09:10:00.000Z",
      likesCount: 2,
      liked: false,
      parentId: null,
    },
    {
      id: "comment-5",
      postId: "post-1",
      author: {
        id: "user-2",
        name: "Emily Chen",
        username: "emilychen",
        image: "/placeholder.svg?height=40&width=40",
      },
      content:
        "I arrived about 45 minutes early and that was perfect. There was a security check and then waiting in line for document verification before the actual interview.",
      createdAt: "2023-06-16T10:05:00.000Z",
      likesCount: 4,
      liked: true,
      parentId: "comment-4",
    },
    {
      id: "comment-6",
      postId: "post-2",
      author: {
        id: "user-4",
        name: "Anh Nguyen",
        username: "anhnguyen",
        image: "/placeholder.svg?height=40&width=40",
      },
      content:
        "I had a UK university interview last month and they asked me all of these questions! Wish I had seen this post earlier.",
      createdAt: "2023-06-10T18:30:00.000Z",
      likesCount: 6,
      liked: false,
      parentId: null,
    },
    {
      id: "comment-7",
      postId: "post-2",
      author: {
        id: "user-7",
        name: "Sarah Johnson",
        username: "sarahj",
        image: "/placeholder.svg?height=40&width=40",
      },
      content:
        "For my Oxford interview, they also asked me to analyze a text on the spot. It was stressful but actually quite interesting!",
      createdAt: "2023-06-11T11:15:00.000Z",
      likesCount: 8,
      liked: true,
      parentId: null,
    },
  ]

  return comments.filter((comment) => comment.postId === postId)
}

// Mock featured posts
export function getMockFeaturedPosts() {
  return [
    {
      id: "post-1",
      title: "My Experience with US Student Visa Interview",
      excerpt: "I recently had my F-1 visa interview and wanted to share some tips that helped me succeed.",
      category: "Visa Interview",
      image: "/placeholder.svg?height=600&width=1200",
    },
    {
      id: "post-4",
      title: "Scholarship Interview Success: My Fulbright Experience",
      excerpt: "How I prepared for and succeeded in my Fulbright scholarship interview.",
      category: "Scholarship",
      image: "/placeholder.svg?height=600&width=1200",
    },
    {
      id: "post-9",
      title: "How I Improved My TOEFL Score from 90 to 110",
      excerpt: "The strategies and resources that helped me significantly boost my TOEFL score.",
      category: "Language Test",
      image: "/placeholder.svg?height=600&width=1200",
    },
  ]
}

// Mock related posts
export function getMockRelatedPosts(currentPostId: string) {
  const allPosts = getMockPosts(1, 100)
  const currentPost = allPosts.find((post) => post.id === currentPostId)

  if (!currentPost) return []

  // Find posts with similar tags
  const relatedPosts = allPosts
    .filter((post) => post.id !== currentPostId)
    .filter((post) => post.tags.some((tag) => currentPost.tags.includes(tag)))
    .slice(0, 3)

  return relatedPosts
}

// Mock user posts
export function getMockUserPosts(username: string, page = 1, limit = 5) {
  const allPosts = getMockPosts(1, 100)
  const userPosts = allPosts.filter((post) => post.author.username === username)

  // Calculate start and end indices for pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  return userPosts.slice(startIndex, endIndex)
}

// Mock user saved posts
export function getMockUserSavedPosts(username: string, page = 1, limit = 5) {
  const allPosts = getMockPosts(1, 100)
  const savedPosts = allPosts.filter((post) => post.saved)

  // Calculate start and end indices for pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  return savedPosts.slice(startIndex, endIndex)
}

// Mock resources
export function getMockResources() {
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
      description: "Learn how to prepare for academic interviews at UK universities with this detailed guide.",
      type: "pdf",
      author: "James Wilson",
      tags: ["University Interview", "UK Study", "Admission Tips"],
    },
    {
      id: "resource-3",
      title: "IELTS Speaking Practice Videos",
      description: "A series of video lessons and practice exercises to help you prepare for the IELTS speaking test.",
      type: "video",
      author: "Anh Nguyen",
      tags: ["IELTS", "Language Test", "Speaking Tips"],
    },
    {
      id: "resource-4",
      title: "Scholarship Interview Simulator",
      description: "An interactive tool that simulates scholarship interviews with common questions and feedback.",
      type: "link",
      author: "Miguel Rodriguez",
      tags: ["Scholarship", "Interview Tips", "Preparation"],
    },
    {
      id: "resource-5",
      title: "Cultural Adjustment Guide for International Students",
      description: "Tips and strategies for dealing with culture shock and adapting to life in a new country.",
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
  ]
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
  ]
}

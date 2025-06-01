import { v4 as uuidv4 } from "uuid";
import { Pool } from "pg";
import OpenAI from "openai";
import { config } from "@/lib/config";

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "thuan286",
  database: "postgres",
});

// Interface for input JSON (as provided)
interface Comment {
  name: string;
  nickname: string;
  comment: string;
  replies: Comment[];
}

// Interface for input to the function
interface Comments {
  postId: string;
  commentsJson: Comment[];
}

// Interface for user (for internal use)
interface User {
  id: string;
  username: string;
  email: string;
  name: string;
}

async function openAiGenerateComments(
  postId: string,
  postTitle: string,
  postContent: string
): Promise<{ commentsJson: Comment[] }> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant that generates comments for a post based on the post title and content. The comments should be in Vietnamese.`,
      },
      {
        role: "user",
        content: `Generate 3 comments with replies for the post ${postTitle} with the content ${postContent}.
        Return the comments in JSON format: 
        commentsJson: [
          {
            name: string;
            nickname: string;
            comment: string;
            replies: [
              {
                name: string;
                nickname: string;
                comment: string;
                replies: []
              }
            ];
          }
        ]
        The comments should be in Vietnamese. 
        Comment should maintaining a natural, serious, and supportive tone, and related to the context of the post.
        Name should be popular Vietnamese real names.
        Nickname should be alphabet characters only.
        `,
      },
    ],
    response_format: { type: "json_object" },
  });
  const content = response.choices[0].message.content || "";
  const json = JSON.parse(content);
  return json;
}

// Function to generate a unique username and email from name and nickname
function generateUserDetails(name: string, nickname: string): User {
  const username = nickname.toLowerCase().replace(/[^a-z0-9_]/g, "_");
  const email = `${username}@example.com`;
  return { id: uuidv4(), username, email, name };
}

// Function to check if user exists (mock implementation)
// In a real application, query the database to check if username or email exists
async function getUser(email: string): Promise<User | null> {
  const client = await pool.connect();
  const res = await client.query(
    `SELECT * FROM public.users WHERE email = '${email}'`
  );
  client.release();
  return res.rows[0] as User | null;
}

// Function to create a new user and return SQL INSERT statement
function createUserSQL(user: User, rankId: string): string {
  return `
    INSERT INTO public.users
    (id, username, email, "name", image_url, bio, "location", "role", rank_id, password_hash, is_bot)
    VALUES ('${user.id}', '${user.username}', '${user.email}', '${user.name}', '', '', '', 'user'::character varying, '${rankId}', 'hashed_password', true);
  `;
}

// Function to create a comment SQL INSERT statement
function createCommentSQL(
  id: string,
  content: string,
  postId: string,
  userId: string,
  parentId: string | null
): string {
  const escapedContent = content.replace(/'/g, "''"); // Escape single quotes for SQL
  const parentIdValue = parentId ? `'${parentId}'` : "NULL";
  return `
    INSERT INTO public."comments"
    (id, post_id, user_id, parent_id, "content")
    VALUES ('${id}', '${postId}', '${userId}', ${parentIdValue}, '${escapedContent}');
  `;
}

const getRank = async () => {
  const client = await pool.connect();
  const res = await client.query(
    `SELECT id FROM user_ranks WHERE name = 'Recruit'`
  );
  client.release();
  return res.rows[0] as { id: string };
};

// Function to process comments and generate SQL
async function generateCommentInserts(input: Comments): Promise<string[]> {
  const { postId, commentsJson } = input;
  const sqlStatements: string[] = [];
  const rank = await getRank();
  const admin = await getUser("admin@admin.com");

  if (!admin) {
    throw new Error("Admin user not found");
  }

  // Process each comment and its replies
  for (const comment of commentsJson) {
    // Create or check user for main comment
    const user = generateUserDetails(comment.name, comment.nickname);
    const userExists = await getUser(user.email);

    if (!userExists) {
      sqlStatements.push(createUserSQL(user, rank.id));
    }

    // Generate comment ID and add main comment SQL
    const commentId = uuidv4();
    sqlStatements.push(
      createCommentSQL(
        commentId,
        comment.comment,
        postId,
        userExists?.id || user.id,
        null
      )
    );

    // Process replies
    for (const reply of comment.replies) {
      // Add reply SQL with parent_id referencing the main comment
      sqlStatements.push(
        createCommentSQL(uuidv4(), reply.comment, postId, admin?.id, commentId)
      );
    }
  }

  return sqlStatements;
}

async function getPost(postId: string) {
  const client = await pool.connect();
  const res = await client.query(
    `SELECT id, title, content FROM public.posts WHERE id = '${postId}'`
  );
  client.release();
  return res.rows[0] as {
    id: string;
    title: { vi: string; en: string };
    content: { vi: string; en: string };
  };
}

// Example usage
export async function generateComments(postId: string): Promise<boolean> {
  const post = await getPost(postId);

  const input = await openAiGenerateComments(
    postId,
    post.title.vi,
    post.content.vi
  );

  const sqlStatements = await generateCommentInserts({
    postId,
    commentsJson: input.commentsJson,
  });

  console.log("Generated SQL Statements:");
  await pool.query("BEGIN");
  try {
    for (const sql of sqlStatements) {
      await pool.query(sql);
    }
    await pool.query("COMMIT");
  } catch (error) {
    console.error("Error executing SQL statements:", error);
    await pool.query("ROLLBACK");
    throw error;
  }
  return true;
}

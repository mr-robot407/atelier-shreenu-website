import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({
  region: process.env.BLOG_REGION ?? "ap-south-1",
  ...(process.env.BLOG_ACCESS_KEY_ID
    ? {
        credentials: {
          accessKeyId: process.env.BLOG_ACCESS_KEY_ID,
          secretAccessKey: process.env.BLOG_SECRET_ACCESS_KEY!,
        },
      }
    : {}),
});
const db = DynamoDBDocumentClient.from(client);
const TABLE = process.env.DYNAMODB_TABLE_NAME ?? "atelier-shreenu-blog-posts";

export type Post = {
  postId: string;
  createdAt: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  status: "draft" | "published";
  publishedAt?: string;
  tags?: string[];
};

export type CreatePostInput = Omit<Post, "postId" | "createdAt">;
export type UpdatePostInput = Partial<Omit<Post, "postId" | "createdAt">>;

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const postId = randomUUID();
  const createdAt = new Date().toISOString();
  const slug = input.slug || slugify(input.title);
  const post: Post = { ...input, postId, createdAt, slug };
  await db.send(new PutCommand({ TableName: TABLE, Item: post }));
  return post;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const result = await db.send(
    new ScanCommand({
      TableName: TABLE,
      FilterExpression: "#slug = :slug",
      ExpressionAttributeNames: { "#slug": "slug" },
      ExpressionAttributeValues: { ":slug": slug },
    })
  );
  return (result.Items?.[0] as Post) ?? null;
}

export async function getPostById(
  postId: string,
  createdAt: string
): Promise<Post | null> {
  const result = await db.send(
    new GetCommand({ TableName: TABLE, Key: { postId, createdAt } })
  );
  return (result.Item as Post) ?? null;
}

export async function listPublishedPosts(): Promise<Post[]> {
  const result = await db.send(
    new QueryCommand({
      TableName: TABLE,
      IndexName: "status-publishedAt-index",
      KeyConditionExpression: "#status = :status",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: { ":status": "published" },
      ScanIndexForward: false,
    })
  );
  return (result.Items as Post[]) ?? [];
}

export async function listAllPosts(): Promise<Post[]> {
  const result = await db.send(
    new ScanCommand({
      TableName: TABLE,
    })
  );
  const posts = (result.Items as Post[]) ?? [];
  return posts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function updatePost(
  postId: string,
  createdAt: string,
  updates: UpdatePostInput
): Promise<void> {
  const entries = Object.entries(updates).filter(([, v]) => v !== undefined);
  if (!entries.length) return;

  const ExpressionAttributeNames: Record<string, string> = {};
  const ExpressionAttributeValues: Record<string, unknown> = {};
  const setParts: string[] = [];

  for (const [key, value] of entries) {
    ExpressionAttributeNames[`#${key}`] = key;
    ExpressionAttributeValues[`:${key}`] = value;
    setParts.push(`#${key} = :${key}`);
  }

  await db.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { postId, createdAt },
      UpdateExpression: `SET ${setParts.join(", ")}`,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    })
  );
}

export async function deletePost(
  postId: string,
  createdAt: string
): Promise<void> {
  await db.send(
    new DeleteCommand({ TableName: TABLE, Key: { postId, createdAt } })
  );
}

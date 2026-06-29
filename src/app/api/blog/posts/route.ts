import { NextResponse } from "next/server";
import { listPublishedPosts } from "@/lib/dynamodb";

export async function GET() {
  const posts = await listPublishedPosts();
  return NextResponse.json(posts);
}

import { NextResponse } from "next/server";
import { listPublishedPosts } from "@/lib/dynamodb";

export const dynamic = "force-dynamic";

export async function GET() {
  const posts = await listPublishedPosts();
  return NextResponse.json(posts);
}

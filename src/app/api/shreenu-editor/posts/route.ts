import { NextRequest, NextResponse } from "next/server";
import { listAllPosts, createPost } from "@/lib/dynamodb";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    await requireAuth();
    const posts = await listAllPosts();
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth();
    const body = await req.json();
    const post = await createPost(body);
    return NextResponse.json(post, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    if (msg === "Unauthorized")
      return NextResponse.json({ error: msg }, { status: 401 });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

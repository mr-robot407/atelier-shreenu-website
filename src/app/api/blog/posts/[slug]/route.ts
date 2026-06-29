import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/dynamodb";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const post = await getPostBySlug(params.slug);
  if (!post || post.status !== "published") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(post);
}

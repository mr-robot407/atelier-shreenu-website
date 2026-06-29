import { NextRequest, NextResponse } from "next/server";
import { getPresignedUploadUrl } from "@/lib/s3";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("filename") ?? "image.jpg";
    const contentType = searchParams.get("contentType") ?? "image/jpeg";
    const urls = await getPresignedUploadUrl(filename, contentType);
    return NextResponse.json(urls);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

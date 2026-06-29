import { NextRequest, NextResponse } from "next/server";
import { getPresignedUploadUrl } from "@/lib/s3";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("filename") ?? "image.jpg";
    const contentType = searchParams.get("contentType") ?? "image/jpeg";
    const urls = await getPresignedUploadUrl(filename, contentType);
    return NextResponse.json(urls);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Upload error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

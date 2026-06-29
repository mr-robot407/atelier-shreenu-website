import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    BLOG_REGION: process.env.BLOG_REGION ?? "MISSING",
    BLOG_ACCESS_KEY_ID: process.env.BLOG_ACCESS_KEY_ID
      ? `set (${process.env.BLOG_ACCESS_KEY_ID.slice(0, 8)}...)`
      : "MISSING",
    BLOG_SECRET_ACCESS_KEY: process.env.BLOG_SECRET_ACCESS_KEY ? "set" : "MISSING",
    DYNAMODB_TABLE_NAME: process.env.DYNAMODB_TABLE_NAME ?? "MISSING",
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME ?? "MISSING",
    NEXT_PUBLIC_CDN_URL: process.env.NEXT_PUBLIC_CDN_URL ?? "MISSING",
  });
}

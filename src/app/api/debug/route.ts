import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    // Amplify env vars
    BLOG_REGION: process.env.BLOG_REGION ?? "MISSING",
    BLOG_ACCESS_KEY_ID: process.env.BLOG_ACCESS_KEY_ID
      ? `set (${process.env.BLOG_ACCESS_KEY_ID.slice(0, 8)}...)`
      : "MISSING",
    BLOG_SECRET_ACCESS_KEY: process.env.BLOG_SECRET_ACCESS_KEY ? "set" : "MISSING",
    DYNAMODB_TABLE_NAME: process.env.DYNAMODB_TABLE_NAME ?? "MISSING",
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME ?? "MISSING",
    NEXT_PUBLIC_CDN_URL: process.env.NEXT_PUBLIC_CDN_URL ?? "MISSING",

    // AWS Lambda execution environment — tells us if we're in real Lambda
    AWS_EXECUTION_ENV: process.env.AWS_EXECUTION_ENV ?? "MISSING",
    AWS_LAMBDA_FUNCTION_NAME: process.env.AWS_LAMBDA_FUNCTION_NAME ?? "MISSING",
    AWS_REGION: process.env.AWS_REGION ?? "MISSING",
    // container credential URI is how Lambda provides execution role creds to the SDK
    AWS_CONTAINER_CREDENTIALS_RELATIVE_URI: process.env.AWS_CONTAINER_CREDENTIALS_RELATIVE_URI
      ? "set"
      : "MISSING",
    AWS_CONTAINER_CREDENTIALS_FULL_URI: process.env.AWS_CONTAINER_CREDENTIALS_FULL_URI
      ? "set"
      : "MISSING",
  });
}

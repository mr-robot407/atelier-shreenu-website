import { NextResponse } from "next/server";
import { awsRegion, awsAccessKeyId, dynamodbTableName, s3BucketName, cdnUrl } from "@/lib/aws-runtime-config";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    // Values from aws-runtime-config (baked at build time by amplify.yml)
    config_region: awsRegion,
    config_access_key: awsAccessKeyId ? `set (${awsAccessKeyId.slice(0, 8)}...)` : "MISSING",
    config_table: dynamodbTableName,
    config_bucket: s3BucketName,
    config_cdn: cdnUrl,

    // Raw Lambda runtime env (always missing in Amplify managed Lambda)
    env_BLOG_REGION: process.env.BLOG_REGION ?? "MISSING",
    env_BLOG_ACCESS_KEY_ID: process.env.BLOG_ACCESS_KEY_ID ? "set" : "MISSING",

    // Lambda identity
    AWS_EXECUTION_ENV: process.env.AWS_EXECUTION_ENV ?? "MISSING",
    AWS_REGION: process.env.AWS_REGION ?? "MISSING",
  });
}

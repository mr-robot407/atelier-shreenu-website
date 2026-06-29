import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { awsRegion, awsAccessKeyId, awsSecretAccessKey, s3BucketName, cdnUrl } from "./aws-runtime-config";

const s3 = new S3Client({
  region: awsRegion,
  ...(awsAccessKeyId
    ? {
        credentials: {
          accessKeyId: awsAccessKeyId,
          secretAccessKey: awsSecretAccessKey,
        },
      }
    : {}),
});
const BUCKET = s3BucketName;
const CDN = cdnUrl;

export async function getPresignedUploadUrl(
  filename: string,
  contentType: string
): Promise<{ uploadUrl: string; publicUrl: string }> {
  const ext = filename.split(".").pop();
  const key = `blog/${randomUUID()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
  const publicUrl = `${CDN}/${key}`;

  return { uploadUrl, publicUrl };
}

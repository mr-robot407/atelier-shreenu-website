// Placeholder for local dev — overwritten by amplify.yml preBuild in production
export const awsRegion = process.env.BLOG_REGION ?? "ap-south-1";
export const awsAccessKeyId = process.env.BLOG_ACCESS_KEY_ID ?? "";
export const awsSecretAccessKey = process.env.BLOG_SECRET_ACCESS_KEY ?? "";
export const dynamodbTableName = process.env.DYNAMODB_TABLE_NAME ?? "atelier-shreenu-blog-posts";
export const s3BucketName = process.env.S3_BUCKET_NAME ?? "atelier-shreenu-blog-images";
export const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL ?? "https://d3j5o298uybf9b.cloudfront.net";
export const contactTableName = process.env.CONTACT_TABLE_NAME ?? "atelier-shreenu-contact-submissions";

// Thin wrapper for invoking the as-email-funnel Lambda from Next.js.
// Used by /api/booking/* routes to reach the studio's booking + calendar flow.

import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import {
  awsRegion,
  awsAccessKeyId,
  awsSecretAccessKey,
} from "./aws-runtime-config";

const credentials = awsAccessKeyId
  ? { accessKeyId: awsAccessKeyId, secretAccessKey: awsSecretAccessKey }
  : undefined;

const client = new LambdaClient({
  region: awsRegion,
  ...(credentials ? { credentials } : {}),
});

const FUNNEL_FUNCTION = process.env.FUNNEL_FUNCTION_NAME ?? "as-email-funnel";

export async function invokeFunnel(payload: Record<string, unknown>): Promise<{
  statusCode: number;
  body: unknown;
}> {
  const resp = await client.send(
    new InvokeCommand({
      FunctionName: FUNNEL_FUNCTION,
      InvocationType: "RequestResponse",
      Payload: Buffer.from(JSON.stringify(payload)),
    }),
  );
  if (resp.FunctionError) {
    const errText = new TextDecoder().decode(resp.Payload);
    throw new Error(`funnel lambda error: ${errText}`);
  }
  const text = new TextDecoder().decode(resp.Payload);
  const parsed = JSON.parse(text);
  const statusCode: number =
    typeof parsed.statusCode === "number" ? parsed.statusCode : 500;
  let body: unknown = parsed.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      // leave as string
    }
  }
  return { statusCode, body };
}

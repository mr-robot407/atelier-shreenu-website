import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { cookies } from "next/headers";

const cognito = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_COGNITO_REGION,
});

const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
const POOL_ID = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!;
const REGION = process.env.NEXT_PUBLIC_COGNITO_REGION!;

export const COOKIE_NAME = "blog_token";

const JWKS = createRemoteJWKSet(
  new URL(
    `https://cognito-idp.${REGION}.amazonaws.com/${POOL_ID}/.well-known/jwks.json`
  )
);

export type LoginResult =
  | { type: "success"; idToken: string }
  | { type: "new_password_required"; session: string; email: string }
  | { type: "error"; message: string };

export async function loginWithCognito(
  email: string,
  password: string
): Promise<LoginResult> {
  try {
    const res = await cognito.send(
      new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: CLIENT_ID,
        AuthParameters: { USERNAME: email, PASSWORD: password },
      })
    );

    if (res.ChallengeName === "NEW_PASSWORD_REQUIRED") {
      return { type: "new_password_required", session: res.Session!, email };
    }

    return { type: "success", idToken: res.AuthenticationResult!.IdToken! };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Login failed";
    return { type: "error", message: msg };
  }
}

export async function setNewPassword(
  email: string,
  newPassword: string,
  session: string
): Promise<LoginResult> {
  try {
    const res = await cognito.send(
      new RespondToAuthChallengeCommand({
        ChallengeName: "NEW_PASSWORD_REQUIRED",
        ClientId: CLIENT_ID,
        ChallengeResponses: { USERNAME: email, NEW_PASSWORD: newPassword },
        Session: session,
      })
    );

    return { type: "success", idToken: res.AuthenticationResult!.IdToken! };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to set password";
    return { type: "error", message: msg };
  }
}

export async function verifyToken(
  token: string
): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://cognito-idp.${REGION}.amazonaws.com/${POOL_ID}`,
    });
    return { email: payload.email as string };
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<{ email: string }> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) throw new Error("Unauthorized");
  const user = await verifyToken(token);
  if (!user) throw new Error("Unauthorized");
  return user;
}

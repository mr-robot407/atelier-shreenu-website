// Shared origin allowlist for API routes.
// Production domain, local dev, and (via env) the current Amplify preview URL.

const BASE = [
  "https://ateliershreenu.com",
  "https://www.ateliershreenu.com",
  "http://localhost:3000",
  "http://localhost:3001",
];

// Preview URLs can be supplied via env (comma-separated) so we don't rebuild
// the code every time Amplify changes its default domain.
const EXTRA = (process.env.ALLOWED_PREVIEW_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export const ALLOWED_ORIGINS = [...BASE, ...EXTRA];

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.includes(origin);
}

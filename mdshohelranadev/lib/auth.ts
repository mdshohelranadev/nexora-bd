import { createHash } from "crypto";
import { cookies } from "next/headers";

export const COOKIE = "admin_session";

// Cookie holds a hash derived from the password, never the password itself.
export function sessionToken() {
  const pw = process.env.ADMIN_PASSWORD || "";
  return createHash("sha256").update("shohel:" + pw).digest("hex");
}

export function isAuthed(): boolean {
  if (!process.env.ADMIN_PASSWORD) return false;
  return cookies().get(COOKIE)?.value === sessionToken();
}

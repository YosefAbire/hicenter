import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { homeForRole, type Me, type Role } from "@/lib/api";

const BACKEND_ORIGIN = process.env.SCALA_ORIGIN || process.env.DJANGO_ORIGIN || "http://127.0.0.1:9000";

export async function getMe(): Promise<Me | null> {
  const cookieStore = await cookies();
  const access = cookieStore.get("access_token")?.value;
  if (!access) return null;
  try {
    const response = await fetch(`${BACKEND_ORIGIN}/api/auth/me/`, {
      headers: { Cookie: `access_token=${access}` },
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) return null;
    return (await response.json()) as Me;
  } catch {
    return null;
  }
}

export async function requireUser(role?: Role): Promise<Me> {
  const me = await getMe();
  if (!me) redirect("/login");
  if (role && me.role !== role) redirect(homeForRole(me.role));
  return me;
}

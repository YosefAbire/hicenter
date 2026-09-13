import { redirect } from "next/navigation";

import { homeForRole } from "@/lib/api";
import { getMe } from "@/lib/server-auth";

export default async function HomePage() {
  const me = await getMe();
  if (!me) redirect("/login");
  redirect(homeForRole(me.role));
}

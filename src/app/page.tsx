import { authenticatedUrl, unauthenticatedUrl } from "@/constants";
import { getUserById } from "@/data-access/users";
import { fetchAuthenticatedUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const user = await fetchAuthenticatedUser();
  if (!user) {
    return redirect(unauthenticatedUrl);
  }
  return redirect(authenticatedUrl);
}

import { authenticatedUrl, unauthenticatedUrl } from "@/app-config";
import { getUserById } from "@/data-access/users";
import { fetchAuthenticatedUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const user = await fetchAuthenticatedUser();
  if (!user) {
    return redirect(unauthenticatedUrl);
  }
  const dbUser = await getUserById(user.id);
  if (dbUser?.verifiedAt && dbUser?.onboardedAt) {
    return redirect(authenticatedUrl);
  } else {
    return redirect(unauthenticatedUrl);
  }
}

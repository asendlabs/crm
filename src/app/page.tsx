import { authenticatedUrl, unauthenticatedUrl } from "@/constants";
import { getUserById } from "@/data-access/users";
import { fetchAuthenticatedUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default function RootPage() {
  return redirect(authenticatedUrl);
}

import Landing from "@/components/marketing/Landing";
import { getLoggedInUser } from "@/server/user.server";
import { redirect } from "next/navigation";
export default async function LandingPage() {
  const user = await getLoggedInUser();
  if (user) {
    return redirect("/inbox");
  }
  return <Landing />;
}

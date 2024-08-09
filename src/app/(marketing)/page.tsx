import Landing from "@/components/marketing/Landing";
import { getUser } from "@/server/user.action";
import { redirect } from "next/navigation";
export default async function LandingPage() {
  const user = await getUser();
  if (user) {
    return redirect("/auth");
  }
  return <Landing />;
}

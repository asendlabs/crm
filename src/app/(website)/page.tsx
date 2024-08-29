import Landing from "@/components/marketing/Landing";
import { fetchLogggedInUser } from "@/server/auth";
import { redirect } from "next/navigation";
export default async function LandingPage() {
  const user = await fetchLogggedInUser();
  if (user && user.verifiedAt) {
    return redirect("/home");
  }
  return <Landing />;
}

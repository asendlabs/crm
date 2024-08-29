import { redirect } from "next/navigation";
import { fetchLogggedInUser } from "./user";

export const internalAppAuthRouter = async () => {
  "use server";
  const user = await fetchLogggedInUser();
  if (!user) {
    return redirect("/login");
  }
  if (!user.verifiedAt) {
    return redirect("/verify-email");
  }
  if (!user.onboardedAt) {
    return redirect("/create-profile");
  }
};
export const externalAppAuthRouter = async () => {
  "use server";
  const user = await fetchLogggedInUser();
  if (user && user.verifiedAt && user.onboardedAt) return redirect("/inbox");
};

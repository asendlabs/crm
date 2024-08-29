import { fetchLogggedInUser } from "@/server/auth";
import { redirect } from "next/navigation";

const internalAppAuthGateway = async () => {
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
const externalAppAuthGateway = async () => {
  "use server";
  const user = await fetchLogggedInUser();
  if (user && user.verifiedAt && user.onboardedAt) return redirect("/home");
};

export const authGateways = {
  internalAppAuthGateway,
  externalAppAuthGateway,
};

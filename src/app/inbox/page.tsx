import { LogoutButton } from "@/components/auth/logout-button";
import { getLoggedInUser } from "@/server/user.server";

import { redirect } from "next/navigation";
import React from "react";

async function TmpPage() {
  const user = await getLoggedInUser();
  if (!user) return redirect("/login");
  else if (!user.isVerified) return redirect("/verify");
  else return <>Inbox Page</>;
}

export default TmpPage;

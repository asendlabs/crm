import { LogoutButton } from "@/components/auth/logout-button";
import { svLogout } from "@/server/auth.server";
import { getLoggedInUser } from "@/server/user.server";

import { redirect } from "next/navigation";
import React from "react";

async function TmpPage() {
  const user = await getLoggedInUser();
  if (!user) {
    return redirect("/login");
  }
  if (user && !user.isVerified) {
    const response = await svLogout();
    return redirect("/login");
  }

  return (
    <>
      Inbox Page
      <LogoutButton />
    </>
  );
}

export default TmpPage;

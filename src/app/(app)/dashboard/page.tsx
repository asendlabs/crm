"use server";

import LogoutBtn from "@/components/LogoutBtn";
import React from "react";
import { getUser } from "@/lib/lucia";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) {
    redirect("/signin");
    return;
  }
  return (
    <div>
      <h1>Dashboard</h1>
      <LogoutBtn />
    </div>
  );
}

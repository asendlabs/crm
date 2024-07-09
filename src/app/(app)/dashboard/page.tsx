import { Button } from "@/components/ui/button";
import LogoutBtn from "@/components/LogoutBtn";
import React from "react";

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <LogoutBtn />
      {/* <Button onClick={}>send verify email again</Button> */}
    </div>
  );
}

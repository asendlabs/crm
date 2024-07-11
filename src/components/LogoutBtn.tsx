"use client";

import { Button } from "./ui/button";
import { signOut } from "@/lib/actions/auth.actions";

const LogoutBtn = () => {
  return (
    <div>
      <Button onClick={() => signOut()} variant={"destructive"}>
        Logout
      </Button>
    </div>
  );
};

export default LogoutBtn;

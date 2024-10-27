"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useServerAction } from "zsa-react";

export function ConnectEmailButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleConnectEmail = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  return (
    <Button onClick={handleConnectEmail} disabled={loading}>
      {loading ? "Loading..." : "Connect Email"}
    </Button>
  );
}

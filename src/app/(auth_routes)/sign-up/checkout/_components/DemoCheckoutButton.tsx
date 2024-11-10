"use client";
import { Button } from "@/components/ui/button";
import { setUserCheckoutAction } from "@/server/billing";
import React from "react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";

export function DemoCheckoutButton() {
  const { execute } = useServerAction(setUserCheckoutAction);
  async function handleClick() {
    try {
      const [data, err] = await execute();
      if (err) {
        toast.error(err.message);
      } else {
        toast.success("Checkout Completed");
      }
    } catch (error) {
      toast.error("Something Went Wrong. Failed to complete checkout.");
    }
  }
  return (
    <Button className="h-7" variant="outline" onClick={handleClick}>
      Complete Checkout (DEMO)
    </Button>
  );
}

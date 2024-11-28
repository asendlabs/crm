import React from "react";
import { Card } from "@/components/ui/card";
import { Link } from "next-view-transitions";

type Theme = "system" | "light" | "dark";

export default function BillingPage() {
  return (
    <Card className="flex h-fit w-full flex-col px-8 py-6">
      {/* Header Section */}
      <div className="flex flex-col gap-3 border-b pb-8">
        <h1 className="text-xl font-medium">Billing Settings</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Manage your billing and payment information.
        </p>
      </div>

      {/* Theme Options Section */}
      <div className="flex justify-around py-8">
        {/* Placeholder for theme options */}
      </div>

      {/* Footer Section */}
      <div className="flex flex-col gap-2 border-t pt-6">
        <p className="text-xs text-muted-foreground">
          Need help? Visit our{" "}
          <Link
            href="/help"
            className="text-gray-500 underline hover:text-gray-800"
          >
            Help Center
          </Link>{" "}
          or contact{" "}
          <Link
            href="/support"
            className="text-gray-500 underline hover:text-gray-800"
          >
            Support
          </Link>
        </p>
      </div>
    </Card>
  );
}

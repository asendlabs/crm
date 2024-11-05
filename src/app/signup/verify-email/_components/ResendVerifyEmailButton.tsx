"use client";
import { resendVerifyEmailAction } from "@/server/verify-email";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";

export function ResendVerifyEmailButton() {
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const { execute, data, error } = useServerAction(resendVerifyEmailAction);

  const startTimer = () => {
    setTimer(30); // Initialize timer to 30 seconds
    setLoading(true); // Start loading state
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (loading && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer <= 0) {
      setLoading(false); // Stop loading when timer reaches 0
    }

    return () => {
      if (intervalId) clearInterval(intervalId); // Clean up interval on unmount or timer change
    };
  }, [timer, loading]);

  const handleClick = async () => {
    if (loading) return; // Prevent action if already loading

    startTimer(); // Start timer and loading

    try {
      const [data, err] = await execute(); // Execute async operation

      if (err) {
        toast.error(err.message); // Show error message if there's an error
      }
    } catch (error) {
      toast.error("An unexpected error occurred"); // Handle any unexpected errors
    }
  };

  return (
    <p className="flex gap-1 text-center text-xs font-medium text-gray-600">
      Didn't get the code?
      <span
        className={`cursor-pointer text-gray-900 underline hover:text-black ${loading ? "pointer-events-none opacity-50" : ""}`}
        onClick={handleClick}
      >
        {loading ? `Resend in ${timer}s` : "Click to resend"}
      </span>
    </p>
  );
}

'use client';

import { useEffect, useState } from "react";

import { Loader2 } from "lucide-react";
import { resendCode } from "@/server/auth.action";
import { toast } from "sonner";

export const ResendButton = ({ email }: { email: string }) => {
  const [time, setTime] = useState<number>(30);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [resending, setResending] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
    }

    return () => clearInterval(timer);
  }, [isActive, time]);

  const handleClick = async () => {
    try {
      setResending(true);
      const response = await resendCode(email);
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      if (response.success) {
        setTime(30);
        setIsActive(true);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-row items-center gap-1 text-xs text-gray-400">
      We sent a code to your inbox.
      <button
        onClick={handleClick}
        type="button"
        disabled={isActive || resending}
        className={`font-medium opacity-95 ${
          !isActive
            ? "cursor-pointer text-blue-500 hover:underline"
            : "cursor-not-allowed"
        }`}
      >
        {resending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : isActive ? (
          `Resend in ${time}s`
        ) : (
          "Resend"
        )}
      </button>
    </div>
  );
};

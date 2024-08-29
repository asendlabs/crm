"use client";
import { svLogout } from "@/server/auth";
import { Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const ChangeEmailLink = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <span
      className="visible hidden cursor-pointer flex-row items-center gap-1 underline group-hover:flex"
      onClick={async (e) => {
        e.preventDefault();
        setLoading(true);
        const { success } = await svLogout();
        if (success) {
          router.replace("/signup");
          setLoading(false);
        } else {
          router.refresh();
          toast.error(
            "Internal error, please contact support if the issue persists",
          );
          setLoading(false);
        }
      }}
    >
      {" "}
      {loading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Pencil className="h-3 w-3 hover:text-primary" />
      )}
    </span>
  );
};

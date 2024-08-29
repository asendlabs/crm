'use client';
import { svLogout } from "@/server/server-auth";
import { PenIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {useState} from "react";
import { toast } from "sonner";

const ChangeEmailOnSignUpForms = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <span
      className="flex flex-row gap-1 underline cursor-pointer items-center"
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
      <PenIcon className="h-4 w-4" /> Change Email
    </span>
  );
};

export default ChangeEmailOnSignUpForms;

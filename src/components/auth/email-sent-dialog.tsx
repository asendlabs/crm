import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MailCheck, ArrowUpRight } from "lucide-react"; 
import Link from "next/link";

interface EmailSentDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  formreset: () => void;
  setFormState: (state: number) => void;
}

export const EmailSentDialog = ({
  dialogOpen,
  setDialogOpen,
  formreset,
  setFormState,
}: EmailSentDialogProps) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent
        className="w-96 p-4"
        onInteractOutside={() => {
          setFormState(0);
          formreset();
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            // You might want to handle specific keys if needed
            setFormState(0);
            formreset();
          }
        }}
      >
        <DialogHeader>
          <div className="flex items-center justify-center pt-3">
            <MailCheck className="h-16 w-16 text-green-600" />
          </div>
          <DialogTitle className="py-2 text-center">
            Verification Email Sent
          </DialogTitle>

          <div className="flex w-full flex-col items-center gap-4 pb-4">
            <DialogDescription className="w-full text-center text-[0.8rem] text-muted-foreground">
              Please check your email and click the verification link to
              complete the process. If you didn't receive the email, please
              check your <span className="underline">spam folder</span> or try
              to sign up again.
            </DialogDescription>
            <DialogDescription className="w-full text-center text-[0.8rem] text-muted-foreground">
              If you are still having trouble, please talk to{" "}
              <Link className="underline" href="/support">
                support <ArrowUpRight className="inline-block h-4 w-4" />
              </Link>{" "}
            </DialogDescription>
            <DialogDescription className="text-medium w-full text-center text-[0.85rem] underline">
              You can close this page now.
            </DialogDescription>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

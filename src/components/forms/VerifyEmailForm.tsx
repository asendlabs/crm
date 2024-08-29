"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Loader2, RefreshCw } from "lucide-react";
import { verificationCodeSchema } from "@/schemas/auth.schema";
import { svVerifyEmail } from "@/server/auth";
import { useRouter } from "next/navigation";

export const VerifyEmailForm = ({ email }: { email: string }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof verificationCodeSchema>>({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const { handleSubmit, control, setError } = form;

  // if (!email) {
  //toast.error("Something went wrong, Please logout and login/signup again!");
  //return;
  //}

  const onSubmit = async (data: z.infer<typeof verificationCodeSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await svVerifyEmail(email!, data.code);
      if (!response.success) {
        if (response.code === 401) {
          setError("code", {
            message: "Incorrect code, please check your code and try again",
          });
        } else {
          toast.error(response.message);
        }
      }
      router.replace("/home");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full items-center justify-center gap-2">
            <FormField
              name="code"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter your verification code"
                      className="w-[21rem]"
                      autoComplete="off"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isSubmitting}
              type="button"
              variant="outline"
              className="h-full w-10 p-0 text-muted-foreground hover:text-black"
            >
              <RefreshCw size={16} />
            </Button>
          </div>
          <Button
            disabled={isSubmitting}
            type="submit"
            className="mt-1 w-96 select-none"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify
          </Button>
        </form>
      </Form>
    </div>
  );
};

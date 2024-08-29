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
import { Loader2 } from "lucide-react";
import { verificationCodeValidator } from "@/validators/auth.validator";
import { svVerifyEmail } from "@/server/server-auth";
import { cookies } from "next/headers";
import { useRouter } from "next/navigation";

export const VerifyEmailForm = ({ email }: { email: string }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof verificationCodeValidator>>({
    resolver: zodResolver(verificationCodeValidator),
    defaultValues: {
      code: "",
    },
  });

  const { handleSubmit, control, setError } = form;

  // if (!email) {
    //toast.error("Something went wrong, Please logout and login/signup again!");
    //return;
  //}

  const onSubmit = async (data: z.infer<typeof verificationCodeValidator>) => {
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
      router.replace("/inbox");
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
          <FormField
            name="code"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your verification code"
                    autoComplete="off"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isSubmitting} type="submit" className="mt-1">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify
          </Button>
        </form>
      </Form>
    </div>
  );
};

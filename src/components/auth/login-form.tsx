"use client";

import { loginValidator } from "@/validators/auth.validator";
import { useForm } from "react-hook-form";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { svLogin } from "@/server/server-auth";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { EmailSentDialog } from "./email-sent-dialog";

export const LoginForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [formstate, setFormState] = useState<number>(0);

  const form = useForm<z.infer<typeof loginValidator>>({
    resolver: zodResolver(loginValidator),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { handleSubmit, control, watch, setError, clearErrors } = form;
  const onSubmit = async (data: z.infer<typeof loginValidator>) => {
    setIsSubmitting(true);
    try {
      const serverResponse = await svLogin(data);
      if (!serverResponse.success) {
        if (serverResponse.code === 404) {
          setError("email", { message: serverResponse.message });
          return;
        } else if (serverResponse.code === 401) {
          setError("password", { message: serverResponse.message });
          return;
        } else {
          toast.error(serverResponse.message);
          return;
        }
      }
      router.replace("/inbox");
    } catch (error) {
      toast.error("Something went wrong");
      return;
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <EmailSentDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        formreset={form.reset}
        setFormState={setFormState}
      />
      <Button variant="outline" type="button" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Image
            src="/assets/images/google_g.png"
            alt="Google"
            height={16}
            width={16}
            className="mr-2"
          />
        )}{" "}
        Continue with Google {/* TODO: Add funcionality */}
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">OR</span>
        </div>
      </div>
      <Form {...form}>
        <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            name="email"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    autoCapitalize="none"
                    autoComplete="email"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    type="password"
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
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
};

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
import { svLogin } from "@/server/auth.server";
import { toast } from "sonner";
import { Input } from "../ui/input";

export const LoginForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        } else if (serverResponse.code === 900) {
          toast.warning("Please check your email for a verification link.");
          return;
        } else {
          toast.error(serverResponse.message);
          return;
        }
      }
      router.push("/inbox");
    } catch (error) {
      toast.error("Something went wrong");
      return;
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex w-80 flex-col">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-4 flex w-full flex-col gap-5"
        >
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="eg. johndoe@example.com"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging In..." : "Log In"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

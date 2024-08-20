"use client";

import { signUpValidator } from "@/validators/auth.validator";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
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
import { svSignUp } from "@/server/auth.server";
import { toast } from "sonner";
import { Input } from "../ui/input";

export const SignUpForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof signUpValidator>>({
    resolver: zodResolver(signUpValidator),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { handleSubmit, control, watch } = form;
  const onSubmit = async (data: z.infer<typeof signUpValidator>) => {
    setIsSubmitting(true);
    try {
      const serverResponse = await svSignUp(data);
      if (!serverResponse.success) {
        toast.error(serverResponse.message);
        return;
      }
      toast.success("Account Created Successfully");

      router.push("/verify");
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
          className="mb-4 flex w-full flex-col gap-4"
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
                <FormDescription>
                  Password length must be atleast 12, with an uppercase, a
                  lowercase, and a number.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

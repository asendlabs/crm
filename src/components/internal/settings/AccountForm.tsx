"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import { updateAccount } from "@/lib/actions/settings.actions";
import { updateAccountSchema } from "@/validators/settings";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function AccountForm({ user }: { user: any }) {
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const form = useForm<z.infer<typeof updateAccountSchema>>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
    },
  });

  const onSubmit = async (data: z.infer<typeof updateAccountSchema>) => {
    try {
      const response = await updateAccount(data);
      if (response.success) {
        toast.success(response.message);
        router.refresh()
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col gap-4 w-96">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-96 text-sm"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Your Email" disabled/>
                </FormControl>
                <FormDescription className="flex flex-row gap-1">To change your email, please<Link href='/support?request=email_change' className="flex flex-row underline text-primary">
                  click here<ArrowUpRight /></Link></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update Account</Button>
        </form>
      </Form>
    </div>
  );
}

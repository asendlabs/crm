"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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
import Image from "next/image";
import { createProfileSchema } from "@/schemas/onboarding.schema";
import { Checkbox } from "../ui/checkbox";
import { svCreateProfile } from "@/server/auth";

export const CreateProfileForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof createProfileSchema>>({
    resolver: zodResolver(createProfileSchema),
    defaultValues: {
      name: "",
      marketingConsent: true,
    },
  });
  const { handleSubmit, control, watch, setError, clearErrors } = form;
  const onSubmit = async (data: z.infer<typeof createProfileSchema>) => {
    setIsSubmitting(true);
    try {
      const serverResponse = await svCreateProfile(data);
      if (!serverResponse.success) {
        toast.error(serverResponse.message);
        return;
      }
      toast.success("Profile created successfully" + data.name); // TODO: Remove after debugging
      router.replace("/onboarding/create-workspace");
    } catch (error) {
      toast.error("Something went wrong");
      return;
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            name="name"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    autoCapitalize="none"
                    autoComplete="name"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="marketingConsent"
            control={control}
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                    className="border-muted-foreground"
                  />
                </FormControl>
                <FormLabel className="text-gray-600">
                  I agree to receiving marketing communications
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isSubmitting} type="submit" className="mt-1">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Profile
          </Button>
        </form>
      </Form>
    </div>
  );
};

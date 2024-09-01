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
import { createWorkspaceSchema } from "@/schemas/onboarding.schema";
import { Checkbox } from "../ui/checkbox";

export const CreateWorkspaceForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });
  const { handleSubmit, control, watch, setError, clearErrors } = form;
  const onSubmit = async (data: z.infer<typeof createWorkspaceSchema>) => {
    setIsSubmitting(true);
    try {
      // TODO add Workspace creation
      toast.success("Workspace created successfully" + data.name);
      router.replace("/home");
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
                <FormLabel>Workspace Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Choose a cool name "
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
          <Button disabled={isSubmitting} type="submit" className="mt-1">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Workspace
          </Button>
        </form>
      </Form>
    </div>
  );
};

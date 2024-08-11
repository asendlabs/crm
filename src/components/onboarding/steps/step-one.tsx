"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

export function OnboardingFormStepOne({
  form,
  submitHandler,
}: {
  form: any;
  submitHandler: () => void;
}) {
  return (
    <>
      <FormField
        control={form.control}
        name="workspaceName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-regular text-gray-600">
              Workspace Name
            </FormLabel>
            <FormControl>
              <Input placeholder="eg. Acme Inc" {...field} className="w-80" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="button" onClick={submitHandler} className="w-80">
        Create Workspace
      </Button>
    </>
  );
}

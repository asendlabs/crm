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

export function OnboardingFormStepZero({
  form,
  submitHandler,
}: {
  form: any;
  submitHandler: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="eg. John Doe" {...field} className="w-50" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="logoImage"
          render={({ field }) => (
            <FormItem className="max-w-50">
              <FormLabel>Profile</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  {...field}
                  className="hover:cursor-pointer"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <Button type="button" onClick={submitHandler} className="w-full">
        Submit
      </Button>
    </div>
  );
}

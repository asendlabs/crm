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
  continueHandler,
}: {
  form: any;
  continueHandler: () => void;
}) {
  return (
    <>
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-regular text-gray-600">
              Full Name
            </FormLabel>
            <FormControl>
              <Input placeholder="eg. John Doe" {...field} className="w-80" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="button" onClick={continueHandler} className="w-80">
        Submit
      </Button>
    </>
  );
}

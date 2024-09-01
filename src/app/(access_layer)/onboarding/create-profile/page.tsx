import { CreateProfileForm } from "@/components/forms/CreateProfileForm";
import { buttonVariants } from "@/components/ui/button";
import { authGateways } from "@/lib/gateways";
import { cn } from "@/utils/tailwind";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Create your Profile | Asend",
};

const CreateProfilePage = async () => {
  await authGateways.accessLayerApp("create-profile");
  return (
    <main className="grid h-screen items-center">
      <div>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create your Profile
            </h1>
            <p className="text-sm text-muted-foreground">
              Fill out the form below to create your profile
            </p>
          </div>
          <CreateProfileForm />
        </div>
      </div>
    </main>
  );
};

export default CreateProfilePage;

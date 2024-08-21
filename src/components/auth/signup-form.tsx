"use client";

import { signUpValidator } from "@/validators/auth.validator";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  ArrowUpRight,
  CheckCircle,
  CircleCheckBig,
  Github,
  Loader2,
  MailCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { svCheckEmailAvailability, svSignUp } from "@/server/auth.server";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export const SignUpForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formState, setFormState] = useState<number>(0);
  const [failedSubmit, setFailedSubmit] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof signUpValidator>>({
    resolver: zodResolver(signUpValidator),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { handleSubmit, control, watch, trigger } = form;

  const emailValue = watch("email");

  useEffect(() => {
    if (formState === 0 && failedSubmit) {
      form.clearErrors("email");
      setFailedSubmit(false);
    }
  }, [formState, emailValue]);

  const finalSubmit = async (data: z.infer<typeof signUpValidator>) => {
    setIsLoading(true);
    try {
      const serverResponse = await svSignUp(data);
      if (!serverResponse.success) {
        toast.error(serverResponse.message);
        return;
      }
      setDialogOpen(true);
    } catch (error) {
      toast.error("Something went wrong");
      return;
    } finally {
      form.reset();
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="w-96 p-4"
          onInteractOutside={() => {
            setFormState(0);
            form.reset();
          }}
          onKeyDown={(e) => {
            setFormState(0);
            form.reset();
          }}
        >
          <DialogHeader>
            <div className="flex items-center justify-center pt-3">
              <MailCheck className="h-16 w-16 text-green-600" />
            </div>
            <DialogTitle className="py-2 text-center">
              Verification Email Sent
            </DialogTitle>

            <div className="flex w-full flex-col items-center gap-4 pb-4">
              <DialogDescription className="w-full text-center text-[0.8rem] text-muted-foreground">
                Please check your email and click the verification link to
                complete the process. If you didn't receive the email, please
                check your <span className="underline">spam folder</span> or try
                to sign up again.
              </DialogDescription>
              <DialogDescription className="w-full text-center text-[0.8rem] text-muted-foreground">
                If you are still having trouble, please talk to{" "}
                <Link className="underline" href="/support">
                  support <ArrowUpRight className="inline-block h-4 w-4" />
                </Link>{" "}
              </DialogDescription>
              <DialogDescription className="text-medium w-full text-center text-[0.85rem] underline">
                You can close this page now.
              </DialogDescription>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Form {...form}>
        <form className="grid gap-4">
          {formState === 0 && (
            <FormField
              name="email"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="eg. abc@example.com"
                      autoCapitalize="none"
                      autoComplete="email"
                      disabled={isLoading}
                      onKeyDown={async (e) => {
                        try {
                          if (e.key === "Enter" && !isLoading) {
                            setIsLoading(true);
                            const isValid = await trigger("email");

                            if (!isValid) {
                              setFailedSubmit(true);
                              return;
                            }

                            const serverResponse =
                              await svCheckEmailAvailability(emailValue);
                            if (!serverResponse.success) {
                              form.setError("email", {
                                message: serverResponse.message,
                              });
                              setFailedSubmit(true);
                              return;
                            }

                            setFormState(1);
                          }
                        } catch (error) {
                          return;
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {formState === 1 && (
            <FormField
              name="password"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Choose a strong password"
                      type="password"
                      disabled={isLoading}
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isLoading) {
                          handleSubmit(finalSubmit)();
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button
            disabled={isLoading}
            type="button"
            onClick={async () => {
              try {
                if (formState === 0) {
                  setIsLoading(true);
                  const isValid = await trigger("email");

                  if (!isValid) {
                    setFailedSubmit(true);
                    return;
                  }

                  const serverResponse =
                    await svCheckEmailAvailability(emailValue);
                  if (!serverResponse.success) {
                    form.setError("email", { message: serverResponse.message });
                    setFailedSubmit(true);
                    return;
                  }

                  setFormState(1);
                } else if (formState === 1) {
                  handleSubmit(finalSubmit)();
                }
              } catch (error) {
                console.error("Error during form submission:", error);
              } finally {
                setIsLoading(false); // Ensure loading state is always reset
              }
            }}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {formState === 0 ? "Continue" : "Sign Up"}
          </Button>
        </form>
      </Form>

      {formState === 0 && (
        <div className="flex flex-col gap-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button variant="outline" type="button" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Image
                src="/assets/svgs/google.svg"
                alt="Google"
                height={18}
                width={18}
                className="mr-1"
              />
              // <Github className="mr-2 h-4 w-4" />
            )}{" "}
            Google
          </Button>
        </div>
      )}
    </div>
  );
};

import React from "react";
import { Card } from "@/components/ui/card";
import { Link } from "next-view-transitions";
import { SettingsTextField } from "../_components/settings-text-field";
import { User, Shield, IdCard, Loader } from "lucide-react";
import { validateRequest } from "@/lib/lucia";
import { getUserById } from "@/data-access/users";

export const metadata = {
  title: {
    default: "Account settings",
  },
  icons: {
    icon: "/assets/favicon.ico",
  },
};

async function AccountPage() {
  const user = await validateRequest();
  const userId = user.user?.id;
  if (!userId) return null;

  const dbUser = await getUserById(userId);
  if (!dbUser) return null;

  return (
    <Card className="flex h-fit w-full flex-col px-8 py-6">
      {/* header section */}
      <div className="flex flex-col gap-3 border-b pb-4">
        <div className="flex items-center gap-2.5">
          <User className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-xl font-medium">Account settings</h1>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Manage your personal info and security settings. Data is secure and
          can be updated anytime.
        </p>
      </div>

      {/* personal information section */}
      <div className="flex flex-col gap-5 py-6">
        <div className="flex items-center gap-2.5">
          <IdCard className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-medium text-muted-foreground">
            Personal information
          </h2>
        </div>
        <div className="flex gap-4">
          <SettingsTextField
            defaultValue={dbUser.profile?.firstName ?? ""}
            label="First name"
            placeholder="Enter your first name"
            entityType="firstName"
          />
          <SettingsTextField
            defaultValue={dbUser.profile?.lastName ?? ""}
            label="Last name"
            placeholder="Enter your last name"
            entityType="lastName"
          />
        </div>
      </div>

      {/* security section */}
      <div className="flex flex-col gap-5 py-6 pt-3">
        <div className="flex items-center gap-2.5">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-medium text-muted-foreground">
            Security and authentication
          </h2>
        </div>
        <div className="space-y-8">
          {/* email section */}
          <div className="flex flex-col gap-2">
            <SettingsTextField
              defaultValue={dbUser.email}
              label="Email address"
              placeholder="Enter your email"
              isNotEditable
            />
            <Link
              href={"/app/settings/account/change_email"}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800"
            >
              <span className="underline">Update email address</span>
              <span className="text-muted-foreground">
                • requires verification
              </span>
            </Link>
          </div>

          {/* password section */}
          <div className="flex flex-col gap-2">
            <SettingsTextField
              defaultValue="••••••••••••••"
              label="Password"
              placeholder="Enter your password"
              isHidden
            />
            <Link
              href={"/app/settings/account/change_password"}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800"
            >
              <span className="underline">Change password</span>
              <span className="text-muted-foreground">
                • improves account security
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* footer section */}
      <div className="flex flex-col gap-2 pt-6">
        <p className="text-xs text-muted-foreground">
          Need help? Visit our{" "}
          <Link
            href="/help"
            className="text-gray-500 underline hover:text-gray-800"
          >
            Help center
          </Link>{" "}
          or contact{" "}
          <Link
            href="/support"
            className="text-gray-500 underline hover:text-gray-800"
          >
            Support
          </Link>
        </p>
      </div>
    </Card>
  );
}

export default AccountPage;

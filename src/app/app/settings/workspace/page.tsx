import React from "react";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link } from "next-view-transitions";
import { AlertCircle, Trash2, Settings, Shield, Building2 } from "lucide-react";
import { SettingsTextField } from "../_components/settings-text-field";
import { selectedWorkspaceCookie } from "@/constants";
import { cookies } from "next/headers";
import { getWorkspaceById } from "@/data-access/workspaces";
import { decryptFromBase64URI } from "@/lib/utils";

export const metadata = {
  title: "Workspace Settings",
  description: "Manage your workspace settings.",
};

const WorkspacePage = async () => {
  const workspaceId =
    (await cookies()).get(selectedWorkspaceCookie)?.value || "";
  const decodedWorkspaceId = decryptFromBase64URI(workspaceId);
  const workspace = await getWorkspaceById(decodedWorkspaceId);
  if (!workspace) {
    return null;
  }
  return (
    <Card className="flex h-fit w-full flex-col px-8 py-6">
      {/* header section */}
      <div className="flex flex-col gap-3 border-b pb-4">
        <div className="flex items-center gap-2.5">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-xl font-medium">Workspace settings</h1>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Manage your workspace preferences. These settings affect how your
          workspace appears to all members.
        </p>
      </div>

      {/* general settings section */}
      <div className="flex flex-col gap-5 py-6">
        <div className="flex items-center gap-2.5">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-medium text-muted-foreground">
            Workspace name
          </h2>
        </div>
        <div className="flex flex-col gap-2">
          <SettingsTextField
            defaultValue={workspace.name!}
            label=""
            entityType="name"
            placeholder="Enter workspace name"
          />
          <p className="text-xs text-muted-foreground">
            This name will be visible to all members of the workspace
          </p>
        </div>
      </div>

      {/* danger zone section */}
      <div className="flex flex-col gap-5 py-6 pt-3">
        <div className="flex items-center gap-2.5">
          <Shield className="h-4 w-4 text-red-600 dark:text-red-600" />
          <h2 className="text-sm font-medium text-red-700 dark:text-red-600">
            Danger zone
          </h2>
        </div>
        <div className="rounded-md border border-red-200 bg-red-50/50 p-4 dark:border-border dark:bg-background">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-red-600 dark:text-red-500">
                Once you delete a workspace, there is no going back. Please be
                certain.
              </p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger className="flex w-full items-center justify-between rounded-md border border-red-200 p-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-100/50 dark:border-border dark:text-red-500 dark:hover:bg-background">
                <span>delete this workspace</span>
                <Trash2 className="h-4 w-4" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your workspace and remove all associated data from our
                    servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                    Delete workspace
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* footer section */}
      <div className="flex flex-col gap-2 border-t pt-6">
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
};

export default WorkspacePage;

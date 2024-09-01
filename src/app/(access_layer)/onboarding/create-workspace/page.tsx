import { CreateWorkspaceForm } from "@/components/forms/CreateWorkspaceForm";
import { authGateways } from "@/lib/gateways";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Workspace | Asend",
};

const CreateWorkspacePage = async () => {
  await authGateways.accessLayerApp("create-workspace");
  return (
    <main className="grid h-screen items-center">
      <div>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create a Workspace
            </h1>
            <p className="text-sm text-muted-foreground">
              Fill out the form below to create a Workspace
            </p>
          </div>
          <CreateWorkspaceForm />
        </div>
      </div>
    </main>
  );
};

export default CreateWorkspacePage;

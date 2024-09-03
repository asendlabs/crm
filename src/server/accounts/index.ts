"use server";
import { z } from "zod";
import { getAccountsByWorkspaceId } from "@/scripts/account-scripts";
import { fetchLogggedInUser } from "../auth";
import { cookies } from "next/headers";

export const svFetchAllWorkspaceAccounts = async () => {
  try {
    const user = await fetchLogggedInUser();
    if (!user) {
      return {
        success: false,
        message: "You don't have access to this page",
        data: [],
      };
    }
    const workspaceId = cookies().get("selected_workspace");
    if (!workspaceId) {
      return {
        success: false,
        message: "You don't have access to this page",
        data: [],
      };
    }
    const accounts = await getAccountsByWorkspaceId('01J6PWHCK87A0FHCNV3T3E5A3F');
    if (!accounts) {
      return {
        success: false,
        message: "Failed to fetch accounts",
        data: [],
      };
    }
    return {
      success: true,
      message: "Fetched accounts successfully",
      data: accounts,
    };
  } catch (error) {
    console.error("Error during fetching accounts:", error);
    return {
      success: false,
      message:
        "An unexpected error occurred during fetching accounts. Please contact support if the issue persists.",
      data: [],
    };
  }
};

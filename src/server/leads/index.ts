"use server";
import { z } from "zod";
import { getLeadsByWorkspaceId } from "@/scripts/lead-scripts";
import { fetchLogggedInUser } from "../auth";
import { cookies } from "next/headers";

export const svFetchAllWorkspaceLeads = async () => {
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
    const leads = await getLeadsByWorkspaceId("01J6PWHCK87A0FHCNV3T3E5A3F");
    if (!leads) {
      return {
        success: false,
        message: "Failed to fetch leads",
        data: [],
      };
    }
    return {
      success: true,
      message: "Fetched leads successfully",
      data: leads,
    };
  } catch (error) {
    console.error("Error during fetching leads:", error);
    return {
      success: false,
      message:
        "An unexpected error occurred during fetching leads. Please contact support if the issue persists.",
      data: [],
    };
  }
};

import "server-only";
import { eq, inArray } from "drizzle-orm";
import { ulid } from "ulid";
import { db } from "@database";
import { leadTable, contactTable } from "@database/tables";
import { Lead } from "@database/types";

export const getLeadByLeadId = async (
  leadId: string,
): Promise<Lead | undefined> => {
  const lead = await db.query.leadTable.findFirst({
    where: eq(leadTable.id, leadId),
  });

  return lead;
};

export const getLeadsByWorkspaceId = async (
  workspaceId: string,
): Promise<Lead[]> => {
  const leads = await db.query.leadTable.findMany({
    where: eq(leadTable.workspaceId, workspaceId),
  });
  return leads;
};

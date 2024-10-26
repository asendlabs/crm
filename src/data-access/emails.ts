import "server-only";
import { db } from "@database";
import {
  emailMessageTable,
  workspaceEmailIntegrationsTable,
} from "@database/schema/emails";
import { eq } from "drizzle-orm";
import { ulid } from "ulid";
import { Email, EmailIntegration } from "@database/types";

export async function getEmailIntegrationsByWorkspaceId(workspaceId: string) {
  const integrations = await db.query.workspaceEmailIntegrationsTable.findMany({
    where: eq(workspaceEmailIntegrationsTable.workspaceId, workspaceId),
  });
  return integrations;
}

export async function getAllWorkspaceEmails(
  workspaceId: string,
): Promise<Email[] | undefined> {
  const emails = await db.query.emailMessageTable.findMany({
    where: eq(emailMessageTable.workspaceId, workspaceId),
  });
  return emails;
}

export async function createEmailMessage({
  workspaceId,
  accountId,
  toEmail,
  fromEmail,
  fromName,
  subject,
  snippet,
  emailTimestamp,
  type,
}: {
  workspaceId: string;
  accountId: string;
  toEmail: string;
  fromEmail: string;
  fromName: string;
  subject: string;
  snippet: string;
  emailTimestamp: Date;
  type: "received" | "sent";
}) {
  const [created] = await db
    .insert(emailMessageTable)
    .values({
      id: ulid(),
      workspaceId,
      accountId,
      toEmail,
      fromEmail,
      fromName,
      subject,
      snippet,
      emailTimestamp,
      type,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  return created;
}

export async function updateEmailMessage(id: string, updates: Partial<Email>) {
  const [updated] = await db
    .update(emailMessageTable)
    .set(updates)
    .where(eq(emailMessageTable.id, id))
    .returning();
  return updated;
}

export async function createEmailIntegration({
  workspaceId,
  userId,
  provider,
  providerId,
  accessToken,
  refreshToken,
  accessTokenExpiresAt,
  connectedAt,
  email,
}: {
  workspaceId: string;
  userId: string;
  provider: any;
  providerId: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  connectedAt: Date;
  email: string;
}) {
  const [created] = await db
    .insert(workspaceEmailIntegrationsTable)
    .values({
      id: ulid(),
      workspaceId,
      userId,
      provider,
      providerId,
      email,
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      connectedAt,
      updatedAt: new Date(),
    })
    .returning();
  return created;
}

export async function deleteEmailIntegration(id: string) {
  const deleted = await db
    .delete(workspaceEmailIntegrationsTable)
    .where(eq(workspaceEmailIntegrationsTable.id, id));
  return deleted;
}

export async function updateEmailIntegration(
  id: string,
  updates: Partial<EmailIntegration>,
) {
  const [updated] = await db
    .update(workspaceEmailIntegrationsTable)
    .set(updates)
    .where(eq(workspaceEmailIntegrationsTable.id, id))
    .returning();
  return updated;
}

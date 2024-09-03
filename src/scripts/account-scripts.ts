import "server-only";
import { eq, inArray } from "drizzle-orm";
import { ulid } from "ulid";
import { db } from "@database";
import { accountTable, contactTable } from "@database/tables";
import { Account } from "@database/types";

export const getAccountByAccountId = async (
  accountId: string,
): Promise<Account | undefined> => {
  const account = await db.query.accountTable.findFirst({
    where: eq(accountTable.id, accountId),
  });

  return account;
};

export const getAccountsByWorkspaceId = async (
  workspaceId: string,
): Promise<Account[]> => {
  const accounts = await db.query.accountTable.findMany({
    where: eq(accountTable.workspaceId, workspaceId),
  });
  return accounts;
};

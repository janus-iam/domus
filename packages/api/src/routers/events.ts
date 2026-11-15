import { account } from "@janus-iam/db/schema/auth";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { protectedProcedure, router } from "../index";

const TABLE_NAME = /^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)?$/;

export type KeycloakEvent = {
  id: string | null;
  time: string;
  type: string | null;
  realm_id: string | null;
  realm_name: string | null;
  client_id: string | null;
  user_id: string | null;
  session_id: string | null;
  ip_address: string | null;
  error: string | null;
  details: string;
  nats_seq: string | number;
  ingested_at: string;
};

function assertSafeTableName(table: string) {
  if (!TABLE_NAME.test(table)) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Invalid ClickHouse events table name",
    });
  }
  return table;
}

export const eventsRouter = router({
  list: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().int().min(1).max(500).default(100),
        })
        .default({ limit: 100 }),
    )
    .query(async ({ ctx, input }) => {
      const table = assertSafeTableName(ctx.clickhouseEventsTable);

      const [keycloakAccount] = await ctx.db
        .select({ accountId: account.accountId })
        .from(account)
        .where(and(eq(account.userId, ctx.session.user.id), eq(account.providerId, "keycloak")))
        .limit(1);

      const keycloakUserId = keycloakAccount?.accountId;
      const query_params: Record<string, string | number> = {
        limit: input.limit,
      };

      let query = `
        SELECT
          id,
          time,
          type,
          realm_id,
          realm_name,
          client_id,
          user_id,
          session_id,
          ip_address,
          error,
          details,
          nats_seq,
          ingested_at
        FROM ${table}
      `;

      if (keycloakUserId) {
        query += ` WHERE user_id = {userId:String}`;
        query_params.userId = keycloakUserId;
      }

      query += ` ORDER BY time DESC LIMIT {limit:UInt32}`;

      try {
        const result = await ctx.clickhouse.query({
          query,
          query_params,
          format: "JSONEachRow",
        });
        const rows = await result.json<KeycloakEvent>();
        return {
          table,
          keycloakUserId: keycloakUserId ?? null,
          rows,
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_GATEWAY",
          message: error instanceof Error ? error.message : "ClickHouse query failed",
          cause: error,
        });
      }
    }),
});

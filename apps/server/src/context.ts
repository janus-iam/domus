import type { Context as ApiContext } from "@janus-iam/api/context";
import type { Context as HonoContext } from "hono";

import { ENV } from "./env.server";
import { auth, clickhouse, db } from "./services";

export type CreateContextOptions = {
  context: HonoContext;
};

export async function createContext({ context }: CreateContextOptions): Promise<ApiContext> {
  const session = await auth.api.getSession({
    headers: context.req.raw.headers,
  });
  return {
    db,
    session,
    clickhouse,
    clickhouseEventsTable: ENV.CLICKHOUSE_EVENTS_TABLE,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

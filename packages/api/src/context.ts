import type { Session } from "@janus/auth";
import type { Database } from "@janus/db";

export type Context = {
  session: Session | null;
  db: Database;
};

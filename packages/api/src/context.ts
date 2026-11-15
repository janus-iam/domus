import type { Session } from "@janus-iam/auth";
import type { Database } from "@janus-iam/db";

export type Context = {
  session: Session | null;
  db: Database;
};

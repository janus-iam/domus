import type { Session } from "@domus/auth";
import type { Database } from "@domus/db";

export type Context = {
  session: Session | null;
  db: Database;
};

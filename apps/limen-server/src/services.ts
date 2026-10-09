import { createAuth } from "@janus/auth";
import { createDb } from "@janus/db";

import { ENV } from "./env.server";

export const db = createDb(ENV);
export const auth = createAuth(ENV, db);

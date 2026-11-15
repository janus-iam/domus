import { createAuth } from "@janus-iam/auth";
import { createDb } from "@janus-iam/db";

import { ENV } from "./env.server";

export const db = createDb(ENV);
export const auth = createAuth(ENV, db);

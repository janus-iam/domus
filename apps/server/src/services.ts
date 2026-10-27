import { createAuth } from "@domus/auth";
import { createDb } from "@domus/db";

import { ENV } from "./env.server";

export const db = createDb(ENV);
export const auth = createAuth(ENV, db);

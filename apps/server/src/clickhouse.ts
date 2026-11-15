import { createClient, type ClickHouseClient } from "@clickhouse/client";

export type ClickHouseConfig = {
  CLICKHOUSE_URL: string;
  CLICKHOUSE_USER: string;
  CLICKHOUSE_PASSWORD: string;
  CLICKHOUSE_DATABASE: string;
};

export function createClickHouse(env: ClickHouseConfig): ClickHouseClient {
  return createClient({
    url: env.CLICKHOUSE_URL,
    username: env.CLICKHOUSE_USER,
    password: env.CLICKHOUSE_PASSWORD,
    database: env.CLICKHOUSE_DATABASE,
  });
}

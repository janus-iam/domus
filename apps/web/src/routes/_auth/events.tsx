import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/_auth/events")({
  component: EventsPage,
});

const COLUMNS = [
  "time",
  "type",
  "realm_name",
  "client_id",
  "ip_address",
  "error",
  "session_id",
  "details",
  "nats_seq",
  "ingested_at",
] as const;

function EventsPage() {
  const events = useQuery(trpc.events.list.queryOptions({ limit: 100 }));
  const rows = events.data?.rows ?? [];

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-6">
      <div>
        <h1 className="text-2xl font-semibold">Events</h1>
        <p className="text-muted-foreground text-sm">
          Keycloak events from{" "}
          <code className="text-xs">
            {events.data?.table ?? "events"}
          </code>
          {events.data?.keycloakUserId
            ? ` for user ${events.data.keycloakUserId}`
            : " (no linked Keycloak account — showing unfiltered)"}
        </p>
      </div>

      {events.isLoading ? (
        <p className="text-muted-foreground text-sm">Loading events…</p>
      ) : null}

      {events.error ? (
        <pre className="bg-destructive/10 text-destructive overflow-x-auto rounded-lg p-4 text-xs">
          {events.error.message}
        </pre>
      ) : null}

      {!events.isLoading && !events.error && rows.length === 0 ? (
        <p className="text-muted-foreground text-sm">No events found.</p>
      ) : null}

      {rows.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted">
              <tr>
                {COLUMNS.map((column) => (
                  <th key={column} className="px-3 py-2 font-medium whitespace-nowrap">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.id ?? "row"}-${row.nats_seq}`} className="border-t align-top">
                  {COLUMNS.map((column) => (
                    <td key={column} className="px-3 py-2">
                      {formatCell(column, row[column])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

function formatCell(column: (typeof COLUMNS)[number], value: unknown) {
  if (value == null || value === "") return "—";

  if (column === "details" && typeof value === "string") {
    try {
      return (
        <pre className="max-w-xs overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(JSON.parse(value), null, 2)}
        </pre>
      );
    } catch {
      return <span className="whitespace-nowrap">{value}</span>;
    }
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return <span className="whitespace-nowrap">{String(value)}</span>;
  }

  return <span className="whitespace-nowrap">{JSON.stringify(value)}</span>;
}

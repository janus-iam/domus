import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/_auth/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { session: routeSession } = Route.useRouteContext();
  const clientSession = authClient.useSession();
  const privateData = useQuery(trpc.privateData.queryOptions());

  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Welcome {clientSession.data?.user.name ?? routeSession.data?.user.name}
        </p>
        <p className="text-muted-foreground text-sm">API: {privateData.data?.message}</p>
      </div>

      <AuthDump title="authClient.useSession()" value={clientSession} />
      <AuthDump title="Route context getSession()" value={routeSession} />
    </div>
  );
}

function AuthDump({ title, value }: { title: string; value: unknown }) {
  return (
    <section className="space-y-2">
      <h2 className="font-medium">{title}</h2>
      <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-xs leading-relaxed">
        {JSON.stringify(value, null, 2)}
      </pre>
    </section>
  );
}

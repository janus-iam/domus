import { createFileRoute } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_auth/signature")({
  component: SignaturePage,
});

const SIGNATURE_BASE = "https://signature.getjanus.eu/v1";
const LEARN_MORE_URL = "https://getjanus.eu/blog/security-signature-and-passkeys";

function SignaturePage() {
  const { session: routeSession } = Route.useRouteContext();
  const clientSession = authClient.useSession();
  const hash = clientSession.data?.user.hash ?? routeSession.data?.user.hash;

  const signatureUrl = hash ? `${SIGNATURE_BASE}/${hash}.svg` : null;

  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-6">
      <div>
        <h1 className="text-2xl font-semibold">Security Signature</h1>
        <p className="text-muted-foreground text-sm">
          Your personal identicon — a visual check that you are on genuine Janus.{" "}
          <a
            href={LEARN_MORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-4"
          >
            Learn more about Security Signature and passkeys
          </a>
        </p>
      </div>

      {clientSession.isPending ? (
        <p className="text-muted-foreground text-sm">Loading signature…</p>
      ) : null}

      {!clientSession.isPending && !hash ? (
        <p className="text-muted-foreground text-sm">
          No security signature hash is available for this account yet.
        </p>
      ) : null}

      {signatureUrl ? (
        <section className="flex flex-col items-start gap-4">
          <img
            src={signatureUrl}
            alt="Your Janus Security Signature identicon"
            className="bg-background size-48 rounded-lg border"
          />
          <p className="text-muted-foreground font-mono text-xs break-all">Also available at: <a href={signatureUrl} target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-4">https://signature.getjanus.eu/v1/{hash}.svg</a></p>
        </section>
      ) : null}
    </div>
  );
}

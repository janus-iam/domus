import { Button } from "@janus-iam/ui/components/button";
import { Input } from "@janus-iam/ui/components/input";
import { Label } from "@janus-iam/ui/components/label";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_auth/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { session: routeSession } = Route.useRouteContext();
  const clientSession = authClient.useSession();
  const user = clientSession.data?.user ?? routeSession.data?.user;
  const image = user?.image ?? null;

  const [imageUrl, setImageUrl] = useState(image ?? "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setImageUrl(image ?? "");
  }, [image]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextImage = imageUrl.trim();
    setIsSaving(true);

    const { error } = await authClient.updateUser({
      image: nextImage.length > 0 ? nextImage : null,
    });

    setIsSaving(false);

    if (error) {
      toast.error(error.message || "Failed to update profile picture");
      return;
    }

    toast.success("Profile picture updated");
    await clientSession.refetch();
  }

  return (
    <div className="container mx-auto max-w-3xl space-y-8 px-4 py-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-muted-foreground text-sm">
          Your profile picture is stored on the user record (synced from the Keycloak{" "}
          <code className="text-xs">picture</code> attribute on sign-in).
        </p>
      </div>

      {clientSession.isPending ? (
        <p className="text-muted-foreground text-sm">Loading profile…</p>
      ) : null}

      {!clientSession.isPending && user ? (
        <>
          <section className="flex flex-col items-start gap-4">
            <div className="bg-muted flex size-48 items-center justify-center overflow-hidden rounded-lg border">
              {image ? (
                <img
                  src={image}
                  alt={`${user.name}'s profile picture`}
                  className="size-full object-cover"
                />
              ) : (
                <span className="text-muted-foreground text-sm">No picture set</span>
              )}
            </div>
            <dl className="space-y-1 text-sm">
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Name</dt>
                <dd>{user.name}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Email</dt>
                <dd>{user.email}</dd>
              </div>
              {image ? (
                <div className="flex flex-col gap-1">
                  <dt className="text-muted-foreground">Image URL</dt>
                  <dd className="text-muted-foreground font-mono text-xs break-all">{image}</dd>
                </div>
              ) : null}
            </dl>
          </section>

          <section className="space-y-4 border-t pt-6">
            <div>
              <h2 className="font-medium">Update picture</h2>
              <p className="text-muted-foreground text-sm">
                Paste an image URL to update the local user attribute. File upload and Keycloak
                sync can be wired up later.
              </p>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}

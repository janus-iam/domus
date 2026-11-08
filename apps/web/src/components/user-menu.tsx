import { Button } from "@domus/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@domus/ui/components/dropdown-menu";
import { Skeleton } from "@domus/ui/components/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

export default function UserMenu() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <Skeleton className="h-9 w-36" />;
  }

  if (!session) {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          const origin = window.location.origin;
          authClient.signIn.social(
            {
              provider: "keycloak",
              callbackURL: `${origin}/dashboard`,
              errorCallbackURL: origin,
            },
            {
              onError: (error) => {
                toast.error(error.error.message || error.error.statusText);
              },
            },
          );
        }}
      >
        Sign in with Janus
      </Button>
    );
  }

  const displayName = session.user.name || "Account";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        {displayName}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card min-w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-0.5">
              <span className="font-medium">{displayName}</span>
              <span className="text-muted-foreground text-xs">
                {session.user.email || "No email"}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    navigate({
                      to: "/",
                    });
                  },
                },
              });
            }}
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

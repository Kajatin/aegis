import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { LoaderIcon } from "./icons/loader";
import { useUser } from "../utils/hooks/useUser";
import { useStronghold } from "../stores/stronghold";

export default function Protected({ children }: { children: ReactNode }) {
  const privkey = useStronghold((state) => state.privkey);
  const { status, user } = useUser();

  if (status === "loading") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoaderIcon className="h-6 w-6 animate-spin text-zinc-100" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/welcome" replace />;
  }

  if (user && !privkey) {
    return <Navigate to="/auth/unlock" replace />;
  }

  return children;
}

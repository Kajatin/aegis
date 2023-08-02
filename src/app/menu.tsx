import { Link, useLocation } from "react-router-dom";

import { KeyIcon, FingerPrintIcon } from "@heroicons/react/24/outline";

export default function Menu() {
  const location = useLocation();

  return (
    <div className="group flex flex-col gap-4 h-full w-80 min-w-fit rounded-lg border border-zinc-900/60 p-2">
      <div className="text-base font-bold uppercase">aegis</div>

      <div className="flex flex-col gap-1">
        <div className="text-sm font-bold uppercase opacity-40">Navigation</div>
        <Link
          to="/app/authenticator"
          className={
            "flex flex-row gap-2 p-2 rounded-lg items-center border hover:border-current opacity-60 hover:opacity-90 " +
            (location.pathname === "/app/authenticator"
              ? "border-current"
              : "border-transparent")
          }
        >
          <FingerPrintIcon className="h-6 w-6" />
          <div className="font-medium">Authenticator</div>
        </Link>

        <Link
          to="/app/passwords"
          className={
            "flex flex-row gap-2 p-2 rounded-lg items-center border hover:border-current opacity-60 hover:opacity-90 " +
            (location.pathname === "/app/passwords"
              ? "border-current"
              : "border-transparent")
          }
        >
          <KeyIcon className="h-6 w-6" />
          <div className="font-medium">Passwords</div>
        </Link>
      </div>
    </div>
  );
}

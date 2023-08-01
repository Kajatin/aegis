import { Link, useLocation } from "react-router-dom";

import { KeyIcon, FingerPrintIcon } from "@heroicons/react/24/outline";

export default function Menu() {
  const location = useLocation();
  console.log(location.pathname);

  return (
    <div className="group flex flex-col gap-1 h-full w-80 min-w-fit rounded-lg border border-zinc-900/60 p-2">
      <Link
        to="/app/twofa"
        className={
          "flex flex-row gap-2 p-2 rounded-lg items-center hover:bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 " +
          (location.pathname === "/app/twofa" && "border border-zinc-900/60")
        }
      >
        <FingerPrintIcon className="h-6 w-6" />
        <div className="font-medium">2FA codes</div>
      </Link>

      <Link
        to="/app/passwords"
        className={
          "flex flex-row gap-2 p-2 rounded-lg items-center hover:bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 " +
          (location.pathname === "/app/passwords" &&
            "border border-zinc-900/60")
        }
      >
        <KeyIcon className="h-6 w-6" />
        <div className="font-medium">Passwords</div>
      </Link>
    </div>
  );
}

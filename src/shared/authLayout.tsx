import { platform } from "@tauri-apps/api/os";
import { Outlet, useNavigate } from "react-router-dom";

import { LockClosedIcon } from "@heroicons/react/24/outline";

import { ArrowLeftIcon } from "./icons/arrowLeft";
import { ArrowRightIcon } from "./icons/arrowRight";

const platformName = await platform();

export default function AuthLayout() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const goForward = () => {
    navigate(1);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-zinc-950">
      <div data-tauri-drag-region className="relative h-10 shrink-0">
        <div
          data-tauri-drag-region
          className="flex h-full w-full flex-1 items-center px-2 justify-between"
        >
          <div
            className={`flex h-full items-center gap-2 ${
              platformName === "darwin" ? "pl-[72px]" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => goBack()}
              className="group inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-zinc-900/60"
            >
              <ArrowLeftIcon
                width={16}
                height={16}
                className="opacity-60 group-hover:opacity-90"
              />
            </button>
            <button
              type="button"
              onClick={() => goForward()}
              className="group inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-zinc-900/60"
            >
              <ArrowRightIcon
                width={16}
                height={16}
                className="opacity-60 group-hover:opacity-90"
              />
            </button>
          </div>

          <div
            className={`flex h-full items-center gap-2 ${
              platformName === "darwin" ? "pl-[72px]" : ""
            }`}
          >
            <button
              disabled={true}
              type="button"
              className="group inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-zinc-900/60"
            >
              <LockClosedIcon
                width={16}
                height={16}
                className="opacity-60 group-hover:opacity-90"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="relative flex min-h-0 w-full flex-1 px-3 pb-3">
        <div className="flex w-full h-full rounded-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

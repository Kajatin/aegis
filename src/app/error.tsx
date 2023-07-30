import { useNavigate, useRouteError } from "react-router-dom";

interface IRouteError {
  statusText: string;
  message: string;
}

export default function ErrorScreen() {
  const navigate = useNavigate();
  const error = useRouteError() as IRouteError;

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col gap-4 w-full max-w-md items-center justify-center rounded-lg px-5 py-3">
        <div className="flex flex-col gap-2 items-center">
          <div className="font-medium text-2xl">Whoopsie</div>
          <div className="text-sm opacity-60">
            An unexpected error has occurred
          </div>
        </div>

        <div className="flex w-full bg-zinc-900/60 rounded-lg p-6 cursor-pointer justify-center">
          {error.statusText || error.message}
        </div>

        <button
          className="flex w-full items-center justify-center rounded-lg px-5 py-1 text-sm font-medium opacity-60 transition-all"
          onClick={() => navigate("/", { replace: true })}
        >
          Try again
        </button>
      </div>
    </div>
  );
}

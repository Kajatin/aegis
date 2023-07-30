import { Link } from "react-router-dom";

export default function WelcomeScreen() {
  return (
    <div className="flex flex-row gap-3 h-full w-full">
      <div className="flex flex-col gap-3 h-full w-fit items-center justify-end py-8 bg-zinc-900/60 rounded-lg">
        <div className="text-3xl font-medium">aegis</div>
        <div className="flex flex-col flex-1 w-full items-center justify-center text-xl font-bold">
          <div>
            it is <span className="text-indigo-400">blazingly</span> fast
          </div>
          <div>
            fully <span className="text-orange-400">encrypted</span> storage
          </div>
        </div>
        <div className="flex flex-col w-fit gap-2 px-4 py-4">
          <Link
            to="/auth/import"
            className="flex w-80 min-w-fit items-center justify-center rounded-lg px-5 py-3 font-medium bg-emerald-600 hover:bg-emerald-500 transition-all"
          >
            Login with private key
          </Link>
          <Link
            to="/auth/create"
            className="flex w-80 min-w-fit items-center justify-center rounded-lg px-5 py-3 font-medium bg-zinc-800/60 hover:bg-zinc-800 transition-all"
          >
            Create new key
          </Link>
        </div>
      </div>

      <div className="flex flex-col h-full w-full items-center justify-center bg-zinc-900/60 rounded-lg">
        something
      </div>
    </div>
  );
}

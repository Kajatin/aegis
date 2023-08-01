import Codes from "./codes";
import NewCode from "./new";

export default function TwoFAScreen() {
  return (
    <div className="flex flex-col h-full w-full items-start justify-start border border-zinc-900/60 rounded-lg p-2">
      <div className="flex flex-col gap-4 w-full">
        <Codes />
        <NewCode />
      </div>
    </div>
  );
}

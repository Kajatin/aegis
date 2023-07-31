import Codes from "./codes";
import NewCode from "./new";

export default function SpaceScreen() {
  return (
    <div className="flex flex-col gap-4">
      <NewCode />
      <Codes />
    </div>
  );
}

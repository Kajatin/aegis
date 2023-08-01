import { useNavigate } from "react-router-dom";

import { LoaderIcon } from "../shared/icons";
import { useEffect } from "react";

export default function Root() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/app/twofa", { replace: true });
    }, 1200);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col gap-4 w-full max-w-md">
        <div className="flex w-full items-center justify-center rounded-lg px-5 py-3 font-medium">
          <LoaderIcon className="h-6 w-6 animate-spin" />
        </div>
      </div>
    </div>
  );
}

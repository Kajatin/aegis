import { useNavigate } from "react-router-dom";

export default function OnboardingScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col gap-4 w-full max-w-md">
        <div className="text-center text-xl font-semibold">👋 Welcome</div>
        <button
          className="flex w-full items-center justify-center rounded-lg px-5 py-3 font-medium bg-emerald-600 hover:bg-emerald-500 transition-all"
          onClick={() => navigate("/", { replace: true })}
        >
          Get started
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Resolver, useForm } from "react-hook-form";

import { EyeOffIcon, EyeOnIcon, LoaderIcon } from "../../shared/icons";

import { useStronghold } from "../../stores/stronghold";

import { useUser } from "../../utils/hooks/useUser";
import { useSecureStorage } from "../../utils/hooks/useSecureStorage";
import { info } from "tauri-plugin-log-api";

type FormValues = {
  password: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.password ? values : {},
    errors: !values.password
      ? {
          password: {
            type: "required",
            message: "This is required.",
          },
        }
      : {},
  };
};

export default function UnlockScreen() {
  const navigate = useNavigate();
  const setPrivkey = useStronghold((state) => state.setPrivkey);

  const [passwordInput, setPasswordInput] = useState("password");
  const [loading, setLoading] = useState(false);

  const { user } = useUser();
  const { load } = useSecureStorage();

  // toggle private key
  const showPassword = () => {
    if (passwordInput === "password") {
      setPasswordInput("text");
    } else {
      setPasswordInput("password");
    }
  };

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<FormValues>({ resolver });

  const onSubmit = async (data: { [x: string]: string }) => {
    if (!user) {
      navigate("/", { replace: true });
      return;
    }

    setLoading(true);
    if (data.password.length > 11) {
      // load private in secure storage
      try {
        const privkey = await load(user.pubkey, data.password);
        info(JSON.stringify(user));
        info("privkey " + privkey + " loaded");
        setPrivkey(privkey);
        // redirect to home
        navigate("/", { replace: true });
      } catch {
        setLoading(false);
        setError("password", {
          type: "custom",
          message: "Wrong password",
        });
      }
    } else {
      setLoading(false);
      setError("password", {
        type: "custom",
        message: "Password must be at least 12 characters",
      });
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col gap-4 w-full max-w-md">
        <div className="text-center text-xl font-semibold">
          Enter password to unlock
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-red-400">
              {errors.password && <p>{errors.password.message}</p>}
            </span>

            <div className="relative">
              <input
                {...register("password", { required: true })}
                type={passwordInput}
                className="relative w-full rounded-lg bg-zinc-900/60 py-3 text-center !outline-none"
              />
              <button
                type="button"
                onClick={() => showPassword()}
                className="group absolute right-2 top-1/2 -translate-y-1/2 transform rounded p-1 hover:bg-zinc-700"
              >
                {passwordInput === "password" ? (
                  <EyeOffIcon
                    width={20}
                    height={20}
                    className="text-zinc-500 group-hover:text-zinc-100"
                  />
                ) : (
                  <EyeOnIcon
                    width={20}
                    height={20}
                    className="text-zinc-500 group-hover:text-zinc-100"
                  />
                )}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={!isDirty || !isValid}
              className="flex w-full items-center justify-center rounded-lg px-5 py-3 font-medium bg-emerald-600 hover:bg-emerald-500 transition-all"
            >
              {loading ? (
                <LoaderIcon className="h-6 w-6 animate-spin" />
              ) : (
                "Unlock"
              )}
            </button>
            <Link
              to="/auth/reset"
              className="flex w-full items-center justify-center rounded-lg px-5 py-1 text-sm font-medium opacity-60 transition-all"
            >
              Reset password
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { EyeOffIcon, EyeOnIcon, LoaderIcon } from "../../../shared/icons";

import { useStronghold } from "../../../stores/stronghold";
import { useOnboarding } from "../../../stores/onboarding";

import { useSecureStorage } from "../../../utils/hooks/useSecureStorage";

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
            message: "This field is required",
          },
        }
      : {},
  };
};

export default function CreateStep2Screen() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [passwordInput, setPasswordInput] = useState("password");

  const privkey = useStronghold((state) => state.privkey);
  const pubkey = useOnboarding((state) => state.pubkey);

  const { save } = useSecureStorage();

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
    setLoading(true);
    if (data.password.length > 11) {
      // save privkey to secure storage
      await save(pubkey, privkey!, data.password);

      // redirect to next step
      navigate("/auth/onboarding", { replace: true });
    } else {
      setLoading(false);
      setError("password", {
        type: "custom",
        message: "Password must be at least 12 characters",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div className="text-center text-xl font-semibold">
        Set password to secure your keys
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-sm text-red-400">
            {errors.password && <div>{errors.password.message}</div>}
          </div>

          <div className="relative">
            <input
              {...register("password", { required: true })}
              type={passwordInput}
              className="relative w-full rounded-lg bg-zinc-800 py-3 pl-3.5 pr-11 text-zinc-100 !outline-none placeholder:text-zinc-400"
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

          <div className="text-sm opacity-60">
            Password is used to secure your key store on your local machine. Use
            a strong password that you can remember.
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            disabled={!isDirty || !isValid}
            className="flex w-full items-center justify-center rounded-lg px-5 py-3 font-medium bg-emerald-600 hover:bg-emerald-500 disabled:pointer-events-none disabled:opacity-50 transition-all"
          >
            {loading ? (
              <LoaderIcon className="h-6 w-6 animate-spin" />
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

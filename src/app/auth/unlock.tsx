import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Resolver, useForm } from "react-hook-form";

import { EyeOffIcon, EyeOnIcon, LoaderIcon } from "../../shared/icons";

import { usePassword } from "../../stores/password";

import { useSecureStorage } from "../../utils/hooks/useSecureStorage";

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
  const { validate } = useSecureStorage();
  const setPassword = usePassword((state) => state.setPassword);

  const [loading, setLoading] = useState(false);
  const [passwordInput, setPasswordInput] = useState("password");

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

    try {
      await validate(data.password);
      setPassword(data.password);
      navigate("/", { replace: true });
    } catch (e) {
      console.error(e);
      setError("password", {
        type: "custom",
        message: "Incorrect password",
      });
    }

    setLoading(false);
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
              className="flex w-full items-center justify-center rounded-lg px-5 py-3 font-medium bg-blue-600 hover:bg-blue-500 transition-all"
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

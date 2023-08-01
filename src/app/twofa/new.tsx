import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";

import { LoaderIcon } from "../../shared/icons";

import { usePassword } from "../../stores/password";

import { createCode } from "../../utils/storage";
import { useSecureStorage } from "../../utils/hooks/useSecureStorage";

type FormValues = {
  name: string;
  code: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.code ? values : {},
    errors: !values.code
      ? {
          code: {
            type: "required",
            message: "This is required.",
          },
        }
      : {},
  };
};

export default function NewCode() {
  const { save } = useSecureStorage();
  const password = usePassword((state) => state.password);

  const [loading, setLoading] = useState(false);

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<FormValues>({ resolver });

  const onSubmit = async (data: { [x: string]: string }) => {
    setLoading(true);

    if (!data.code || !data.name) {
      setError("code", {
        type: "required",
        message: "This is required",
      });

      setLoading(false);
      return;
    }

    const code = await createCode(data.name);
    await save(code, data.code, password);

    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm text-red-400">
            {errors.code && <p>{errors.code.message}</p>}
          </span>

          <div className="flex flex-col justify-start">
            <div>Name</div>
            <input
              {...register("name", { required: true })}
              type="text"
              className="relative w-full rounded-lg bg-zinc-900/60 py-3 text-center !outline-none"
            />
          </div>

          <div className="flex flex-col justify-start">
            <div>Code</div>
            <input
              {...register("code", { required: true })}
              type="text"
              className="relative w-full rounded-lg bg-zinc-900/60 py-3 text-center !outline-none"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="submit"
            disabled={!isDirty || !isValid}
            className="flex w-full items-center justify-center rounded-lg px-5 py-3 font-medium bg-emerald-600 hover:bg-emerald-500 transition-all"
          >
            {loading ? <LoaderIcon className="h-6 w-6 animate-spin" /> : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

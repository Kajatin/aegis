import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { motion } from "framer-motion";

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

export default function NewCodeModal(props: {
  setShowModal: (showModal: boolean) => void;
}) {
  const { setShowModal } = props;

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
    setShowModal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-zinc-950/60 backdrop-blur z-40 rounded-lg"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col gap-4 w-1/2 min-w-fit"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-red-400">
              {errors.code && <p>{errors.code.message}</p>}
            </span>

            <div className="flex flex-col justify-start">
              <div className="text-sm opacity-60 font-medium uppercase">
                Name
              </div>
              <input
                {...register("name", { required: true })}
                type="text"
                className="relative w-full rounded-lg bg-zinc-900/60 py-3 text-center !outline-none"
              />
            </div>

            <div className="flex flex-col justify-start">
              <div className="text-sm opacity-60 font-medium uppercase">
                Code
              </div>
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
              className="flex w-full items-center justify-center rounded-lg px-5 py-3 font-medium bg-blue-600 hover:bg-blue-500 transition-all"
            >
              {loading ? (
                <LoaderIcon className="h-6 w-6 animate-spin" />
              ) : (
                "Save"
              )}
            </button>
            <button
              className="flex w-full items-center justify-center rounded-lg px-5 py-1 text-sm font-medium opacity-60 transition-all"
              onClick={() => {
                setShowModal(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

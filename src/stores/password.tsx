import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface PasswordState {
  password: string;
  setPassword: (password: string) => void;
}

export const usePassword = create<PasswordState>()(
  persist(
    (set) => ({
      password: "",
      setPassword: (password: string) => {
        set({ password: password });
      },
    }),
    {
      name: "password",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

import { create } from "zustand";

interface OnboardingState {
  pubkey: string;
  setPubkey: (pubkey: string) => void;
}

export const useOnboarding = create<OnboardingState>((set) => ({
  pubkey: "",
  setPubkey: (pubkey: string) => {
    set({ pubkey: pubkey });
  },
}));

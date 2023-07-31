import { useQuery } from "@tanstack/react-query";

import { getCodes } from "../storage";
import { useSecureStorage } from "./useSecureStorage";

export function useCodes(password: string) {
  const { load } = useSecureStorage();

  const { status, data: codes } = useQuery(
    ["secretCodes"],
    async () => {
      const codes = await getCodes();

      const decodedCodes = await Promise.all(
        codes.map(async (code) => {
          try {
            const decoded = await load(code.code, password);
            return {
              ...code,
              code: decoded,
            };
          } catch (err) {
            return code;
          }
        })
      );

      return decodedCodes;
    },
    {
      staleTime: Infinity,
    }
  );

  return { status, codes };
}

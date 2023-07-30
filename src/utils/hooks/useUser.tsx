import { useQuery } from "@tanstack/react-query";

import { getUser } from "../storage";

export function useUser() {
  const { status, data: user } = useQuery(
    ["currentUser"],
    async () => {
      const user = await getUser();
      return user;
    },
    {
      staleTime: Infinity,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    }
  );

  return { status, user };
}

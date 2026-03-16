import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/auth";
import { qk } from "../app/queryKeys";

export function useMe() {
  return useQuery({
    queryKey: qk.me,
    queryFn: authApi.me,
    retry: false,
  });
}


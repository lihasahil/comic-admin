import {
  createAdmin,
  CreateAdminPayload,
} from "@/services/create-admin.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "./useUsers";

export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminPayload) => createAdmin(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

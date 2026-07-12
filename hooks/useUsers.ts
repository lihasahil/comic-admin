import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { userService, UserListParams } from "@/services/userService";

// Query Keys

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: UserListParams) => [...userKeys.lists(), params] as const,
};

// Hooks

/**
 * Fetch paginated users list.
 */
export function useUsers(params: UserListParams = {}) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getUsers(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

/**
 * Permanently delete a user by ID.
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => userService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

/**
 * Assign or remove a user's founder badge.
 */
export function useAssignFounderBadge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      badgeNumber,
    }: {
      userId: number;
      badgeNumber: number | null;
    }) => userService.assignFounderBadge(userId, badgeNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

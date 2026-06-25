import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ── Types ──────────────────────────────────────────────────────────────────────

export type LikedItem = {
  id: string;
  productId: string;
  userId: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
    category: string | null;
    rating?: number | null;
  };
};

// ── API helpers ────────────────────────────────────────────────────────────────
// Adjust BASE_URL to match your env setup

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "";

async function fetchLikedItems(userId: string): Promise<LikedItem[]> {
  const res = await fetch(`${BASE_URL}/api/users/${userId}/likes`);
  if (!res.ok) throw new Error("Failed to fetch liked items");
  return res.json();
}

async function removeLikedItem(likeId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/likes/${likeId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to remove liked item");
}

// ── Hooks ──────────────────────────────────────────────────────────────────────

export function useLikedItems(userId: string) {
  return useQuery({
    queryKey: ["likedItems", userId],
    queryFn: () => fetchLikedItems(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 min
  });
}

export function useRemoveLikedItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeLikedItem,
    // Optimistic update: remove the item instantly before the server responds
    onMutate: async (likeId: string) => {
      await queryClient.cancelQueries({ queryKey: ["likedItems"] });

      const previousData = queryClient.getQueriesData<LikedItem[]>({
        queryKey: ["likedItems"],
      });

      queryClient.setQueriesData<LikedItem[]>(
        { queryKey: ["likedItems"] },
        (old) => old?.filter((item) => item.id !== likeId) ?? []
      );

      return { previousData };
    },
    onError: (_err, _likeId, context) => {
      // Roll back on failure
      context?.previousData.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["likedItems"] });
    },
  });
}

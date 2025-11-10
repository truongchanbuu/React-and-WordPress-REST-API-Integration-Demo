import { useQuery } from "@tanstack/react-query";
import {
  getPosts,
  GetPostsParams,
  WordPressPostListItem,
} from "../api/wordpressApi";

export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (filters: GetPostsParams) => [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: number) => [...postKeys.details(), id] as const,
};

export function usePosts(params: GetPostsParams = {}) {
  return useQuery<WordPressPostListItem[], Error>({
    queryKey: postKeys.list(params),
    queryFn: () => getPosts(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}


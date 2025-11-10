/**
 * React Query hook for fetching single WordPress post
 * Provides caching, refetching, and error handling
 */

import { useQuery } from '@tanstack/react-query';
import { getPostById, getPostBySlug, WordPressPost } from '../api/wordpressApi';
import { postKeys } from './usePosts';

/**
 * Hook to fetch single WordPress post by ID
 * @param id - Post ID
 * @param enabled - Whether to enable the query (default: true)
 * @returns React Query result with post data
 */
export function usePostDetail(id: number | null, enabled: boolean = true) {
  return useQuery<WordPressPost, Error>({
    queryKey: postKeys.detail(id!),
    queryFn: () => getPostById(id!),
    enabled: enabled && id !== null,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to fetch single WordPress post by slug
 * @param slug - Post slug
 * @param enabled - Whether to enable the query (default: true)
 * @returns React Query result with post data
 */
export function usePostDetailBySlug(slug: string | null, enabled: boolean = true) {
  return useQuery<WordPressPost | null, Error>({
    queryKey: ['posts', 'detail', 'slug', slug],
    queryFn: () => getPostBySlug(slug!),
    enabled: enabled && slug !== null,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}


/**
 * WordPress REST API integration
 * Handles all WordPress API endpoints and data transformations
 */

import { apiCall } from "./apiClient";

// Base URL for WordPress REST API
const WORDPRESS_API_BASE = "https://wordpress.org/news/wp-json/wp/v2";

// WordPress API response types
export interface WordPressMedia {
  id: number;
  source_url: string;
  alt_text: string;
  media_details?: {
    sizes?: {
      thumbnail?: { source_url: string };
      medium?: { source_url: string };
      large?: { source_url: string };
      full?: { source_url: string };
    };
  };
}

export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: Record<string, any>;
  categories: number[];
  tags: number[];
  _embedded?: {
    "wp:featuredmedia"?: WordPressMedia[];
    author?: Array<{
      id: number;
      name: string;
      url: string;
    }>;
  };
}

export interface WordPressPostListItem {
  id: number;
  title: string;
  excerpt: string;
  featuredImage?: string;
  slug: string;
  date: string;
  link: string;
}

export interface GetPostsParams {
  page?: number;
  per_page?: number;
  search?: string;
  categories?: number[];
  tags?: number[];
  orderby?: "date" | "title" | "relevance";
  order?: "asc" | "desc";
}

function getFeaturedImageUrl(post: WordPressPost): string | undefined {
  if (!post.featured_media || !post._embedded?.["wp:featuredmedia"]?.[0]) {
    return undefined;
  }

  const media = post._embedded["wp:featuredmedia"][0];

  return (
    media.media_details?.sizes?.medium?.source_url ||
    media.media_details?.sizes?.large?.source_url ||
    media.source_url
  );
}

function transformPostToListItem(post: WordPressPost): WordPressPostListItem {
  const excerpt = post.excerpt.rendered
    .replace(/<[^>]*>/g, "")
    .trim()
    .substring(0, 150);

  return {
    id: post.id,
    title: post.title.rendered,
    excerpt: excerpt + (excerpt.length >= 150 ? "..." : ""),
    featuredImage: getFeaturedImageUrl(post),
    slug: post.slug,
    date: post.date,
    link: post.link,
  };
}

export async function getPosts(
  params: GetPostsParams = {}
): Promise<WordPressPostListItem[]> {
  const {
    page = 1,
    per_page = 10,
    search,
    categories,
    tags,
    orderby = "date",
    order = "desc",
  } = params;

  const queryParams: Record<string, any> = {
    page,
    per_page,
    orderby,
    order,
  };

  if (search) {
    queryParams.search = search;
  }

  if (categories && categories.length > 0) {
    queryParams.categories = categories.join(",");
  }

  if (tags && tags.length > 0) {
    queryParams.tags = tags.join(",");
  }

  const posts = await apiCall<WordPressPost[]>(
    `${WORDPRESS_API_BASE}/posts`,
    queryParams
  );

  return posts.map(transformPostToListItem);
}

export async function getPostById(id: number): Promise<WordPressPost> {
  const post = await apiCall<WordPressPost>(
    `${WORDPRESS_API_BASE}/posts/${id}`,
    {
      _embed: true,
    }
  );

  return post;
}

export async function getPostBySlug(
  slug: string
): Promise<WordPressPost | null> {
  const posts = await apiCall<WordPressPost[]>(`${WORDPRESS_API_BASE}/posts`, {
    slug,
    _embed: true,
    per_page: 1,
  });

  return posts.length > 0 ? posts[0] : null;
}

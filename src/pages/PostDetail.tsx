import { useParams, Link, useNavigate } from "react-router-dom";
import { HiArrowLeft, HiArrowRight, HiCalendar, HiUser } from "react-icons/hi";
import { usePostDetail } from "../hooks/usePostDetail";
import { Loader } from "../components/Loader";
import { ErrorMessage } from "../components/ErrorMessage";
import { Seo } from "../seo/Seo";
import { stripHtmlTags, formatDate } from "../utils";

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const postId = id ? parseInt(id, 10) : null;

  const {
    data: post,
    isLoading,
    isError,
    error,
    refetch,
  } = usePostDetail(postId, postId !== null);

  const featuredImage =
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    post?._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.large
      ?.source_url;

  // Get author name
  const authorName = post?._embedded?.author?.[0]?.name || "Unknown Author";

  // Extract meta description from excerpt
  const metaDescription = post
    ? stripHtmlTags(post.excerpt.rendered).substring(0, 160)
    : "";

  return (
    <>
      <Seo
        title={post?.title.rendered}
        description={metaDescription}
        image={featuredImage}
        type="article"
      />

      <main className="min-h-screen bg-gray-50">
        {/* Loading State */}
        {isLoading && <Loader />}

        {/* Error State */}
        {isError && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ErrorMessage error={error} onRetry={() => refetch()} />
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
              >
                <HiArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                Back to Home
              </button>
            </div>
          </div>
        )}

        {/* Post Content */}
        {post && (
          <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Button */}
            <nav className="mb-6">
              <Link
                to="/"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
              >
                <HiArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                Back to Posts
              </Link>
            </nav>

            {/* Featured Image */}
            {featuredImage && (
              <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={featuredImage}
                  alt={post.title.rendered}
                  className="w-full h-auto object-cover"
                  loading="eager"
                />
              </div>
            )}

            {/* Header */}
            <header className="mb-8">
              <h1
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <time dateTime={post.date} className="flex items-center">
                  <HiCalendar className="w-4 h-4 mr-2" aria-hidden="true" />
                  {formatDate(post.date)}
                </time>

                <span className="flex items-center">
                  <HiUser className="w-4 h-4 mr-2" aria-hidden="true" />
                  {authorName}
                </span>
              </div>
            </header>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none bg-white rounded-lg shadow-md p-8"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />

            {/* Footer */}
            <footer className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {post.categories && post.categories.length > 0 && (
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Categories:</span>
                    <span>{post.categories.join(", ")}</span>
                  </div>
                )}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Tags:</span>
                    <span>{post.tags.join(", ")}</span>
                  </div>
                )}
              </div>

              {/* Original Link */}
              <div className="mt-4">
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  View original post on WordPress.org
                  <HiArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
                </a>
              </div>
            </footer>
          </article>
        )}
      </main>
    </>
  );
}

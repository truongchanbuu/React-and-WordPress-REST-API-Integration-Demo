import { Link } from "react-router-dom";
import { HiOutlinePhotograph, HiArrowRight } from "react-icons/hi";
import { WordPressPostListItem } from "../api/wordpressApi";
import { formatDate } from "../utils";

interface PostCardProps {
  post: WordPressPostListItem;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Featured Image */}
      {post.featuredImage ? (
        <Link to={`/post/${post.id}`} className="block">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
        </Link>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
          <HiOutlinePhotograph
            className="w-16 h-16 text-primary-400"
            aria-hidden="true"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Date */}
        <time dateTime={post.date} className="text-sm text-gray-500 block mb-2">
          {formatDate(post.date)}
        </time>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-primary-600 transition-colors">
          <Link to={`/post/${post.id}`} className="hover:underline">
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

        {/* Read More Link */}
        <Link
          to={`/post/${post.id}`}
          className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors"
        >
          Read More
          <HiArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

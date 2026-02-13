import { useTheme } from '../utils/theme';
import type { Post } from '../types/post';

interface PostNavigationProps {
  previousPost?: Post;
  nextPost?: Post;
}

export default function PostNavigation({
  previousPost,
  nextPost
}: PostNavigationProps) {
  const { resolvedTheme } = useTheme();

  if (!previousPost && !nextPost) {
    return null;
  }

  return (
    <nav className="flex justify-between pt-6 mt-6 mb-16 border-t border-gray-200 dark:border-gray-700">
      <div className="w-1/2 pr-4">
        {previousPost && (
          <a href={`/post/${previousPost.slug}`}>
            <div
              className={`group cursor-pointer p-4 rounded-lg transition-all duration-200 ${
                resolvedTheme === 'dark'
                  ? 'bg-gray-800/50 hover:bg-gray-800'
                  : 'bg-[#f9f9f9] hover:bg-gray-200'
              }`}
            >
              <div className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                ← Previous
              </div>
              <div
                className={`font-medium text-sm line-clamp-2 ${
                  resolvedTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}
              >
                {previousPost.frontMatter.title}
              </div>
            </div>
          </a>
        )}
      </div>

      <div className="w-1/2 pl-4">
        {nextPost && (
          <a href={`/post/${nextPost.slug}`}>
            <div
              className={`group cursor-pointer p-4 rounded-lg transition-all duration-200 text-right ${
                resolvedTheme === 'dark'
                  ? 'bg-gray-800/50 hover:bg-gray-800'
                  : 'bg-[#f9f9f9] hover:bg-gray-200'
              }`}
            >
              <div className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                Next →
              </div>
              <div
                className={`font-medium text-sm line-clamp-2 ${
                  resolvedTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}
              >
                {nextPost.frontMatter.title}
              </div>
            </div>
          </a>
        )}
      </div>
    </nav>
  );
}

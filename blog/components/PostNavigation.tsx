import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Post } from '../@types/post';

interface PostNavigationProps {
  previousPost?: Post;
  nextPost?: Post;
}

export default function PostNavigation({ previousPost, nextPost }: PostNavigationProps) {
  const { resolvedTheme } = useTheme();

  if (!previousPost && !nextPost) {
    return null;
  }

  return (
    <nav className="flex justify-between pt-8 mt-6 mb-16 border-t border-gray-200 dark:border-gray-700">
      <div className="w-1/2 pr-4">
        {previousPost && (
          <Link href={`/post/${previousPost.slug}`}>
            <div className={`group cursor-pointer p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
              resolvedTheme === 'dark' 
                ? 'border-gray-700 hover:border-gray-600 bg-gray-800/50 hover:bg-gray-800' 
                : 'border-gray-200 hover:border-gray-300 bg-gray-50/50 hover:bg-gray-50'
            }`}>
              <div className="mb-1 text-sm text-gray-500 dark:text-gray-400">← Previous</div>
              <div className={`font-medium text-sm line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 ${
                resolvedTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}>
                {previousPost.frontMatter.title}
              </div>
            </div>
          </Link>
        )}
      </div>
      
      <div className="w-1/2 pl-4">
        {nextPost && (
          <Link href={`/post/${nextPost.slug}`}>
            <div className={`group cursor-pointer p-4 rounded-lg border transition-all duration-200 hover:shadow-md text-right ${
              resolvedTheme === 'dark' 
                ? 'border-gray-700 hover:border-gray-600 bg-gray-800/50 hover:bg-gray-800' 
                : 'border-gray-200 hover:border-gray-300 bg-gray-50/50 hover:bg-gray-50'
            }`}>
              <div className="mb-1 text-sm text-gray-500 dark:text-gray-400">Next →</div>
              <div className={`font-medium text-sm line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 ${
                resolvedTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}>
                {nextPost.frontMatter.title}
              </div>
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
}
